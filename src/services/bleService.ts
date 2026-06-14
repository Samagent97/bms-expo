import { Buffer } from "buffer";
import { BleManager, Device, Subscription } from "react-native-ble-plx";
import { BmsDevice } from "../models/battery";
import { bytesToHex, NOTIFY_CHAR_UUID, SERVICE_UUID, TARGET_NAME, TARGET_SERVICE_PREFIX, WRITE_CHAR_UUID } from "./protocol";
import { logger } from "./logger";

type Pending = {
  resolve: (bytes: number[]) => void;
  reject: (error: Error) => void;
  buffer: number[];
  expectedLength?: number;
  timer: ReturnType<typeof setTimeout>;
};

class BleService {
  private manager = new BleManager();
  private connected?: Device;
  private notifySub?: Subscription;
  private pending?: Pending;

  scan(onDevice: (device: BmsDevice) => void): void {
    this.manager.startDeviceScan(null, { allowDuplicates: true }, (error, device) => {
      if (error) {
        logger.push("error", `scan failed: ${error.message}`);
        return;
      }
      if (!device) return;
      const name = device.name ?? device.localName ?? "";
      const serviceUuids = (device.serviceUUIDs ?? []).map((uuid) => uuid.toUpperCase());
      const matches = name === TARGET_NAME || serviceUuids.some((uuid) => uuid.startsWith(TARGET_SERVICE_PREFIX));
      if (!matches) return;
      onDevice({ id: device.id, name: name || TARGET_NAME, rssi: device.rssi });
    });
  }

  stopScan(): void {
    this.manager.stopDeviceScan();
  }

  async connect(id: string): Promise<BmsDevice> {
    this.stopScan();
    const device = await this.manager.connectToDevice(id, { timeout: 10000 });
    const discovered = await device.discoverAllServicesAndCharacteristics();
    this.connected = discovered;
    await this.installNotifications(discovered);
    logger.push("info", `connected ${discovered.name ?? discovered.id}`);
    return { id: discovered.id, name: discovered.name ?? TARGET_NAME, rssi: discovered.rssi };
  }

  async disconnect(): Promise<void> {
    this.notifySub?.remove();
    this.notifySub = undefined;
    if (this.connected) await this.manager.cancelDeviceConnection(this.connected.id);
    this.connected = undefined;
  }

  async send(command: number[], expectedLength?: number): Promise<number[]> {
    if (!this.connected) throw new Error("No BLE device connected");
    if (this.pending) throw new Error("A BLE command is already in progress");
    logger.push("debug", `tx ${bytesToHex(command)}`);
    const promise = new Promise<number[]>((resolve, reject) => {
      this.pending = {
        resolve,
        reject,
        buffer: [],
        expectedLength,
        timer: setTimeout(() => {
          this.pending = undefined;
          reject(new Error("BLE response timeout"));
        }, 8000)
      };
    });
    for (let i = 0; i < command.length; i += 20) {
      const chunk = command.slice(i, i + 20);
      const base64 = Buffer.from(chunk).toString("base64");
      try {
        await this.connected.writeCharacteristicWithoutResponseForService(SERVICE_UUID, WRITE_CHAR_UUID, base64);
      } catch {
        await this.connected.writeCharacteristicWithResponseForService(SERVICE_UUID, WRITE_CHAR_UUID, base64);
      }
    }
    return promise;
  }

  private async installNotifications(device: Device): Promise<void> {
    this.notifySub?.remove();
    this.notifySub = device.monitorCharacteristicForService(SERVICE_UUID, NOTIFY_CHAR_UUID, (error, characteristic) => {
      if (error) {
        logger.push("warn", `notify error: ${error.message}`);
        return;
      }
      const value = characteristic?.value;
      if (!value || !this.pending) return;
      const incoming = Array.from(Buffer.from(value, "base64"));
      this.pending.buffer.push(...incoming);
      if (this.pending.expectedLength === undefined && this.pending.buffer.length >= 3) {
        this.pending.expectedLength = ((this.pending.buffer[2] ?? 0) + 5);
      }
      const expected = this.pending.expectedLength;
      if (expected !== undefined && this.pending.buffer.length >= expected) {
        const pending = this.pending;
        clearTimeout(pending.timer);
        this.pending = undefined;
        const frame = pending.buffer.slice(0, expected);
        logger.push("debug", `rx ${bytesToHex(frame)}`);
        pending.resolve(frame);
      }
    });
  }
}

export const bleService = new BleService();
