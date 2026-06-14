import React, { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import { Card, Screen, styles } from "../components/Screen";
import { logger, LogLine } from "../services/logger";

export function LogsScreen() {
  const [logs, setLogs] = useState<LogLine[]>([]);
  useEffect(() => logger.subscribe(setLogs), []);
  return (
    <Screen title="Logs">
      <Pressable style={styles.button} onPress={() => logger.clear()}><Text style={styles.buttonText}>Clear</Text></Pressable>
      {logs.map((line) => (
        <Card key={line.id}>
          <Text style={styles.label}>{line.time} · {line.level.toUpperCase()}</Text>
          <Text style={styles.value}>{line.text}</Text>
        </Card>
      ))}
    </Screen>
  );
}
