# Testing Checklist

- Install dependencies with `npm install`.
- Run `npm run typecheck`.
- Start dev client with `npm run start`.
- Launch mock mode and open all six tabs.
- Confirm dashboard, cells, controls, parameters, and logs render.
- Build/run dev client with `npm run android`.
- Disable mock mode on Android hardware.
- Grant BLE permissions.
- Scan for `BRT_AFE2616`.
- Connect and verify service discovery.
- Verify read commands update dashboard, cells, temperatures, and parameters.
- Verify write commands control MOS/balance and save parameters.
- Build APK with `npm run build:apk`.
