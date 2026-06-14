import { BatterySnapshot, BmsDevice, HealthState, ParameterSettings, SwitchState, TemperatureSnapshot } from "../models/battery";
import { bleService } from "./bleService";
import { Commands, parseBattery, parseHealth, parseParameters, parseSwitches, parseTemperatures, writeParametersCommand } from "./protocol";
import { logger } from "./logger";
import { mockBattery, mockDevice, mockHealth, mockParams, mockSwitches, mockTemps } from "./mock";

export class BmsRepository {
  mockMode = true;
  connected?: BmsDevice;

  scan(onDevice: (device: BmsDevice) => void): void {
    if (this.mockMode) {
      onDevice(mockDevice);
      return;
    }
    bleService.scan(onDevice);
  }

  stopScan(): void {
    if (!this.mockMode) bleService.stopScan();
  }

  async connect(device: BmsDevice): Promise<void> {
    this.connected = this.mockMode ? device : await bleService.connect(device.id);
    logger.push("info", `repository connected ${this.connected.name}`);
  }

  async disconnect(): Promise<void> {
    if (!this.mockMode) await bleService.disconnect();
    this.connected = undefined;
  }

  async readSwitches(): Promise<SwitchState> {
    return this.mockMode ? mockSwitches : parseSwitches(await bleService.send(Commands.readSwitches()));
  }

  async readHealth(): Promise<HealthState> {
    return this.mockMode ? mockHealth : parseHealth(await bleService.send(Commands.readHealth()));
  }

  async readBattery(): Promise<BatterySnapshot> {
    return this.mockMode ? mockBattery() : parseBattery(await bleService.send(Commands.readDashboard()));
  }

  async readTemperatures(): Promise<TemperatureSnapshot> {
    return this.mockMode ? mockTemps : parseTemperatures(await bleService.send(Commands.readTemperatures()));
  }

  async readParameters(): Promise<ParameterSettings> {
    return this.mockMode ? mockParams : parseParameters(await bleService.send(Commands.readParameters(), 63));
  }

  async writeParameters(params: ParameterSettings): Promise<void> {
    if (!this.mockMode) await bleService.send(writeParametersCommand(params), 8);
    logger.push("info", "parameters saved");
  }

  async setCharge(enabled: boolean): Promise<void> {
    if (!this.mockMode) await bleService.send(Commands.toggleCharge(enabled));
  }

  async setDischarge(enabled: boolean): Promise<void> {
    if (!this.mockMode) await bleService.send(Commands.toggleDischarge(enabled));
  }

  async setBalance(enabled: boolean): Promise<void> {
    if (!this.mockMode) await bleService.send(Commands.toggleBalance(enabled));
  }

  async shutdown(): Promise<void> {
    if (!this.mockMode) await bleService.send(Commands.shutdown());
  }
}

export const bmsRepository = new BmsRepository();
