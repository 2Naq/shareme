// ─── toHex ────────────────────────────────────────────────────────────────────
function toHex(n, pad = 0) {
  if (isNaN(n)) return "";
  return n.toString(16).toUpperCase().padStart(pad, "0");
}

function clampUint(n, bits) {
  const max = Math.pow(2, bits) - 1;
  return Math.max(0, Math.min(max, Math.round(n)));
}

// ─── CRC16 (MODBUS) ──────────────────────────────────────────────────────────
function crc16Modbus(bytes) {
  let crc = 0xffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x0001) {
        crc = (crc >> 1) ^ 0xa001;
      } else {
        crc >>= 1;
      }
    }
  }
  return crc;
}

// ─── IEEE 754 FLOAT ──────────────────────────────────────────────────────────
function floatToRegisters(f) {
  const buf = new ArrayBuffer(4);
  new DataView(buf).setFloat32(0, f, false); // big-endian
  const hi = new DataView(buf).getUint16(0, false);
  const lo = new DataView(buf).getUint16(2, false);
  return { hi, lo };
}

function registersToFloat(hi, lo) {
  const buf = new ArrayBuffer(4);
  const dv = new DataView(buf);
  dv.setUint16(0, hi, false);
  dv.setUint16(2, lo, false);
  return dv.getFloat32(0, false);
}

export { toHex, clampUint, crc16Modbus, floatToRegisters, registersToFloat };
