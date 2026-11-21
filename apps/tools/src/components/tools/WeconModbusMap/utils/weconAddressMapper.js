// Bảng quy chiếu địa chỉ Trạm tớ (Slave Station Address Table) chuẩn PLC WECON (LX6V / LX6S / LX6A500 / LX5V / LX3V)

export const BIT_ADDRESS_MAP = [
  {
    prefix: "T",
    type: "bit",
    label: "Timer Contact (Tiếp điểm Bộ định thời)",
    rangeText: "T0 ~ T511",
    occupation: "512 bit",
    minIndex: 0,
    maxIndex: 511,
    maxReservedIndex: 1535,
    radix: 10,
    step: 1,
    baseDec: 0,
    baseHex: "0x0000",
    endHex: "0x01FF",
    reservedSize: 1536,
    reservedEndHex: "0x05FF",
    rw: "R/W",
    functionCodes: ["0x01", "0x05", "0x0F"],
    weintekPrefix: "0x",
    description: "Trạng thái tiếp điểm ON/OFF của bộ định thời T0 đến T511.",
  },
  {
    prefix: "C",
    type: "bit",
    label: "Counter Contact (Tiếp điểm Bộ đếm 16-bit)",
    rangeText: "C0 ~ C255",
    occupation: "256 bit",
    minIndex: 0,
    maxIndex: 255,
    maxReservedIndex: 1023,
    radix: 10,
    step: 1,
    baseDec: 1536,
    baseHex: "0x0600",
    endHex: "0x06FF",
    reservedSize: 1024,
    reservedEndHex: "0x09FF",
    rw: "R/W",
    functionCodes: ["0x01", "0x05", "0x0F"],
    weintekPrefix: "0x",
    description: "Trạng thái tiếp điểm ON/OFF của bộ đếm 16-bit C0 đến C255.",
  },
  {
    prefix: "LC",
    type: "bit",
    label: "Long Counter Contact (Tiếp điểm Bộ đếm 32-bit)",
    rangeText: "LC0 ~ LC255",
    occupation: "256 bit",
    minIndex: 0,
    maxIndex: 255,
    maxReservedIndex: 1023,
    radix: 10,
    step: 1,
    baseDec: 2560,
    baseHex: "0x0A00",
    endHex: "0x0AFF",
    reservedSize: 1024,
    reservedEndHex: "0x0DFF",
    rw: "R/W",
    functionCodes: ["0x01", "0x05", "0x0F"],
    weintekPrefix: "0x",
    description: "Trạng thái tiếp điểm ON/OFF của bộ đếm dài 32-bit LC0 đến LC255.",
  },
  {
    prefix: "HSC",
    type: "bit",
    label: "High-Speed Counter Contact (Tiếp điểm Bộ đếm tốc độ cao)",
    rangeText: "HSC0 ~ HSC15",
    occupation: "64 bit",
    minIndex: 0,
    maxIndex: 15,
    maxReservedIndex: 63,
    radix: 10,
    step: 1,
    baseDec: 3584,
    baseHex: "0x0E00",
    endHex: "0x0E0F",
    reservedSize: 512,
    reservedEndHex: "0x0FFF",
    rw: "R/W",
    functionCodes: ["0x01", "0x05", "0x0F"],
    weintekPrefix: "0x",
    description: "Trạng thái tiếp điểm ON/OFF của bộ đếm tốc độ cao HSC0 đến HSC15 (dự phòng tối đa 64 bit).",
  },
  {
    prefix: "M",
    type: "bit",
    label: "Auxiliary Relay (Rơ-le trung gian nội bộ)",
    rangeText: "M0 ~ M7999 (8000)",
    occupation: "8192 bit",
    minIndex: 0,
    maxIndex: 7999,
    maxReservedIndex: 8191,
    radix: 10,
    step: 1,
    baseDec: 4096,
    baseHex: "0x1000",
    endHex: "0x2F3F",
    reservedSize: 16384,
    reservedEndHex: "0x4FFF",
    rw: "R/W",
    functionCodes: ["0x01", "0x05", "0x0F"],
    weintekPrefix: "0x",
    description: "Rơ-le trung gian người dùng M0 đến M7999 (chiếm 8192 bit đến 0x2FFF, dự phòng 16384 bit).",
  },
  {
    prefix: "SM",
    type: "bit",
    label: "Special Auxiliary Relay (Rơ-le đặc biệt hệ thống)",
    rangeText: "SM0 ~ SM4095",
    occupation: "4096 bit",
    minIndex: 0,
    maxIndex: 4095,
    maxReservedIndex: 4095,
    radix: 10,
    step: 1,
    baseDec: 20480,
    baseHex: "0x5000",
    endHex: "0x5FFF",
    reservedSize: 12288,
    reservedEndHex: "0x7FFF",
    rw: "R/W",
    functionCodes: ["0x01", "0x05", "0x0F"],
    weintekPrefix: "0x",
    description: "Rơ-le cờ hệ thống đặc biệt SM0 đến SM4095.",
  },
  {
    prefix: "S",
    type: "bit",
    label: "Step Relay (Rơ-le trạng thái / bước STL)",
    rangeText: "S0 ~ S4095",
    occupation: "4096 bit",
    minIndex: 0,
    maxIndex: 4095,
    maxReservedIndex: 4095,
    radix: 10,
    step: 1,
    baseDec: 49152,
    baseHex: "0xC000",
    endHex: "0xCFFF",
    reservedSize: 8192,
    reservedEndHex: "0xDFFF",
    rw: "R/W",
    functionCodes: ["0x01", "0x05", "0x0F"],
    weintekPrefix: "0x",
    description: "Rơ-le bước trạng thái S0 đến S4095.",
  },
  {
    prefix: "X",
    type: "bit",
    label: "Input Relay (Rơ-le ngõ vào vật lý - Hệ Bát Phân)",
    rangeText: "X0 ~ X1777 (Octal)",
    occupation: "1024 bit",
    minIndex: 0,
    maxIndex: 1023, // 01777 in Octal = 1023 in Decimal
    maxReservedIndex: 1023,
    radix: 8,
    step: 1,
    baseDec: 57344,
    baseHex: "0xE000",
    endHex: "0xE3FF",
    reservedSize: 4096,
    reservedEndHex: "0xEFFF",
    rw: "R (Chỉ đọc)",
    functionCodes: ["0x01", "0x02"],
    weintekPrefix: "0x",
    description: "Ngõ vào vật lý X0 ~ X1777 đánh số theo hệ Bát phân (Octal: 0~7, sau X7 là X10). Chỉ đọc.",
  },
  {
    prefix: "Y",
    type: "bit",
    label: "Output Relay (Rơ-le ngõ ra vật lý - Hệ Bát Phân)",
    rangeText: "Y0 ~ Y1777 (Octal)",
    occupation: "1024 bit",
    minIndex: 0,
    maxIndex: 1023, // 01777 in Octal = 1023 in Decimal
    maxReservedIndex: 1023,
    radix: 8,
    step: 1,
    baseDec: 61440,
    baseHex: "0xF000",
    endHex: "0xF3FF",
    reservedSize: 4096,
    reservedEndHex: "0xFFFF",
    rw: "R/W",
    functionCodes: ["0x01", "0x05", "0x0F"],
    weintekPrefix: "0x",
    description: "Ngõ ra vật lý Y0 ~ Y1777 đánh số theo hệ Bát phân (Octal: 0~7, sau Y7 là Y10).",
  },
];

