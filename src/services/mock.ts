import { BatterySnapshot, BmsDevice, HealthState, ParameterSettings, SwitchState, TemperatureSnapshot } from "../models/battery";

export const mockDevice: BmsDevice = { id: "mock-bms", name: "BRT_AFE2616 Mock", rssi: -42 };
export const mockSwitches: SwitchState = { balanceEnabled: true, dischargeMosEnabled: true, chargeMosEnabled: true };
export const mockHealth: HealthState = { batteryGood: true, balanceGood: true, dischargeMosGood: true, chargeMosGood: true };
export const mockBattery = (): BatterySnapshot => ({
  socPercent: 86,
  totalVoltage: 52.71,
  current: 12.4,
  maxCellVoltage: 3.302,
  minCellVoltage: 3.288,
  cycleCount: 128,
  cellVoltages: Array.from({ length: 16 }, (_, i) => 3.29 + ((i % 5) * 0.003))
});
export const mockTemps: TemperatureSnapshot = { mos: 31.2, balance: 29.8, t1: 28.5, t2: 28.9 };
export const mockParams: ParameterSettings = {
  batteryType: 2, seriesCount: 16, singleOverVoltage: 4.2, totalOverVoltage: 67.2,
  singleUnderVoltage: 2.7, totalUnderVoltage: 43.2, chargeOverCurrent: 30,
  dischargeOverCurrent: 100, shortCircuitCurrent: 200, dischargeOverCurrentAlarm: 80,
  secondDischargeOverCurrent: 150, mosTempLimit: 90, balanceTempLimit: 90,
  t1TempLimit: 90, t2TempLimit: 90, balanceLimitVoltage: 4.2, balanceStartVoltage: 2.5,
  balanceStartDiff: 0.05, balanceEndDiff: 0.01, chargeOverCurrentDelay: 10,
  dischargeOverCurrentDelay: 10, shortCircuitDelay: 100
};
