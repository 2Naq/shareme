import { MITSUBISHI_FAULTS, MITSUBISHI_REGISTERS } from "./data-mitsubishi";
import { OMRON_FAULTS, OMRON_REGISTERS } from "./data-omron";
import { WECON_FAULTS, WECON_REGISTERS } from "./data-wecon";

export * from "./types";
export { MITSUBISHI_FAULTS, MITSUBISHI_REGISTERS } from "./data-mitsubishi";
export { OMRON_FAULTS, OMRON_REGISTERS } from "./data-omron";
export { WECON_FAULTS, WECON_REGISTERS } from "./data-wecon";

export const ALL_FAULTS = [
  ...MITSUBISHI_FAULTS,
  ...OMRON_FAULTS,
  ...WECON_FAULTS,
];

export const ALL_REGISTERS = [
  ...MITSUBISHI_REGISTERS,
  ...OMRON_REGISTERS,
  ...WECON_REGISTERS,
];
