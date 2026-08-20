export const BAUD_OPTIONS = [
  { label: "19200 bps", value: "1001" },
  { label: "9600 bps", value: "1000" },
  { label: "4800 bps", value: "0111" },
  { label: "2400 bps", value: "0110" },
  { label: "1200 bps", value: "0101" },
  { label: "600 bps", value: "0100" },
  { label: "300 bps", value: "0011" },
];

export const STOP_BIT_OPTIONS = [
  { label: "1 bit", value: "0" },
  { label: "2 bit", value: "1" },
];

export const PARITY_OPTIONS = [
  { label: "None", value: "00" },
  { label: "Odd (Lẻ)", value: "01" },
  { label: "Even (Chẵn)", value: "11" },
];

export const DATA_LENGTH_OPTIONS = [
  { label: "8 bit", value: "1" },
  { label: "7 bit", value: "0" },
];

export const HEADER_OPTIONS = [
  { label: "None", value: "0" },
  { label: "Có (D8124) — Mặc định STX (02H)", value: "1" },
];

export const TERMINATOR_OPTIONS = [
  { label: "None", value: "0" },
  { label: "Có (D8125) — Mặc định ETX (03H)", value: "1" },
];

export const CONTROL_LINE_NO_PROTOCOL = [
  { label: "Không sử dụng (RS-232C)", value: "000" },
  { label: "Terminal mode (RS-232C)", value: "001" },
  { label: "Interlink mode (RS-232C, FX2N V2.00+)", value: "010" },
  { label: "Normal mode 1 (RS-232C / RS-485)", value: "011" },
  { label: "Normal mode 2 (RS-232C, FX/FX2c only)", value: "101" },
];

export const CONTROL_LINE_COMPUTER_LINK = [
  { label: "RS-485 (RS-422) interface", value: "000" },
  { label: "RS-232C interface", value: "010" },
];

export const SUM_CHECK_OPTIONS = [
  { label: "Không thêm mã kiểm tra", value: "0" },
  { label: "Thêm tự động", value: "1" },
];

export const PROTOCOL_OPTIONS = [
  { label: "No protocol", value: "0" },
  { label: "Dedicated protocol (Computer link)", value: "1" },
];

export const TRANSMISSION_CONTROL_OPTIONS = [
  { label: "Protocol format 1", value: "0" },
  { label: "Protocol format 4", value: "1" },
];
