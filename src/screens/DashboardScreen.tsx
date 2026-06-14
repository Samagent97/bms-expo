import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Card, Screen, styles } from "../components/Screen";
import { BatterySnapshot, HealthState, SwitchState, TemperatureSnapshot } from "../models/battery";
import { bmsRepository } from "../services/bmsRepository";

export function DashboardScreen() {
  const [battery, setBattery] = useState<BatterySnapshot>();
  const [temps, setTemps] = useState<TemperatureSnapshot>();
  const [switches, setSwitches] = useState<SwitchState>();
  const [health, setHealth] = useState<HealthState>();
  const refresh = useCallback(async () => {
    setSwitches(await bmsRepository.readSwitches());
    setHealth(await bmsRepository.readHealth());
    setBattery(await bmsRepository.readBattery());
    setTemps(await bmsRepository.readTemperatures());
  }, []);
  useEffect(() => { refresh(); const id = setInterval(refresh, 5000); return () => clearInterval(id); }, [refresh]);
  const protection = battery?.cellVoltages.filter((v) => v < 2.8 || v > 4.2).length ?? 0;
  return (
    <Screen title="Dashboard">
      <Pressable style={styles.button} onPress={refresh}><Text style={styles.buttonText}>Refresh</Text></Pressable>
      <Card>
        <View style={styles.row}><Text style={styles.label}>SOC</Text><Text style={styles.value}>{battery?.socPercent ?? 0}%</Text></View>
        <View style={styles.row}><Text style={styles.label}>Total voltage</Text><Text style={styles.value}>{battery?.totalVoltage.toFixed(2) ?? "0.00"} V</Text></View>
        <View style={styles.row}><Text style={styles.label}>Current</Text><Text style={styles.value}>{battery?.current.toFixed(2) ?? "0.00"} A</Text></View>
        <View style={styles.row}><Text style={styles.label}>Cycles</Text><Text style={styles.value}>{battery?.cycleCount ?? 0}</Text></View>
      </Card>
      <Card>
        <View style={styles.row}><Text style={styles.label}>Charge MOS</Text><Text style={styles.value}>{switches?.chargeMosEnabled ? "On" : "Off"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Discharge MOS</Text><Text style={styles.value}>{switches?.dischargeMosEnabled ? "On" : "Off"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Balance</Text><Text style={styles.value}>{switches?.balanceEnabled ? "On" : "Off"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Battery health</Text><Text style={styles.value}>{health?.batteryGood ? "Good" : "Fault"}</Text></View>
      </Card>
      <Card>
        <View style={styles.row}><Text style={styles.label}>MOS temp</Text><Text style={styles.value}>{temps?.mos.toFixed(1) ?? "0.0"} C</Text></View>
        <View style={styles.row}><Text style={styles.label}>Balance temp</Text><Text style={styles.value}>{temps?.balance.toFixed(1) ?? "0.0"} C</Text></View>
        <View style={styles.row}><Text style={styles.label}>T1 / T2</Text><Text style={styles.value}>{temps?.t1.toFixed(1) ?? "0.0"} / {temps?.t2.toFixed(1) ?? "0.0"} C</Text></View>
      </Card>
      {protection ? <Card><Text style={styles.value}>Voltage protection warnings: {protection}</Text></Card> : null}
    </Screen>
  );
}
