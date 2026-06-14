import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "./src/navigation/AppContext";
import { CellVoltagesScreen } from "./src/screens/CellVoltagesScreen";
import { ControlsScreen } from "./src/screens/ControlsScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { DeviceScanScreen } from "./src/screens/DeviceScanScreen";
import { LogsScreen } from "./src/screens/LogsScreen";
import { ParametersScreen } from "./src/screens/ParametersScreen";

export type RootTabs = {
  Scan: undefined;
  Dashboard: undefined;
  Cells: undefined;
  Controls: undefined;
  Settings: undefined;
  Logs: undefined;
};

const Tab = createBottomTabNavigator<RootTabs>();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: "#126f65" }}>
          <Tab.Screen name="Scan" component={DeviceScanScreen} />
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Cells" component={CellVoltagesScreen} />
          <Tab.Screen name="Controls" component={ControlsScreen} />
          <Tab.Screen name="Settings" component={ParametersScreen} />
          <Tab.Screen name="Logs" component={LogsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
