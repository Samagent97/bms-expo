import React, { createContext, useContext, useMemo, useState } from "react";
import { BmsDevice } from "../models/battery";
import { bmsRepository } from "../services/bmsRepository";

type AppState = {
  mockMode: boolean;
  setMockMode: (value: boolean) => void;
  connected?: BmsDevice;
  setConnected: (device?: BmsDevice) => void;
};

const Context = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: React.PropsWithChildren) {
  const [mockMode, setMockModeState] = useState(true);
  const [connected, setConnected] = useState<BmsDevice | undefined>();
  const setMockMode = (value: boolean) => {
    bmsRepository.mockMode = value;
    setMockModeState(value);
  };
  const value = useMemo(() => ({ mockMode, setMockMode, connected, setConnected }), [mockMode, connected]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAppState(): AppState {
  const value = useContext(Context);
  if (!value) throw new Error("AppProvider missing");
  return value;
}