export const WORD_ADDRESS_MAP = [
  {
    prefix: "T",
    type: "word",
    label: "Timer Current Value (Giá trị hiện tại Bộ định thời 16-bit)",
    rangeText: "T0 ~ T511",
    occupation: "512 WORD",
    minIndex: 0,
    maxIndex: 511,
    maxReservedIndex: 1535,
    radix: 10,
    step: 1,
    baseDec: 0,
    baseHex: "0x0000",
    endHex: "0x01FF",
    reservedSize: 1536,
    reservedEndHex: "0x05FF",
    rw: "R/W",
    functionCodes: ["0x03", "0x06", "0x10"],
    weintekPrefix: "4x",
    description: "Thanh ghi giá trị đếm thời gian hiện tại (16-bit Word) của T0 đến T511.",
  },
  {
    prefix: "C",
    type: "word",
    label: "Counter Current Value (Giá trị hiện tại Bộ đếm 16-bit)",
    rangeText: "C0 ~ C255",
    occupation: "256 WORD",
    minIndex: 0,
    maxIndex: 255,
    maxReservedIndex: 1023,
    radix: 10,
    step: 1,
    baseDec: 1536,
    baseHex: "0x0600",
    endHex: "0x06FF",
    reservedSize: 1024,
    reservedEndHex: "0x09FF",
    rw: "R/W",
    functionCodes: ["0x03", "0x06", "0x10"],
    weintekPrefix: "4x",
    description: "Thanh ghi giá trị đếm hiện tại (16-bit Word) của C0 đến C255.",
  },
  {
    prefix: "LC",
    type: "word",
    label: "Long Counter Value (Giá trị hiện tại Bộ đếm 32-bit - 2 Word)",
    rangeText: "LC0 ~ LC255",
    occupation: "512 WORD",
    minIndex: 0,
    maxIndex: 255,
    maxReservedIndex: 511,
    radix: 10,
    step: 2, // Mỗi phần tử LC là 32-bit chiếm 2 WORD liên tiếp
    baseDec: 2560,
    baseHex: "0x0A00",
    endHex: "0x0BFF",
    reservedSize: 1024,
    reservedEndHex: "0x0DFF",
    rw: "R/W",
    functionCodes: ["0x03", "0x10"],
    weintekPrefix: "4x",
    description: "Mỗi bộ đếm 32-bit LC chiếm 2 Word liên tiếp (Low Word + High Word): Addr = 2560 + n × 2.",
  },
  {
    prefix: "HSC",
    type: "word",
    label: "High-Speed Counter Value (Giá trị Bộ đếm tốc độ cao 32-bit - 2 Word)",
    rangeText: "HSC0 ~ HSC15",
    occupation: "128 WORD",
    minIndex: 0,
    maxIndex: 15,
    maxReservedIndex: 63,
    radix: 10,
    step: 2, // Mỗi phần tử HSC là 32-bit chiếm 2 WORD liên tiếp (0x0E00~0x0E1F cho 16 HSC)
    baseDec: 3584,
    baseHex: "0x0E00",
    endHex: "0x0E1F",
    reservedSize: 512,
    reservedEndHex: "0x0FFF",
    rw: "R/W",
    functionCodes: ["0x03", "0x10"],
    weintekPrefix: "4x",
    description: "Mỗi bộ đếm tốc độ cao 32-bit HSC chiếm 2 Word liên tiếp: Addr = 3584 + n × 2.",
  },
  {
    prefix: "D",
    type: "word",
    label: "Data Register (Thanh ghi dữ liệu người dùng)",
    rangeText: "D0 ~ D7999",
    occupation: "8000 WORD",
    minIndex: 0,
    maxIndex: 7999,
    maxReservedIndex: 16383,
    radix: 10,
    step: 1,
    baseDec: 4096,
    baseHex: "0x1000",
    endHex: "0x2F3F",
    reservedSize: 16384,
    reservedEndHex: "0x4FFF",
    rw: "R/W",
    functionCodes: ["0x03", "0x06", "0x10"],
    weintekPrefix: "4x",
    description: "Thanh ghi dữ liệu đa năng 16-bit D0 đến D7999 (hỗ trợ truy cập bit D.b từ 0~F).",
  },
  {
    prefix: "SD",
    type: "word",
    label: "Special Data Register (Thanh ghi đặc biệt hệ thống)",
    rangeText: "SD0 ~ SD4095",
    occupation: "4096 WORD",
    minIndex: 0,
    maxIndex: 4095,
    maxReservedIndex: 4095,
    radix: 10,
    step: 1,
    baseDec: 20480,
    baseHex: "0x5000",
    endHex: "0x5FFF",
    reservedSize: 12288,
    reservedEndHex: "0x7FFF",
    rw: "R/W",
    functionCodes: ["0x03", "0x06", "0x10"],
    weintekPrefix: "4x",
    description: "Thanh ghi hệ thống đặc biệt 16-bit SD0 đến SD4095.",
  },
  {
    prefix: "R",
    type: "word",
    label: "File / Extended Data Register (Thanh ghi dữ liệu mở rộng)",
    rangeText: "R0 ~ R29999 (30000)",
    occupation: "30000 WORD",
    minIndex: 0,
    maxIndex: 29999,
    maxReservedIndex: 29999,
    radix: 10,
    step: 1,
    baseDec: 32768,
    baseHex: "0x8000",
    endHex: "0xF52F",
    reservedSize: 30000,
    reservedEndHex: "0xF52F",
    rw: "R/W",
    functionCodes: ["0x03", "0x06", "0x10"],
    weintekPrefix: "4x",
    description: "Thanh ghi dữ liệu mở rộng R0 đến R29999 (30.000 Word).",
  },
];

