# Architecture

## Layers

- UI: React Native screens under `src/screens`.
- Shared app state: `src/navigation/AppContext.tsx`.
- Repository: `BmsRepository`, switching between mock mode and real BLE.
- BLE service: `bleService`, using `react-native-ble-plx`.
- Protocol: `protocol.ts`, containing UUIDs, CRC16/MODBUS, commands, parsers, and parameter serialization.
- Data: TypeScript models in `src/models/battery.ts`.

## Mock Mode

Mock mode is enabled by default. It makes the app immediately launchable in a simulator or device before BLE hardware is available.

## BLE Flow

1. Start scan with `BleManager.startDeviceScan`.
2. Filter `BRT_AFE2616` or advertised service prefix `6953FF00`.
3. Connect and discover services/characteristics.
4. Monitor notify characteristic `6953FF02`.
5. Write command chunks to `6953FF01`.
6. Assemble responses using fixed length or dynamic `(byte[2] + 5)` length.
7. Parse frames with protocol helpers.
