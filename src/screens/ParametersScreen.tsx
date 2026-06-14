import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Card, Screen, styles } from "../components/Screen";
import { ParameterSettings } from "../models/battery";
import { bmsRepository } from "../services/bmsRepository";

const fields: Array<[keyof ParameterSettings, string, string]> = [
  ["batteryType", "Battery type", ""], ["seriesCount", "Series count", "S"],
  ["singleOverVoltage", "Single over voltage", "V"], ["totalOverVoltage", "Total over voltage", "V"],
  ["singleUnderVoltage", "Single under voltage", "V"], ["totalUnderVoltage", "Total under voltage", "V"],
  ["chargeOverCurrent", "Charge over current", "A"], ["dischargeOverCurrent", "Discharge over current", "A"],
  ["shortCircuitCurrent", "Short circuit", "A"], ["dischargeOverCurrentAlarm", "Discharge alarm", "A"],
  ["secondDischargeOverCurrent", "Second discharge", "A"], ["mosTempLimit", "MOS temp", "C"],
  ["balanceTempLimit", "Balance temp", "C"], ["t1TempLimit", "T1 temp", "C"], ["t2TempLimit", "T2 temp", "C"],
  ["balanceLimitVoltage", "Balance limit", "V"], ["balanceStartVoltage", "Balance start", "V"],
  ["balanceStartDiff", "Start diff", "V"], ["balanceEndDiff", "End diff", "V"],
  ["chargeOverCurrentDelay", "Charge delay", "ms"], ["dischargeOverCurrentDelay", "Discharge delay", "ms"],
  ["shortCircuitDelay", "Short delay", "us"]
];

export function ParametersScreen() {
  const [params, setParams] = useState<ParameterSettings>();
  useEffect(() => { bmsRepository.readParameters().then(setParams); }, []);
  if (!params) return <Screen title="Parameter Settings"><Text>Loading...</Text></Screen>;
  return (
    <Screen title="Parameter Settings">
      {fields.map(([key, label, unit]) => (
        <Card key={key}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.row}>
            <TextInput
              keyboardType="numeric"
              value={String(params[key])}
              onChangeText={(text) => setParams({ ...params, [key]: Number(text) })}
              style={{ flex: 1, borderWidth: 1, borderColor: "#d8dee4", borderRadius: 8, padding: 10 }}
            />
            <Text style={styles.value}>{unit}</Text>
          </View>
        </Card>
      ))}
      <Pressable style={styles.button} onPress={() => bmsRepository.writeParameters(params)}><Text style={styles.buttonText}>Save Settings</Text></Pressable>
    </Screen>
  );
}
