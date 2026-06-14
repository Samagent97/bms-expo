import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export function Screen({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </ScrollView>
  );
}

export function Card({ children }: React.PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

export const styles = StyleSheet.create({
  root: { padding: 16, gap: 12, backgroundColor: "#f6f7f9", minHeight: "100%" },
  title: { fontSize: 26, fontWeight: "700", color: "#15202b", marginBottom: 4 },
  card: { backgroundColor: "#fff", borderRadius: 8, padding: 14, gap: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: "#d8dee4" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  label: { color: "#586069", fontSize: 14 },
  value: { color: "#15202b", fontSize: 16, fontWeight: "700" },
  button: { backgroundColor: "#126f65", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14, alignItems: "center" },
  danger: { backgroundColor: "#b42318" },
  buttonText: { color: "#fff", fontWeight: "700" }
});
