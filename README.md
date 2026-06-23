# EVTOP BMS Expo

Expo React Native TypeScript replacement for the UniApp BMS application.

## Test On Phones

BLE will not work in Expo Go. Use an installed native build: Android APK for Android, and an EAS/TestFlight/internal build for iPhone.

### Development Build

```bash
npm install
npm run android
npm run start
```

Then open the installed `EVTOP BMS` development app on your Android phone.

### APK With EAS

```bash
npm install
npm install -g eas-cli
eas login
npm run build:apk
```

Install the APK from the EAS build link on your phone. Mock mode is enabled by default, so you can test screens before connecting to the real BMS.

### iPhone Build

```bash
npm install
npm install -g eas-cli
eas login
npm run build:ios
```

The iOS build requires Apple credentials and a real iPhone for BLE testing. Use the `preview` EAS profile for internal testing, or `production` for App Store/TestFlight submission.

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

## Android APK Build

```bash
npm install -g eas-cli
eas login
npm run build:apk
```

The `preview` EAS profile generates an Android APK.

## iOS Build

```bash
npm install -g eas-cli
eas login
npm run build:ios
```

The `preview` EAS profile creates an internal iPhone build. The `production` profile is for App Store/TestFlight:

```bash
npm run build:ios:store
```

## Notes

The original source project is not modified. See `docs/MIGRATION_REPORT.md` for protocol mapping.
Architecture and validation guidance are in `docs/ARCHITECTURE.md` and `docs/TESTING_CHECKLIST.md`.