export function formatHex16(num) {
  if (typeof num !== "number" || isNaN(num) || num < 0) return "0x0000";
  return "0x" + num.toString(16).toUpperCase().padStart(4, "0");
}

export function formatHexBytes(num) {
  if (typeof num !== "number" || isNaN(num) || num < 0) return "00 00";
  const hex = num.toString(16).toUpperCase().padStart(4, "0");
  return `${hex.slice(0, 2)} ${hex.slice(2, 4)}`;
}

/**
 * Chuyển đổi từ ký hiệu thiết bị PLC (VD: M0, D100, X10, Y27, LC5, D2000.E) sang địa chỉ Modbus
 */
export function mapPlcDeviceToModbus(rawDevice) {
  const cleaned = rawDevice.trim().toUpperCase();
  // Hỗ trợ dạng chuẩn: HSC0, LC10, SM20, SD100, M0, D200, X10, Y77, hoặc D2000.E (bit trong thanh ghi D)
  const match = cleaned.match(/^(HSC|LC|SM|SD|M|D|R|S|T|C|X|Y)(\d+)(?:\.([0-9A-F]))?$/);
  if (!match) {
    return null;
  }

  const [, prefix, digits, bitInWordHex] = match;

  if (bitInWordHex !== undefined && prefix !== "D") {
    return {
      isValid: false,
      error: `Định dạng truy cập bit trong từ (${prefix}${digits}.${bitInWordHex}) chỉ hỗ trợ cho thanh ghi D (D.b, với b từ 0 đến F).`,
    };
  }

  const bitRule = BIT_ADDRESS_MAP.find((item) => item.prefix === prefix);
  const wordRule = WORD_ADDRESS_MAP.find((item) => item.prefix === prefix);

  // Kiểm tra hệ cơ số Bát phân (Octal) cho X và Y
  const isOctal = prefix === "X" || prefix === "Y";
  if (isOctal && /[89]/.test(digits)) {
    return {
      isValid: false,
      error: `Thiết bị ${prefix} sử dụng hệ Bát phân (Octal: chỉ gồm các chữ số 0~7). Địa chỉ "${prefix}${digits}" không hợp lệ vì chứa chữ số 8 hoặc 9 (ví dụ: sau ${prefix}7 là ${prefix}10).`,
    };
  }

  const parsedIndex = parseInt(digits, isOctal ? 8 : 10);
  if (isNaN(parsedIndex) || parsedIndex < 0) {
    return {
      isValid: false,
      error: `Chỉ số địa chỉ "${digits}" không hợp lệ.`,
    };
  }

  const results = [];
  const bitOffset = bitInWordHex !== undefined ? parseInt(bitInWordHex, 16) : null;

  // Nếu có trong bảng Bit (và không phải dạng D.b)
  if (bitRule && bitOffset === null) {
    const inStandardRange = parsedIndex <= bitRule.maxIndex;
    const inReservedRange = parsedIndex <= bitRule.maxReservedIndex;
    const addr0 = bitRule.baseDec + parsedIndex * bitRule.step;
    const addr1 = addr0 + 1;

    results.push({
      space: "bit",
      spaceLabel: "Địa chỉ Bit (Coil - 0x)",
      device: `${prefix}${digits}`,
      prefix,
      rawDigits: digits,
      decimalIndex: parsedIndex,
      radix: bitRule.radix,
      step: bitRule.step,
      rule: bitRule,
      addr0,
      addr1,
      hex: formatHex16(addr0),
      hexFrameBytes: formatHexBytes(addr0),
      weintekTag: `${bitRule.weintekPrefix} ${addr1}`,
      modbus5Digit: addr1 <= 9999 ? `0${String(addr1).padStart(4, "0")}` : `0${String(addr1).padStart(5, "0")}`,
      modbus6Digit: `0${String(addr1).padStart(5, "0")}`,
      inStandardRange,
      inReservedRange,
      formula: isOctal
        ? `${prefix}${digits} (Octal) = ${parsedIndex} (Dec) → ${bitRule.baseDec} + ${parsedIndex} = ${addr0} (0-based) | +1 = ${addr1} (1-based)`
        : `${bitRule.baseDec} (${bitRule.baseHex}) + ${parsedIndex} = ${addr0} (0-based) | +1 = ${addr1} (1-based)`,
    });
  }

  // Nếu có trong bảng Word
  if (wordRule) {
    const inStandardRange = parsedIndex <= wordRule.maxIndex;
    const inReservedRange = parsedIndex <= wordRule.maxReservedIndex;
    const addr0 = wordRule.baseDec + parsedIndex * wordRule.step;
    const addr1 = addr0 + 1;
    const is32Bit = wordRule.step === 2;

    results.push({
      space: "word",
      spaceLabel:
        bitOffset !== null
          ? `Truy cập Bit trong Thanh ghi Word (D.b - Bit ${bitOffset} / 0x${bitInWordHex})`
          : is32Bit
            ? "Địa chỉ Từ Kép 32-bit (Double Word - 2×16-bit Register)"
            : "Địa chỉ Từ 16-bit (Holding Register - 4x)",
      device: bitOffset !== null ? `${prefix}${digits}.${bitInWordHex}` : `${prefix}${digits}`,
      prefix,
      rawDigits: digits,
      decimalIndex: parsedIndex,
      bitOffset,
      bitHex: bitInWordHex || null,
      radix: wordRule.radix,
      step: wordRule.step,
      is32Bit,
      rule: wordRule,
      addr0,
      addr1,
      highWordAddr0: is32Bit ? addr0 + 1 : null,
      highWordAddr1: is32Bit ? addr1 + 1 : null,
      hex: formatHex16(addr0),
      hexFrameBytes: formatHexBytes(addr0),
      weintekTag:
        bitOffset !== null
          ? `4x_Bit ${addr1}${String(bitOffset).padStart(2, "0")} (hoặc 4x ${addr1}.${bitInWordHex})`
          : `${wordRule.weintekPrefix} ${addr1}`,
      modbus5Digit: addr1 <= 9999 ? `4${String(addr1).padStart(4, "0")}` : `4${String(addr1).padStart(5, "0")}`,
      modbus6Digit: `4${String(addr1).padStart(5, "0")}`,
      inStandardRange,
      inReservedRange,
      formula: is32Bit
        ? `${wordRule.baseDec} (${wordRule.baseHex}) + (${parsedIndex} × 2) = ${addr0} (Low Word) & ${addr0 + 1} (High Word) | +1 = ${addr1} & ${addr1 + 1}`
        : `${wordRule.baseDec} (${wordRule.baseHex}) + ${parsedIndex} = ${addr0} (0-based) | +1 = ${addr1} (1-based)`,
    });
  }

  return {
    isValid: true,
    mode: "forward",
    query: cleaned,
    results,
  };
}

