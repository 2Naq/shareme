export const PROTOCOL_OPTIONS = [
  { label: "MITSUBISHI FX2N Protocol", value: "0000" },
  { label: "MODBUS Slave", value: "0100" },
  { label: "MODBUS RTU Master", value: "1000" },
  { label: "Free Communication", value: "1100" },
];

export const BAUD_OPTIONS = [
  { label: "115200 bps", value: "1101" },
  { label: "57600 bps", value: "1011" },
  { label: "38400 bps", value: "1010" },
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
