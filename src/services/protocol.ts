import { BatterySnapshot, HealthState, ParameterSettings, SwitchState, TemperatureSnapshot } from "../models/battery";

export const SERVICE_UUID = "6953FF00-0000-1000-8000-00805F9B34FB";
export const WRITE_CHAR_UUID = "6953FF01-0000-1000-8000-00805F9B34FB";
export const NOTIFY_CHAR_UUID = "6953FF02-0000-1000-8000-00805F9B34FB";
export const TARGET_NAME = "BRT_AFE2616";
export const TARGET_SERVICE_PREFIX = "6953FF00";

export function crc16Modbus(data: number[]): number[] {
  let crc = 0xffff;
  for (const byte of data) {
    crc ^= byte & 0xff;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 1) !== 0 ? (crc >> 1) ^ 0xa001 : crc >> 1;
    }
  }
  return [crc & 0xff, (crc >> 8) & 0xff];
}

export function command(functionCode: number, address: number, valueOrLength: number, data: number[] = []): number[] {
  const frame = [0xaa, functionCode, (address >> 8) & 0xff, address & 0xff, (valueOrLength >> 8) & 0xff, valueOrLength & 0xff, ...data];
  return [...frame, ...crc16Modbus(frame)];
}

export const Commands = {
  readSwitches: () => command(0x01, 0x0001, 0x0003),
  readHealth: () => command(0x02, 0x1001, 0x0004),
  readDashboard: () => command(0x04, 0x7531, 0x0018),
  readTemperatures: () => command(0x04, 0x7547, 0x0004),
  readParameters: () => command(0x03, 0x9c41, 0x001d),
  toggleCharge: (enabled: boolean) => command(0x05, 0x0001, enabled ? 0x0001 : 0x0000),
  toggleDischarge: (enabled: boolean) => command(0x05, 0x0002, enabled ? 0x0001 : 0x0000),
  toggleBalance: (enabled: boolean) => command(0x05, 0x0003, enabled ? 0x0001 : 0x0000),
  shutdown: () => command(0x05, 0x0004, 0x0001)
};

function u16(bytes: number[], offset: number): number {
  return ((bytes[offset] ?? 0) << 8) | (bytes[offset + 1] ?? 0);
}

function u32(bytes: number[], offset: number): number {
  return (((bytes[offset] ?? 0) << 24) >>> 0) + ((bytes[offset + 1] ?? 0) << 16) + ((bytes[offset + 2] ?? 0) << 8) + (bytes[offset + 3] ?? 0);
}

export function parseSwitches(frame: number[]): SwitchState {
  const data = frame[3] ?? 0;
  return {
    balanceEnabled: (data & 0x01) === 0x01,
    dischargeMosEnabled: (data & 0x02) === 0x02,
    chargeMosEnabled: (data & 0x04) === 0x04
  };
}

export function parseHealth(frame: number[]): HealthState {
  const data = frame[3] ?? 0;
  return {
    batteryGood: (data & 0x01) === 0x01,
    balanceGood: (data & 0x02) === 0x02,
    dischargeMosGood: (data & 0x04) === 0x04,
    chargeMosGood: (data & 0x10) === 0x10
  };
}

export function parseBattery(frame: number[]): BatterySnapshot {
  const data = frame.slice(3);
  const cellVoltages = Array.from({ length: 16 }, (_, index) => u16(data, 16 + index * 2) / 1000);
  return {
    socPercent: u16(data, 0),
    totalVoltage: u32(data, 2) / 1000,
    current: u32(data, 6) / 1000,
    maxCellVoltage: u16(data, 10) / 1000,
    minCellVoltage: u16(data, 12) / 1000,
    cycleCount: u16(data, 14),
    cellVoltages
  };
}

function temp(bytes: number[], offset: number): number {
  let high = bytes[offset] ?? 0;
  const negative = (high & 0x80) === 0x80;
  if (negative) high &= 0x7f;
  const value = (high << 8) | (bytes[offset + 1] ?? 0);
  return (negative ? -value : value) / 100;
}

export function parseTemperatures(frame: number[]): TemperatureSnapshot {
  const data = frame.slice(3);
  return { mos: temp(data, 0), balance: temp(data, 2), t1: temp(data, 4), t2: temp(data, 6) };
}

export function parseParameters(frame: number[]): ParameterSettings {
  const data = frame.slice(3);
  let o = 0;
  const read16 = () => { const v = u16(data, o); o += 2; return v; };
  const read32 = () => { const v = u32(data, o); o += 4; return v; };
  return {
    batteryType: read16(),
    seriesCount: read16(),
    singleOverVoltage: read16() / 1000,
    totalOverVoltage: read32() / 1000,
    singleUnderVoltage: read16() / 1000,
    totalUnderVoltage: read32() / 1000,
    chargeOverCurrent: read32() / 1000,
    dischargeOverCurrent: read32() / 1000,
    shortCircuitCurrent: read32() / 1000,
    dischargeOverCurrentAlarm: read32() / 1000,
    secondDischargeOverCurrent: read32() / 1000,
    mosTempLimit: read16(),
    balanceTempLimit: read16(),
    t1TempLimit: read16(),
    t2TempLimit: read16(),
    balanceLimitVoltage: read16() / 1000,
    balanceStartVoltage: read16() / 1000,
    balanceStartDiff: read16() / 1000,
    balanceEndDiff: read16() / 1000,
    chargeOverCurrentDelay: read16(),
    dischargeOverCurrentDelay: read16(),
    shortCircuitDelay: read16()
  };
}

const b16 = (v: number) => [(v >> 8) & 0xff, v & 0xff];
const b32 = (v: number) => [(v >> 24) & 0xff, (v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff];
const mv = (v: number) => Math.round(v * 1000);

export function writeParametersCommand(p: ParameterSettings): number[] {
  const body = [
    ...b16(Math.round(p.batteryType)), ...b16(Math.round(p.seriesCount)),
    ...b16(mv(p.singleOverVoltage)), ...b32(mv(p.totalOverVoltage)),
    ...b16(mv(p.singleUnderVoltage)), ...b32(mv(p.totalUnderVoltage)),
    ...b32(mv(p.chargeOverCurrent)), ...b32(mv(p.dischargeOverCurrent)),
    ...b32(mv(p.shortCircuitCurrent)), ...b32(mv(p.dischargeOverCurrentAlarm)),
    ...b32(mv(p.secondDischargeOverCurrent)),
    ...b16(Math.round(p.mosTempLimit)), ...b16(Math.round(p.balanceTempLimit)),
    ...b16(Math.round(p.t1TempLimit)), ...b16(Math.round(p.t2TempLimit)),
    ...b16(mv(p.balanceLimitVoltage)), ...b16(mv(p.balanceStartVoltage)),
    ...b16(mv(p.balanceStartDiff)), ...b16(mv(p.balanceEndDiff)),
    ...b16(Math.round(p.chargeOverCurrentDelay)), ...b16(Math.round(p.dischargeOverCurrentDelay)),
    ...b16(Math.round(p.shortCircuitDelay))
  ];
  return command(0x10, 0x9c41, 0x001d, [0x3a, ...body]);
}

export const bytesToHex = (bytes: number[]) => bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