/**
 * Tìm thiết bị trong bảng (Bit hoặc Word) từ địa chỉ 0-based (addr0)
 */
function findDeviceAtAddr0(table, addr0) {
  for (const rule of table) {
    const start = rule.baseDec;
    const activeEnd = rule.baseDec + (rule.maxIndex + 1) * rule.step - 1;
    const reservedEnd = rule.baseDec + rule.reservedSize - 1;

    if (addr0 >= start && addr0 <= reservedEnd) {
      const offset = addr0 - start;
      const index = Math.floor(offset / rule.step);
      const wordPart = rule.step === 2 ? (offset % 2 === 0 ? "Low Word (Từ thấp)" : "High Word (Từ cao)") : null;
      const formattedIndex = rule.radix === 8 ? index.toString(8) : index.toString(10);
      const isStandard = addr0 <= activeEnd;

      return {
        found: true,
        isStandard,
        isReservedGap: !isStandard,
        device: `${rule.prefix}${formattedIndex}`,
        prefix: rule.prefix,
        index,
        formattedIndex,
        radix: rule.radix,
        step: rule.step,
        wordPart,
        rule,
        addr0,
        addr1: addr0 + 1,
        hex: formatHex16(addr0),
        weintekTag: `${rule.weintekPrefix} ${addr0 + 1}`,
      };
    }
  }

  return {
    found: false,
    addr0,
    addr1: addr0 + 1,
    hex: formatHex16(addr0),
  };
}

