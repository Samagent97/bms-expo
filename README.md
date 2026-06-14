# BMS Expo

Expo React Native TypeScript replacement for the UniApp BMS application.

## Features

- Mock data mode enabled by default.
- BLE scan/connect/disconnect with `react-native-ble-plx`.
- Service and characteristic constants from the reference app.
- Command transmission with 20-byte chunks.
- Notification response assembly with dynamic and fixed response lengths.
- CRC16/MODBUS, battery parser, parameter parser, controls, logs.

## Setup

```bash
npm install
npm run typecheck
npm run start
```

BLE requires an Expo development build, not Expo Go:

```bash
npm run android
```

## APK Build

```bash
npm install -g eas-cli
eas login
npm run build:apk
```

The `preview` EAS profile generates an Android APK.

## Notes

The original source project is not modified. See `docs/MIGRATION_REPORT.md` for protocol mapping.
Architecture and validation guidance are in `docs/ARCHITECTURE.md` and `docs/TESTING_CHECKLIST.md`.
