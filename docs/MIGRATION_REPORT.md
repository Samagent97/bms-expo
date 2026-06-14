# BMS Migration Report

See the Kotlin repository's migration report for the full source analysis. This Expo version implements the same protocol:

- Device filter: name `BRT_AFE2616` or service prefix `6953FF00`.
- BLE service: `6953FF00-0000-1000-8000-00805F9B34FB`.
- Write characteristic: `6953FF01-0000-1000-8000-00805F9B34FB`.
- Notify characteristic: `6953FF02-0000-1000-8000-00805F9B34FB`.
- CRC16/MODBUS: init `0xFFFF`, polynomial `0xA001`, low byte first.
- Dynamic response length: `(thirdByte + 5)` bytes.
- Key commands: read coils `AA 01 0001 0003`, read discrete/status `AA 02 1001 0004`, read battery block `AA 04 7531 0018`, read temperatures `AA 04 7547 0004`, read params `AA 03 9C41 001D`, write params `AA 10 9C41 001D 3A ...`, function `0x05` controls.

The original four tabs are mapped to six screens: Device Scan, Dashboard, Cell Voltages, BMS Controls, Parameter Settings, and Logs.