/**
 * Tra cứu ngược từ số địa chỉ Modbus (Dec hoặc Hex) về thiết bị PLC WECON
 */
export function mapModbusToPlcDevice(rawInput) {
  const cleaned = rawInput.trim().toUpperCase();

  let numericValue = null;
  let inputType = "dec"; // "dec" | "hex" | "weintek_0x" | "weintek_4x"

  // 1. Kiểm tra định dạng Hex: 0x1000, 1000H, H1000
  const hexMatch = cleaned.match(/^(?:0X([0-9A-F]{1,4})|([0-9A-F]{1,4})H|H([0-9A-F]{1,4}))$/);
  // 2. Kiểm tra định dạng Weintek: "0X 4097" hoặc "4X 4097"
  const weintekMatch = cleaned.match(/^([04]X)\s*(\d+)$/);
  // 3. Kiểm tra số thập phân thuần túy
  const decMatch = cleaned.match(/^(\d+)$/);

  if (hexMatch) {
    const hexStr = hexMatch[1] || hexMatch[2] || hexMatch[3];
    numericValue = parseInt(hexStr, 16);
    inputType = "hex";
  } else if (weintekMatch) {
    inputType = weintekMatch[1] === "0X" ? "weintek_0x" : "weintek_4x";
    numericValue = parseInt(weintekMatch[2], 10);
  } else if (decMatch) {
    numericValue = parseInt(decMatch[1], 10);
    inputType = "dec";
  } else {
    return null;
  }

  if (isNaN(numericValue) || numericValue < 0 || numericValue > 65536) {
    return {
      isValid: false,
      error: `Địa chỉ số "${rawInput}" nằm ngoài phạm vi hợp lệ của Modbus 16-bit (0 ~ 65536 / 0x0000 ~ 0xFFFF).`,
    };
  }

  // Trường hợp A: Hiểu số vừa nhập là địa chỉ 1-based (+1 - Chuẩn HMI Weintek / SCADA) -> addr0 = numericValue - 1
  const addr0From1Based = numericValue - 1;
  const oneBasedResult =
    addr0From1Based >= 0 && addr0From1Based <= 65535
      ? {
          addr0: addr0From1Based,
          addr1: numericValue,
          hex: formatHex16(addr0From1Based),
          bitMatch: findDeviceAtAddr0(BIT_ADDRESS_MAP, addr0From1Based),
          wordMatch: findDeviceAtAddr0(WORD_ADDRESS_MAP, addr0From1Based),
        }
      : null;

  // Trường hợp B: Hiểu số vừa nhập là địa chỉ 0-based (Chuẩn PLC / Khung Hex) -> addr0 = numericValue
  const addr0From0Based = numericValue;
  const zeroBasedResult =
    addr0From0Based >= 0 && addr0From0Based <= 65535
      ? {
          addr0: addr0From0Based,
          addr1: addr0From0Based + 1,
          hex: formatHex16(addr0From0Based),
          bitMatch: findDeviceAtAddr0(BIT_ADDRESS_MAP, addr0From0Based),
          wordMatch: findDeviceAtAddr0(WORD_ADDRESS_MAP, addr0From0Based),
        }
      : null;

  return {
    isValid: true,
    mode: "reverse",
    query: cleaned,
    inputType,
    numericValue,
    oneBasedResult,
    zeroBasedResult,
  };
}

