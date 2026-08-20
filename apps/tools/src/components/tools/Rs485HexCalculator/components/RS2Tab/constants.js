export const CHANNELS = [
  {
    id: "ch0",
    name: "Channel 0 (ch0)",
    register: "D8370",
    description: "Cổng giao tiếp ch0 — Dùng thanh ghi D8370",
  },
  {
    id: "ch1",
    name: "Channel 1 (ch1)",
    register: "D8400",
    description: "Cổng giao tiếp ch1 — Dùng thanh ghi D8400",
  },
  {
    id: "ch2",
    name: "Channel 2 (ch2)",
    register: "D8420",
    description: "Cổng giao tiếp ch2 — Dùng thanh ghi D8420",
  },
];

export const DATA_LENGTH_OPTIONS = [
  { label: "8 bit", value: "1" },
  { label: "7 bit", value: "0" },
];

export const PARITY_OPTIONS = [
  { label: "None (Không dùng)", value: "00" },
  { label: "Odd (Lẻ)", value: "01" },
  { label: "Even (Chẵn)", value: "11" },
];

export const STOP_BIT_OPTIONS = [
  { label: "1 bit", value: "0" },
  { label: "2 bit", value: "1" },
];

export const BAUD_OPTIONS = [
  { label: "38400 bps", value: "1010" },
  { label: "19200 bps", value: "1001" },
  { label: "9600 bps", value: "1000" },
  { label: "4800 bps", value: "0111" },
  { label: "2400 bps", value: "0110" },
  { label: "1200 bps", value: "0101" },
  { label: "600 bps", value: "0100" },
  { label: "300 bps", value: "0011" },
];

export const HEADER_OPTIONS = [
  { label: "Not provided (Không dùng)", value: "0" },
  { label: "Provided *1 (Có dùng)", value: "1" },
];

export const TERMINATOR_OPTIONS = [
  { label: "Not provided (Không dùng)", value: "0" },
  { label: "Provided *1 (Có dùng)", value: "1" },
];

export const CONTROL_LINE_OPTIONS = [
  { label: "Not provided <RS-232C interface>", value: "000" },
  { label: "Standard mode <RS-232C interface>", value: "001" },
  { label: "Interlink mode <RS-232C interface>", value: "010" },
  { label: "Modem mode <RS-232C interface>", value: "011" },
  { label: "RS-485 / RS-422 interface", value: "111" },
];

export const SUM_CHECK_OPTIONS = [
  { label: "Not added (Không thêm)", value: "0" },
  { label: "Added *4 (Có thêm)", value: "1" },
];

export const PROTOCOL_OPTIONS = [
  { label: "Not used *3 (Phi giao thức)", value: "0" },
  { label: "Used (Có dùng giao thức)", value: "1" },
];

export const CONTROL_PROCEDURE_OPTIONS = [
  { label: "Format 1 (CR, LF: Not used)", value: "0" },
  { label: "Format 4 (CR, LF: Used)", value: "1" },
];



