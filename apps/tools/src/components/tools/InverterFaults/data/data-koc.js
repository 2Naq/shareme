export const KOC_FAULTS = [
  {
    id: "KOC_ERR01",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    code: "Err01 / SC",
    name: "Short circuit protection (Bảo vệ ngắn mạch / Chập IGBT)",
    hexCode: "01H",
    decCode: 1,
    category: "overcurrent",
    categoryLabel: "Quá dòng & Chập mạch",
    severity: "error",
    causes: [
      "Ngắn mạch trực tiếp giữa các pha ngõ ra của động cơ hoặc trong cáp nguồn",
      "Khối công suất IGBT bên trong biến tần bị đánh thủng",
      "Mạch kích driver điều khiển IGBT bị hỏng"
    ],
    solutions: [
      "Tháo 3 dây ra motor U, V, W khỏi biến tần",
      "Bật chạy không tải, nếu vẫn báo lỗi thì khối công suất IGBT đã hỏng",
      "Đo cách điện cuộn dây motor bằng đồng hồ Megger"
    ],
    expertTips: "Lỗi Err01/SC là cấp bảo vệ ngắt xung khẩn cấp phần cứng của biến tần.",
    relatedRegisters: ["2100H", "210BH"]
  },
  {
    id: "KOC_ERR02",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    code: "Err02",
    name: "Acceleration overcurrent (Quá dòng khi tăng tốc)",
    hexCode: "02H",
    decCode: 2,
    category: "overcurrent",
    categoryLabel: "Quá dòng & Chập mạch",
    severity: "error",
    causes: [
      "Thời gian tăng tốc quá ngắn so với quán tính tải",
      "Bù mô-men khởi động đặt quá cao",
      "Động cơ bị kẹt tải cơ khí lúc khởi động"
    ],
    solutions: [
      "Tăng thời gian tăng tốc",
      "Giảm thông số bù mô-men",
      "Kiểm tra khớp nối cơ khí của động cơ"
    ],
    expertTips: "Tăng thêm 2-3 giây cho thời gian tăng tốc để dòng đề-pa ổn định hơn.",
    relatedRegisters: ["2100H", "2102H", "210BH"]
  },
  {
    id: "KOC_ERR03",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    code: "Err03",
    name: "Deceleration overcurrent (Quá dòng khi giảm tốc)",
    hexCode: "03H",
    decCode: 3,
    category: "overcurrent",
    categoryLabel: "Quá dòng & Chập mạch",
    severity: "error",
    causes: [
      "Thời gian giảm tốc quá ngắn làm lực hãm cơ khí tăng vọt",
      "Chưa lắp điện trở xả hãm động năng"
    ],
    solutions: [
      "Tăng thời gian giảm tốc",
      "Lắp thêm điện trở xả hãm vào chân P+ và PB"
    ],
    expertTips: "Kéo dài thời gian dừng hãm giúp giảm lực phản hồi cơ khí.",
    relatedRegisters: ["2100H", "2102H", "210BH"]
  },
  {
    id: "KOC_ERR04",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    code: "Err04",
    name: "Constant speed overcurrent (Quá dòng khi chạy ổn định)",
    hexCode: "04H",
    decCode: 4,
    category: "overcurrent",
    categoryLabel: "Quá dòng & Chập mạch",
    severity: "error",
    causes: [
      "Tải cơ khí tăng đột ngột khi đang quay tốc độ ổn định",
      "Cáp nối động cơ bị chạm chập ngắt quãng do rung lắc"
    ],
    solutions: [
      "Kiểm tra tải cơ khí làm việc",
      "Cân nhắc nâng công suất biến tần lên một cấp"
    ],
    expertTips: "Theo dõi dòng điện thực tế qua thanh ghi 2102H (0.1A).",
    relatedRegisters: ["2100H", "2102H", "210BH"]
  },
  {
    id: "KOC_ERR05",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    code: "Err05",
    name: "Acceleration overvoltage (Quá áp khi tăng tốc)",
    hexCode: "05H",
    decCode: 5,
    category: "overvoltage",
    categoryLabel: "Quá áp & Xả hãm",
    severity: "error",
    causes: [
      "Điện áp nguồn lưới đầu vào quá cao",
      "Quán tính tải kéo motor quay nhanh hơn tần số phát"
    ],
    solutions: [
      "Kiểm tra điện áp 3 pha nguồn cấp đầu vào",
      "Kéo dài thời gian tăng tốc"
    ],
    expertTips: "Thường gặp ở ứng dụng quạt gió hút có luồng gió tự nhiên thổi.",
    relatedRegisters: ["2100H", "2104H", "210BH"]
  },
  {
    id: "KOC_ERR06",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    code: "Err06",
    name: "Deceleration overvoltage (Quá áp khi giảm tốc)",
    hexCode: "06H",
    decCode: 6,
    category: "overvoltage",
    categoryLabel: "Quá áp & Xả hãm",
    severity: "error",
    causes: [
      "Thời gian giảm tốc quá nhanh làm điện áp Bus DC dâng cao vượt mức cho phép",
      "Chưa lắp điện trở xả hãm hoặc điện trở xả bị đứt"
    ],
    solutions: [
      "Tăng thời gian giảm tốc",
      "Lắp thêm điện trở xả vào chân P+ và PB"
    ],
    expertTips: "Lỗi phổ biến nhất khi dừng hãm tải quán tính lớn.",
    relatedRegisters: ["2100H", "2104H", "210BH"]
  },
  {
    id: "KOC_ERR09",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    code: "Err09 / UV",
    name: "Undervoltage (Thấp áp nguồn Bus DC)",
    hexCode: "09H",
    decCode: 9,
    category: "power",
    categoryLabel: "Nguồn cấp & Mất pha",
    severity: "error",
    causes: [
      "Điện áp nguồn xoay chiều ngõ vào bị sụt áp dưới ngưỡng tối thiểu",
      "Mất pha nguồn điện xoay chiều đầu vào R, S, T"
    ],
    solutions: [
      "Đo điện áp 3 pha nguồn cấp đầu vào",
      "Kiểm tra aptomat và khởi động từ cấp nguồn"
    ],
    expertTips: "Hệ 220V bình thường khoảng 310V, hệ 380V khoảng 540V DC.",
    relatedRegisters: ["2100H", "2104H", "210BH"]
  },
  {
    id: "KOC_ERR10",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    code: "Err10",
    name: "Drive overload (Quá tải biến tần)",
    hexCode: "0AH",
    decCode: 10,
    category: "overload",
    categoryLabel: "Quá tải & Quá nhiệt",
    severity: "error",
    causes: [
      "Dòng tải ngõ ra vượt ngưỡng cho phép của biến tần liên tục trong thời gian dài",
      "Công suất biến tần chọn quá nhỏ"
    ],
    solutions: [
      "Giảm tải cơ khí tác động lên động cơ",
      "Tăng thời gian tăng/giảm tốc",
      "Nâng cấp biến tần lên công suất lớn hơn"
    ],
    expertTips: "Err10 là quá tải biến tần, Err11 là quá tải motor.",
    relatedRegisters: ["2100H", "2102H", "210BH"]
  },
  {
    id: "KOC_ERR11",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    code: "Err11",
    name: "Motor overload (Quá tải động cơ)",
    hexCode: "0BH",
    decCode: 11,
    category: "overload",
    categoryLabel: "Quá tải & Quá nhiệt",
    severity: "error",
    causes: [
      "Rơ-le bảo vệ motor tác động do quá tải kéo dài",
      "Cài đặt sai dòng định mức động cơ"
    ],
    solutions: [
      "Kiểm tra dòng định mức ghi trên tem động cơ và cài chính xác",
      "Lắp quạt làm mát độc lập nếu chạy tần số thấp kéo dài"
    ],
    expertTips: "Kiểm tra độ êm của các ổ bi cơ khí động cơ.",
    relatedRegisters: ["2100H", "2102H", "210BH"]
  },
  {
    id: "KOC_ERR12",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    code: "Err12",
    name: "Input phase loss (Mất pha đầu vào)",
    hexCode: "0CH",
    decCode: 12,
    category: "power",
    categoryLabel: "Nguồn cấp & Mất pha",
    severity: "error",
    causes: [
      "Mất 1 trong 3 pha nguồn cấp ngõ vào R, S, T",
      "Lỏng ốc siết cầu cực ngõ vào"
    ],
    solutions: [
      "Đo điện áp 3 pha ngõ vào R-S, S-T, T-R",
      "Siết chặt các ốc vít cầu đấu nguồn"
    ],
    expertTips: "Kiểm tra cầu chì và aptomat nguồn.",
    relatedRegisters: ["2100H", "210BH"]
  },
  {
    id: "KOC_ERR13",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    code: "Err13",
    name: "Output phase loss (Mất pha đầu ra)",
    hexCode: "0DH",
    decCode: 13,
    category: "power",
    categoryLabel: "Nguồn cấp & Mất pha",
    severity: "error",
    causes: [
      "Đứt 1 pha cáp nối từ ngõ ra biến tần U, V, W ra motor",
      "Cuộn dây động cơ bị đứt ngậm"
    ],
    solutions: [
      "Đo thông mạch từng sợi cáp từ biến tần tới hộp cực motor",
      "Đo cân bằng điện trở 3 cuộn dây motor"
    ],
    expertTips: "Tắt bảo vệ mất pha ngõ ra khi thử không tải.",
    relatedRegisters: ["2100H", "210BH"]
  },
  {
    id: "KOC_ERR14",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    code: "Err14 / OH",
    name: "Overheat (Quá nhiệt module IGBT)",
    hexCode: "0EH",
    decCode: 14,
    category: "overload",
    categoryLabel: "Quá tải & Quá nhiệt",
    severity: "error",
    causes: [
      "Cánh nhôm tản nhiệt IGBT quá nóng (> 90°C)",
      "Quạt làm mát của biến tần bị chết hoặc nghẽn bụi bẩn",
      "Nhiệt độ trong tủ điện quá cao"
    ],
    solutions: [
      "Vệ sinh sạch bụi bẩn trên cánh tản nhiệt biến tần",
      "Thay mới quạt làm mát biến tần",
      "Cải thiện quạt hút giải nhiệt tủ điện"
    ],
    expertTips: "Giữ khoảng cách tối thiểu 10cm phía trên và dưới biến tần.",
    relatedRegisters: ["2100H", "210BH"]
  },
  {
    id: "KOC_ERR16",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    code: "Err16 / COM",
    name: "Communication fault (Lỗi truyền thông RS485)",
    hexCode: "10H",
    decCode: 16,
    category: "comm",
    categoryLabel: "Truyền thông & Ngoại vi",
    severity: "error",
    causes: [
      "Mất kết nối truyền thông Modbus RTU giữa PLC và biến tần quá thời gian timeout",
      "Sai Baudrate, Parity hoặc cáp RS485 bị đứt chập"
    ],
    solutions: [
      "Kiểm tra dây cáp mạng RS485",
      "Kiểm tra cấu hình Baudrate, Parity và Station Address"
    ],
    expertTips: "Đấu nối đúng chân RS485+ và RS485-.",
    relatedRegisters: ["2100H", "2000H", "210BH"]
  },
  {
    id: "KOC_ERR23",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    code: "Err23",
    name: "Output short to ground (Chạm đất ngõ ra)",
    hexCode: "17H",
    decCode: 23,
    category: "overcurrent",
    categoryLabel: "Quá dòng & Chập mạch",
    severity: "error",
    causes: [
      "Ngắn mạch chạm đất ở ngõ ra phía động cơ hoặc cáp motor bị xước xát chạm vỏ",
      "Động cơ bị ngấm nước cách điện kém"
    ],
    solutions: [
      "Ngắt nguồn ngay lập tức, dùng Megger đo cách điện các pha U, V, W xuống đất",
      "Kiểm tra đường cáp chạy trong máng kim loại"
    ],
    expertTips: "Tuyệt đối không xóa lỗi và bật chạy lại liên tục để tránh phá hủy khối công suất IGBT.",
    relatedRegisters: ["2100H", "210BH"]
  }
];

