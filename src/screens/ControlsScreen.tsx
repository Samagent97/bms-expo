import React, { useEffect, useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { Card, Screen, styles } from "../components/Screen";
import { bmsRepository } from "../services/bmsRepository";

export function ControlsScreen() {
  const [charge, setCharge] = useState(false);
  const [discharge, setDischarge] = useState(false);
  const [balance, setBalance] = useState(false);
  useEffect(() => { bmsRepository.readSwitches().then((s) => { setCharge(s.chargeMosEnabled); setDischarge(s.dischargeMosEnabled); setBalance(s.balanceEnabled); }); }, []);
  return (
    <Screen title="BMS Controls">
      <Card><View style={styles.row}><Text style={styles.value}>Charge MOS</Text><Switch value={charge} onValueChange={async (v) => { await bmsRepository.setCharge(v); setCharge(v); }} /></View></Card>
      <Card><View style={styles.row}><Text style={styles.value}>Discharge MOS</Text><Switch value={discharge} onValueChange={async (v) => { await bmsRepository.setDischarge(v); setDischarge(v); }} /></View></Card>
      <Card><View style={styles.row}><Text style={styles.value}>Balance</Text><Switch value={balance} onValueChange={async (v) => { await bmsRepository.setBalance(v); setBalance(v); }} /></View></Card>
      <Pressable style={[styles.button, styles.danger]} onPress={() => bmsRepository.shutdown()}><Text style={styles.buttonText}>BMS Shutdown</Text></Pressable>
    </Screen>
  );
}