/**
 * Hàm phân tích đầu vào tổng hợp (Tự động nhận diện PLC Device hay Số địa chỉ Modbus)
 */
export function analyzeAddressInput(rawInput) {
  if (!rawInput || !rawInput.trim()) {
    return null;
  }

  // Thử parse theo tên thiết bị PLC trước (M0, D100, X10, Y20, LC0, HSC0, D2000.E...)
  const forwardResult = mapPlcDeviceToModbus(rawInput);
  if (forwardResult) {
    return forwardResult;
  }

  // Thử parse theo địa chỉ số Modbus (4097, 4096, 0x1000, 4x 4097...)
  const reverseResult = mapModbusToPlcDevice(rawInput);
  if (reverseResult) {
    return reverseResult;
  }

  return {
    isValid: false,
    error: `Không nhận diện được định dạng "${rawInput}". Hãy nhập mã thiết bị PLC (VD: M0, D100, X10, Y20, SD0, R0, D2000.E) hoặc địa chỉ Modbus (VD: 4097, 4096, 0x1000).`,
  };
}

/**
 * Tạo danh sách ánh xạ hàng loạt (Batch Generator) phục vụ lập bảng Tag HMI / SCADA
 */
export function generateBatchAddressTable({ prefix = "M", space = "bit", startInput = "0", count = 16 }) {
  const table = space === "bit" ? BIT_ADDRESS_MAP : WORD_ADDRESS_MAP;
  const rule = table.find((r) => r.prefix === prefix);
  if (!rule) {
    return { error: `Không tìm thấy thiết bị ${prefix} trong vùng nhớ ${space.toUpperCase()}.`, rows: [] };
  }

  const isOctal = rule.radix === 8;
  const cleanedStart = String(startInput).trim();
  if (isOctal && /[89]/.test(cleanedStart)) {
    return {
      error: `Thiết bị ${prefix} dùng hệ Bát phân (Octal 0~7). Địa chỉ bắt đầu "${prefix}${cleanedStart}" không được chứa số 8 hoặc 9.`,
      rows: [],
    };
  }

  const startIndex = parseInt(cleanedStart || "0", isOctal ? 8 : 10);
  if (isNaN(startIndex) || startIndex < 0) {
    return { error: "Địa chỉ bắt đầu không hợp lệ.", rows: [] };
  }

  const safeCount = Math.min(Math.max(parseInt(count, 10) || 1, 1), 128);
  const rows = [];

  for (let i = 0; i < safeCount; i++) {
    const idx = startIndex + i;
    if (idx > rule.maxIndex) break;
    const formattedIdx = isOctal ? idx.toString(8) : idx.toString(10);
    const addr0 = rule.baseDec + idx * rule.step;
    const addr1 = addr0 + 1;

    rows.push({
      device: `${prefix}${formattedIdx}`,
      decimalIndex: idx,
      addr0,
      addr1,
      hex: formatHex16(addr0),
      weintekTag: `${rule.weintekPrefix} ${addr1}`,
      wordCount: rule.step,
      rw: rule.rw,
    });
  }

  return { error: null, rule, rows };
}
