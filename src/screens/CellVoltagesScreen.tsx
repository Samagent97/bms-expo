import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Card, Screen, styles } from "../components/Screen";
import { bmsRepository } from "../services/bmsRepository";

export function CellVoltagesScreen() {
  const [cells, setCells] = useState<number[]>([]);
  useEffect(() => { bmsRepository.readBattery().then((b) => setCells(b.cellVoltages)); }, []);
  return (
    <Screen title="Cell Voltages">
      {cells.map((voltage, index) => (
        <Card key={index}>
          <View style={styles.row}>
            <Text style={styles.label}>Cell {index + 1}</Text>
            <Text style={styles.value}>{voltage.toFixed(3)} V</Text>
          </View>
        </Card>
      ))}
    </Screen>
  );
}
