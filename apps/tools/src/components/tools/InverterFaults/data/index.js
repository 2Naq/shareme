import { MITSUBISHI_FAULTS, MITSUBISHI_REGISTERS } from "./data-mitsubishi";
import { SIEMENS_FAULTS, SIEMENS_REGISTERS } from "./data-siemens";
import { ABB_FAULTS, ABB_REGISTERS } from "./data-abb";
import { SCHNEIDER_FAULTS, SCHNEIDER_REGISTERS } from "./data-schneider";
import { LS_FAULTS, LS_REGISTERS } from "./data-ls";
import { DELTA_FAULTS, DELTA_REGISTERS } from "./data-delta";
import { INVT_FAULTS, INVT_REGISTERS } from "./data-invt";
import { OMRON_FAULTS, OMRON_REGISTERS } from "./data-omron";
import { WECON_FAULTS, WECON_REGISTERS } from "./data-wecon";
import { SHIHLIN_FAULTS, SHIHLIN_REGISTERS } from "./data-shihlin";
import { KAMAN_FAULTS, KAMAN_REGISTERS } from "./data-kaman";
import { ARINCO_FAULTS, ARINCO_REGISTERS } from "./data-arinco";
import { KOC_FAULTS, KOC_REGISTERS } from "./data-koc";

export * from "./types";
export { MITSUBISHI_FAULTS, MITSUBISHI_REGISTERS } from "./data-mitsubishi";
export { SIEMENS_FAULTS, SIEMENS_REGISTERS } from "./data-siemens";
export { ABB_FAULTS, ABB_REGISTERS } from "./data-abb";
export { SCHNEIDER_FAULTS, SCHNEIDER_REGISTERS } from "./data-schneider";
export { LS_FAULTS, LS_REGISTERS } from "./data-ls";
export { DELTA_FAULTS, DELTA_REGISTERS } from "./data-delta";
export { INVT_FAULTS, INVT_REGISTERS } from "./data-invt";
export { OMRON_FAULTS, OMRON_REGISTERS } from "./data-omron";
export { WECON_FAULTS, WECON_REGISTERS } from "./data-wecon";
export { SHIHLIN_FAULTS, SHIHLIN_REGISTERS } from "./data-shihlin";
export { KAMAN_FAULTS, KAMAN_REGISTERS } from "./data-kaman";
export { ARINCO_FAULTS, ARINCO_REGISTERS } from "./data-arinco";
export { KOC_FAULTS, KOC_REGISTERS } from "./data-koc";

export const ALL_FAULTS = [
  ...MITSUBISHI_FAULTS,
  ...SIEMENS_FAULTS,
  ...ABB_FAULTS,
  ...SCHNEIDER_FAULTS,
  ...LS_FAULTS,
  ...DELTA_FAULTS,
  ...INVT_FAULTS,
  ...OMRON_FAULTS,
  ...WECON_FAULTS,
  ...SHIHLIN_FAULTS,
  ...KAMAN_FAULTS,
  ...ARINCO_FAULTS,
  ...KOC_FAULTS,
];

export const ALL_REGISTERS = [
  ...MITSUBISHI_REGISTERS,
  ...SIEMENS_REGISTERS,
  ...ABB_REGISTERS,
  ...SCHNEIDER_REGISTERS,
  ...LS_REGISTERS,
  ...DELTA_REGISTERS,
  ...INVT_REGISTERS,
  ...OMRON_REGISTERS,
  ...WECON_REGISTERS,
  ...SHIHLIN_REGISTERS,
  ...KAMAN_REGISTERS,
  ...ARINCO_REGISTERS,
  ...KOC_REGISTERS,
];
