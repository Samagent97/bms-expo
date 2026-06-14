export type BmsDevice = {
  id: string;
  name: string;
  rssi?: number | null;
};

export type SwitchState = {
  balanceEnabled: boolean;
  dischargeMosEnabled: boolean;
  chargeMosEnabled: boolean;
};

export type HealthState = {
  batteryGood: boolean;
  balanceGood: boolean;
  dischargeMosGood: boolean;
  chargeMosGood: boolean;
};

export type BatterySnapshot = {
  socPercent: number;
  totalVoltage: number;
  current: number;
  maxCellVoltage: number;
  minCellVoltage: number;
  cycleCount: number;
  cellVoltages: number[];
};

export type TemperatureSnapshot = {
  mos: number;
  balance: number;
  t1: number;
  t2: number;
};

export type ParameterSettings = {
  batteryType: number;
  seriesCount: number;
  singleOverVoltage: number;
  totalOverVoltage: number;
  singleUnderVoltage: number;
  totalUnderVoltage: number;
  chargeOverCurrent: number;
  dischargeOverCurrent: number;
  shortCircuitCurrent: number;
  dischargeOverCurrentAlarm: number;
  secondDischargeOverCurrent: number;
  mosTempLimit: number;
  balanceTempLimit: number;
  t1TempLimit: number;
  t2TempLimit: number;
  balanceLimitVoltage: number;
  balanceStartVoltage: number;
  balanceStartDiff: number;
  balanceEndDiff: number;
  chargeOverCurrentDelay: number;
  dischargeOverCurrentDelay: number;
  shortCircuitDelay: number;
};
