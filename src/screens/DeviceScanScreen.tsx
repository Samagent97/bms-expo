import React, { useEffect, useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { Card, Screen, styles } from "../components/Screen";
import { BmsDevice } from "../models/battery";
import { bmsRepository } from "../services/bmsRepository";
import { useAppState } from "../navigation/AppContext";

export function DeviceScanScreen() {
  const { mockMode, setMockMode, connected, setConnected } = useAppState();
  const [devices, setDevices] = useState<BmsDevice[]>([]);

  useEffect(() => {
    setDevices([]);
    bmsRepository.scan((device) => setDevices((current) => current.some((d) => d.id === device.id) ? current : [...current, device].sort((a, b) => (b.rssi ?? -999) - (a.rssi ?? -999))));
    return () => bmsRepository.stopScan();
  }, [mockMode]);

  return (
    <Screen title="Device Scan">
      <Card>
        <View style={styles.row}>
          <Text style={styles.value}>Mock data mode</Text>
          <Switch value={mockMode} onValueChange={setMockMode} />
        </View>
        {connected ? <Text style={styles.label}>Connected to {connected.name}</Text> : <Text style={styles.label}>Scanning for BRT_AFE2616 devices</Text>}
      </Card>
      {devices.map((device) => (
        <Card key={device.id}>
          <View style={styles.row}>
            <View>
              <Text style={styles.value}>{device.name}</Text>
              <Text style={styles.label}>{device.id} · RSSI {device.rssi ?? "n/a"}</Text>
            </View>
            <Pressable style={styles.button} onPress={async () => { await bmsRepository.connect(device); setConnected(bmsRepository.connected); }}>
              <Text style={styles.buttonText}>Connect</Text>
            </Pressable>
          </View>
        </Card>
      ))}
      {connected ? (
        <Pressable style={[styles.button, styles.danger]} onPress={async () => { await bmsRepository.disconnect(); setConnected(undefined); }}>
          <Text style={styles.buttonText}>Disconnect</Text>
        </Pressable>
      ) : null}
    </Screen>
  );
}