export const KOC_REGISTERS = [
  {
    id: "KOC_REG_2000",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    addressDec1Based: 8193,
    addressHex0Based: "2000H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R/W",
    name: "Control Command Word (Từ lệnh điều khiển chạy)",
    category: "control",
    categoryLabel: "Lệnh điều khiển",
    description: "Thanh ghi điều khiển lệnh chạy/dừng/reset cho biến tần KOC qua Modbus RTU (Địa chỉ Hex 2000H / Dec 8192)",
    bitDetails: [
      { bit: "0001H (1)", name: "RUN FWD", desc: "Lệnh chạy thuận" },
      { bit: "0002H (2)", name: "RUN REV", desc: "Lệnh chạy ngược" },
      { bit: "0005H (5)", name: "STOP", desc: "Lệnh dừng giảm tốc" },
      { bit: "0007H (7)", name: "FAULT RESET", desc: "Lệnh xóa lỗi sự cố (Trip Reset)" }
    ],
    example: "Ghi Function 06 địa chỉ 2000H giá trị 1 (Chạy thuận), giá trị 2 (Chạy ngược), giá trị 5 (Dừng), giá trị 7 (Xóa lỗi)."
  },
  {
    id: "KOC_REG_2001",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    addressDec1Based: 8194,
    addressHex0Based: "2001H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R/W",
    name: "Frequency Setting (Cài đặt tần số)",
    category: "control",
    categoryLabel: "Lệnh điều khiển",
    description: "Cài đặt tần số ngõ ra mục tiêu qua Modbus (Đơn vị: 0.01 Hz)",
    bitDetails: [],
    example: "Ghi Function 06 địa chỉ 2001H giá trị 5000 để đặt 50.00 Hz."
  },
  {
    id: "KOC_REG_2100",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    addressDec1Based: 8449,
    addressHex0Based: "2100H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "Inverter Status Word (Từ trạng thái vận hành)",
    category: "status",
    categoryLabel: "Trạng thái vận hành",
    description: "Thanh ghi đọc trạng thái vận hành và cờ báo lỗi biến tần KOC",
    bitDetails: [
      { bit: "Bit 0", name: "RUN", desc: "1 = Biến tần đang chạy; 0 = Đang dừng" },
      { bit: "Bit 1", name: "DIR", desc: "1 = Chiều quay ngược; 0 = Chiều quay thuận" },
      { bit: "Bit 2", name: "READY", desc: "1 = Biến tần sẵn sàng nhận lệnh" },
      { bit: "Bit 3", name: "FAULT", desc: "1 = Biến tần đang bị sự cố Trip (CÓ LỖI)" }
    ],
    example: "Đọc Function 03 địa chỉ 2100H, kiểm tra Bit 3 để biết biến tần có đang bị lỗi."
  },
  {
    id: "KOC_REG_2101",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    addressDec1Based: 8450,
    addressHex0Based: "2101H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "Running Frequency Monitor",
    category: "monitor",
    categoryLabel: "Giám sát ngõ ra",
    description: "Tần số ngõ ra thực tế đang phát cho động cơ (Đơn vị: 0.01 Hz)",
    bitDetails: [],
    example: "Đọc về 5000 tương ứng 50.00 Hz."
  },
  {
    id: "KOC_REG_2102",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    addressDec1Based: 8451,
    addressHex0Based: "2102H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "Output Current Monitor",
    category: "monitor",
    categoryLabel: "Giám sát ngõ ra",
    description: "Dòng điện ngõ ra thực tế cấp cho động cơ (Đơn vị: 0.1 A)",
    bitDetails: [],
    example: "Đọc về 35 tương ứng 3.5 A."
  },
  {
    id: "KOC_REG_2104",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    addressDec1Based: 8453,
    addressHex0Based: "2104H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "DC Bus Voltage Monitor",
    category: "monitor",
    categoryLabel: "Giám sát ngõ ra",
    description: "Điện áp một chiều trên bộ tụ lọc Bus DC (Đơn vị: 1 V)",
    bitDetails: [],
    example: "Hệ 380V đọc về khoảng 540V DC."
  },
  {
    id: "KOC_REG_210B",
    brand: "koc",
    brandLabel: "KOC / KCLY",
    models: ["KOC100", "KOC200", "KOC550", "KOC600", "KCLY"],
    addressDec1Based: 8460,
    addressHex0Based: "210BH",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "Current Fault Code Monitor (Mã lỗi hiện tại)",
    category: "fault",
    categoryLabel: "Giám sát & Lịch sử mã lỗi",
    description: "Mã số lỗi sự cố hiện tại của biến tần KOC (1 = Err01, 2 = Err02, 3 = Err03, 4 = Err04, 5 = Err05, 6 = Err06, 9 = Err09, 10 = Err10, 11 = Err11, 12 = Err12, 13 = Err13, 14 = Err14, 16 = Err16, 23 = Err23)",
    bitDetails: [
      { bit: "1", name: "Err01 / SC", desc: "Bảo vệ ngắn mạch / Chập IGBT" },
      { bit: "2", name: "Err02", desc: "Quá dòng khi tăng tốc" },
      { bit: "3", name: "Err03", desc: "Quá dòng khi giảm tốc" },
      { bit: "5", name: "Err05", desc: "Quá áp khi tăng tốc" },
      { bit: "9", name: "Err09 / UV", desc: "Thấp áp Bus DC" },
      { bit: "10", name: "Err10", desc: "Quá tải biến tần" },
      { bit: "11", name: "Err11", desc: "Quá tải động cơ" },
      { bit: "14", name: "Err14 / OH", desc: "Quá nhiệt biến tần" },
      { bit: "16", name: "Err16 / COM", desc: "Mất truyền thông Modbus" }
    ],
    example: "Đọc thanh ghi 210BH để lấy mã lỗi hiển thị lên HMI."
  }
];
