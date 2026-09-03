export const SHIHLIN_FAULTS = [
  {
    id: "SHIHLIN_OC1",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    code: "OC1",
    name: "Overcurrent during acceleration (Quá dòng khi tăng tốc)",
    hexCode: "01H",
    decCode: 1,
    category: "overcurrent",
    categoryLabel: "Quá dòng & Chập mạch",
    severity: "error",
    causes: [
      "Dòng điện ngõ ra vượt quá dòng ngắt quá dòng tức thời trong lúc tăng tốc",
      "Thời gian tăng tốc P.7 / 01-06 quá ngắn so với quán tính tải",
      "Bù mô-men khởi động P.0 đặt quá cao",
      "Kẹt cơ khí hoặc động cơ bị bó cứng trục",
      "Khối công suất IGBT bị chập hỏng"
    ],
    solutions: [
      "Tăng thời gian tăng tốc P.7",
      "Giảm giá trị tham số bù mô-men P.0",
      "Quay thử trục motor bằng tay kiểm tra kẹt cơ",
      "Dùng Megger đo cách điện cuộn dây motor"
    ],
    expertTips: "Tháo 3 dây ngõ ra motor (U, V, W). Bật chạy không tải, nếu vẫn báo lỗi OC1 ngay lập tức thì khối công suất IGBT đã bị chập nổ.",
    relatedRegisters: ["1000", "1004", "1008"]
  },
  {
    id: "SHIHLIN_OC2",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    code: "OC2",
    name: "Overcurrent during constant speed (Quá dòng khi chạy ổn định)",
    hexCode: "02H",
    decCode: 2,
    category: "overcurrent",
    categoryLabel: "Quá dòng & Chập mạch",
    severity: "error",
    causes: [
      "Tải cơ khí tăng đột ngột khi đang quay tốc độ ổn định",
      "Cáp nối động cơ bị chạm chập ngắt quãng do rung lắc"
    ],
    solutions: [
      "Kiểm tra tải cơ khí làm việc",
      "Kích hoạt tính năng chống trượt Stall Prevention (P.22)",
      "Nâng công suất biến tần lên một cấp nếu tải thường xuyên biến thiên lớn"
    ],
    expertTips: "Tham số P.22 (Stall Prevention level) mặc định là 150% dòng định mức.",
    relatedRegisters: ["1000", "1004", "1008"]
  },
  {
    id: "SHIHLIN_OC3",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    code: "OC3",
    name: "Overcurrent during deceleration (Quá dòng khi giảm tốc)",
    hexCode: "03H",
    decCode: 3,
    category: "overcurrent",
    categoryLabel: "Quá dòng & Chập mạch",
    severity: "error",
    causes: [
      "Thời gian giảm tốc P.8 quá ngắn làm động cơ bị ghì mạnh",
      "Năng lượng tái sinh dâng cao đột ngột"
    ],
    solutions: [
      "Tăng thời gian giảm tốc P.8",
      "Lắp thêm điện trở xả hãm động năng vào cọc P/+ và PR"
    ],
    expertTips: "Cần phân biệt giữa OC3 (quá dòng hãm) và OV3 (quá áp hãm). Nếu hãm quá gấp, dòng kích phanh có thể kích hoạt OC3.",
    relatedRegisters: ["1000", "1004", "1008"]
  },
  {
    id: "SHIHLIN_OV1",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    code: "OV1",
    name: "Overvoltage during acceleration (Quá áp khi tăng tốc)",
    hexCode: "04H",
    decCode: 4,
    category: "overvoltage",
    categoryLabel: "Quá áp & Xả hãm",
    severity: "error",
    causes: [
      "Quán tính tải quay nhanh hơn tốc độ tăng tốc của biến tần (tải kéo động cơ)",
      "Điện áp nguồn lưới xoay chiều ngõ vào quá cao"
    ],
    solutions: [
      "Kéo dài thời gian tăng tốc P.7",
      "Đo kiểm tra điện áp lưới điện 3 pha đầu vào"
    ],
    expertTips: "Thường gặp ở ứng dụng quạt hút khi có luồng gió tự nhiên thổi cánh quạt quay trước khi biến tần đề-pa.",
    relatedRegisters: ["1000", "1005", "1008"]
  },
  {
    id: "SHIHLIN_OV3",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    code: "OV3",
    name: "Overvoltage during deceleration (Quá áp khi giảm tốc)",
    hexCode: "06H",
    decCode: 6,
    category: "overvoltage",
    categoryLabel: "Quá áp & Xả hãm",
    severity: "error",
    causes: [
      "Thời gian giảm tốc P.8 quá ngắn, động cơ biến thành máy phát đẩy áp Bus DC vượt ngưỡng bảo vệ",
      "Chưa lắp điện trở xả hãm hoặc điện trở xả bị đứt"
    ],
    solutions: [
      "Tăng thời gian giảm tốc P.8 dài hơn",
      "Lắp thêm điện trở xả vào chân P/+ và PR (với model có tích hợp bộ hãm)",
      "Cài đặt chế độ tự động giảm tốc tránh quá áp"
    ],
    expertTips: "Đây là lỗi phổ biến nhất trong thực tế khi chạy các tải quán tính lớn như quạt ly tâm, máy ly tâm, bàn quay.",
    relatedRegisters: ["1000", "1005", "1008"]
  },
  {
    id: "SHIHLIN_THN",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    code: "THN",
    name: "Motor electronic thermal relay trip (Quá tải động cơ)",
    hexCode: "07H",
    decCode: 7,
    category: "overload",
    categoryLabel: "Quá tải & Quá nhiệt",
    severity: "error",
    causes: [
      "Rơ-le nhiệt điện tử tích hợp bảo vệ motor tác động do quá tải kéo dài",
      "Cài sai dòng định mức động cơ trong tham số P.9",
      "Động cơ chạy ở tần số thấp kéo dài làm quạt đuôi giải nhiệt kém"
    ],
    solutions: [
      "Kiểm tra dòng định mức ghi trên tem động cơ và cài chính xác vào P.9",
      "Giảm bớt tải cơ khí",
      "Lắp quạt làm mát độc lập cho động cơ nếu chạy tần số thấp thường xuyên"
    ],
    expertTips: "Khi P.9 cài đặt bằng 0, rơ-le nhiệt điện tử sẽ bị tắt (chỉ dùng khi đã có rơ-le nhiệt cơ ngoài).",
    relatedRegisters: ["1000", "1004", "1008"]
  },
  {
    id: "SHIHLIN_THT",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    code: "THT",
    name: "Inverter electronic thermal relay trip (Quá tải biến tần)",
    hexCode: "08H",
    decCode: 8,
    category: "overload",
    categoryLabel: "Quá tải & Quá nhiệt",
    severity: "error",
    causes: [
      "Biến tần bị quá tải liên tục trong thời gian dài (mô hình bảo vệ khối công suất)",
      "Khởi động dừng liên tục với tần suất quá cao"
    ],
    solutions: [
      "Giảm tải cơ khí",
      "Tăng thời gian tăng/giảm tốc",
      "Nâng cấp biến tần lên công suất lớn hơn một cấp"
    ],
    expertTips: "THT là quá tải biến tần (bảo vệ mạch bán dẫn), khác với THN là quá tải cuộn dây động cơ.",
    relatedRegisters: ["1000", "1004", "1008"]
  },
  {
    id: "SHIHLIN_LU",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    code: "LU",
    name: "Undervoltage (Thấp áp nguồn Bus DC)",
    hexCode: "0AH",
    decCode: 10,
    category: "power",
    categoryLabel: "Nguồn cấp & Mất pha",
    severity: "error",
    causes: [
      "Điện áp nguồn xoay chiều ngõ vào bị sụt áp mạnh hoặc mất nguồn chớp nhoáng",
      "Mất 1 trong 3 pha nguồn điện đầu vào",
      "Bộ tụ điện lọc Bus DC bị suy giảm dung lượng"
    ],
    solutions: [
      "Đo điện áp 3 pha nguồn cấp ngõ vào R, S, T",
      "Kiểm tra aptomat và khởi động từ cấp nguồn chính",
      "Bật tính năng tự khởi động lại sau sụt nguồn (P.57, P.58)"
    ],
    expertTips: "Hệ 220V bình thường khoảng 310V DC, hệ 380V bình thường khoảng 540V DC.",
    relatedRegisters: ["1000", "1008"]
  },
  {
    id: "SHIHLIN_OPT",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    code: "OPT",
    name: "Communication error / Option card error (Lỗi truyền thông)",
    hexCode: "0BH",
    decCode: 11,
    category: "comm",
    categoryLabel: "Truyền thông & Ngoại vi",
    severity: "error",
    causes: [
      "Lỗi giao tiếp truyền thông RS-485 Modbus RTU vượt quá số lần thử lại cho phép cài trong P.35",
      "Đứt cáp mạng RS485 hoặc đấu nhầm cực"
    ],
    solutions: [
      "Kiểm tra cài đặt Baudrate (P.32), Parity (P.34), Stop bit (P.33) giữa PLC và biến tần",
      "Lắp điện trở đầu cuối 120Ω giữa chân RDA và RDB",
      "Cài đặt P.36 = 9999 để biến tần không ngắt lỗi khi thử nghiệm"
    ],
    expertTips: "Cài đặt P.36 = 9999 trong giai đoạn lập trình chạy thử để biến tần không trip ngắt khi tạm dừng PLC.",
    relatedRegisters: ["1000", "1001", "1008"]
  },
  {
    id: "SHIHLIN_PE",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    code: "PE",
    name: "Parameter storage error (Lỗi bộ nhớ EEPROM)",
    hexCode: "0CH",
    decCode: 12,
    category: "hardware",
    categoryLabel: "Phần cứng & CPU/Bộ nhớ",
    severity: "error",
    causes: [
      "Lỗi chip nhớ EEPROM lưu trữ dữ liệu tham số cấu hình",
      "Ghi liên tục giá trị qua Modbus vào EEPROM làm chai mòn tuổi thọ bộ nhớ"
    ],
    solutions: [
      "Thực hiện xóa toàn bộ tham số về mặc định (All Parameter Reset: P.999 = 1)",
      "Nếu bật lại nguồn vẫn báo PE thì chip nhớ đã bị hỏng"
    ],
    expertTips: "Khi ghi tần số qua mạng Modbus, hãy ghi vào bộ nhớ tạm RAM thay vì ghi vào bộ nhớ EEPROM.",
    relatedRegisters: ["1000", "1008"]
  },
  {
    id: "SHIHLIN_CPU",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    code: "CPU",
    name: "CPU error (Lỗi vi xử lý trung tâm)",
    hexCode: "0DH",
    decCode: 13,
    category: "hardware",
    categoryLabel: "Phần cứng & CPU/Bộ nhớ",
    severity: "error",
    causes: [
      "Vi xử lý trung tâm bị treo do xung nhiễu điện từ cực mạnh hoặc sét lan truyền",
      "Bo mạch điều khiển bị ẩm mốc chập vi mạch"
    ],
    solutions: [
      "Kiểm tra lại tiếp địa vỏ máy PE",
      "Tắt nguồn biến tần đợi 5 phút xả hết điện rồi bật lại; nếu vẫn báo lỗi cần gửi bảo hành"
    ],
    expertTips: "Đảm bảo tủ điện có cuộn lọc nhiễu Noise Filter và tiếp địa cọc đồng < 10Ω.",
    relatedRegisters: ["1000", "1008"]
  }
];

export const SHIHLIN_REGISTERS = [
  {
    id: "SHIHLIN_REG_1001",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    addressDec1Based: 41002,
    addressHex0Based: "03E9H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R/W",
    name: "Communication Command (Từ lệnh điều khiển chạy)",
    category: "control",
    categoryLabel: "Lệnh điều khiển",
    description: "Thanh ghi điều khiển lệnh chạy/dừng/đổi chiều quay qua mạng Modbus RTU (Địa chỉ Dec 41002 / Hex 03E9H hoặc 1001H)",
    bitDetails: [
      { bit: "Bit 0", name: "STOP", desc: "1 = Lệnh dừng động cơ" },
      { bit: "Bit 1", name: "RUN FWD", desc: "1 = Lệnh chạy thuận" },
      { bit: "Bit 2", name: "RUN REV", desc: "1 = Lệnh chạy ngược" },
      { bit: "Bit 3", name: "RH", desc: "1 = Tốc độ cao" },
      { bit: "Bit 4", name: "RM", desc: "1 = Tốc độ trung bình" },
      { bit: "Bit 5", name: "RL", desc: "1 = Tốc độ thấp" },
      { bit: "Bit 7", name: "RESET", desc: "1 = Lệnh xóa lỗi sự cố (Trip Reset)" }
    ],
    example: "Ghi Function 06 địa chỉ 1001H giá trị 2 (Chạy thuận), giá trị 4 (Chạy ngược), giá trị 1 (Dừng), giá trị 128 (Xóa lỗi)."
  },
  {
    id: "SHIHLIN_REG_1000",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    addressDec1Based: 41001,
    addressHex0Based: "03E8H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "Inverter Status (Từ trạng thái vận hành)",
    category: "status",
    categoryLabel: "Trạng thái vận hành",
    description: "Thanh ghi đọc trạng thái vận hành và cờ báo lỗi biến tần Shihlin (Địa chỉ Dec 41001 / Hex 03E8H hoặc 1000H)",
    bitDetails: [
      { bit: "Bit 0", name: "RUN", desc: "1 = Biến tần đang chạy xuất điện áp" },
      { bit: "Bit 1", name: "FWD", desc: "1 = Chiều quay thuận" },
      { bit: "Bit 2", name: "REV", desc: "1 = Chiều quay ngược" },
      { bit: "Bit 3", name: "SU", desc: "1 = Đã đạt tần số cài đặt" },
      { bit: "Bit 4", name: "OL", desc: "1 = Đang kích hoạt chống trượt / quá tải" },
      { bit: "Bit 7", name: "TRIP / ALARM", desc: "1 = Biến tần đang bị sự cố Trip (CÓ LỖI)" }
    ],
    example: "Đọc Function 03 địa chỉ 1000H, kiểm tra Bit 7 để biết biến tần có đang bị lỗi không."
  },
  {
    id: "SHIHLIN_REG_1002",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    addressDec1Based: 41003,
    addressHex0Based: "03EAH",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R/W",
    name: "Frequency Setting (Cài đặt tần số)",
    category: "control",
    categoryLabel: "Lệnh điều khiển",
    description: "Cài đặt tần số ngõ ra mục tiêu qua mạng Modbus (Đơn vị: 0.01 Hz)",
    bitDetails: [],
    example: "Ghi Function 06 địa chỉ 1002H giá trị 5000 để đặt 50.00 Hz."
  },
  {
    id: "SHIHLIN_REG_1003",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    addressDec1Based: 41004,
    addressHex0Based: "03EBH",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "Output Frequency Monitor",
    category: "monitor",
    categoryLabel: "Giám sát ngõ ra",
    description: "Tần số ngõ ra thực tế đang phát cho động cơ (Đơn vị: 0.01 Hz)",
    bitDetails: [],
    example: "Đọc về 5000 tương ứng 50.00 Hz."
  },
  {
    id: "SHIHLIN_REG_1004",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    addressDec1Based: 41005,
    addressHex0Based: "03ECH",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "Output Current Monitor",
    category: "monitor",
    categoryLabel: "Giám sát ngõ ra",
    description: "Dòng điện ngõ ra thực tế cấp cho động cơ (Đơn vị: 0.01 A)",
    bitDetails: [],
    example: "Đọc về 350 tương ứng 3.50 A."
  },
  {
    id: "SHIHLIN_REG_1005",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    addressDec1Based: 41006,
    addressHex0Based: "03EDH",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "Output Voltage Monitor",
    category: "monitor",
    categoryLabel: "Giám sát ngõ ra",
    description: "Điện áp xoay chiều ngõ ra cấp cho động cơ (Đơn vị: 0.1 V)",
    bitDetails: [],
    example: "Đọc về 2200 tương ứng 220.0 V."
  },
  {
    id: "SHIHLIN_REG_1008",
    brand: "shihlin",
    brandLabel: "Shihlin Electric",
    models: ["SS2 Series", "SC3 Series", "SA3 Series", "SE2 Series"],
    addressDec1Based: 41009,
    addressHex0Based: "03F0H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "Current Fault Code Monitor",
    category: "fault",
    categoryLabel: "Giám sát & Lịch sử mã lỗi",
    description: "Mã số lỗi sự cố hiện tại của biến tần Shihlin (1 = OC1, 2 = OC2, 3 = OC3, 4 = OV1, 6 = OV3, 7 = THN, 8 = THT, 10 = LU, 11 = OPT, 12 = PE, 13 = CPU...)",
    bitDetails: [
      { bit: "1", name: "OC1", desc: "Quá dòng khi tăng tốc" },
      { bit: "2", name: "OC2", desc: "Quá dòng khi chạy ổn định" },
      { bit: "3", name: "OC3", desc: "Quá dòng khi giảm tốc" },
      { bit: "4", name: "OV1", desc: "Quá áp khi tăng tốc" },
      { bit: "6", name: "OV3", desc: "Quá áp khi giảm tốc" },
      { bit: "7", name: "THN", desc: "Quá tải động cơ" },
      { bit: "8", name: "THT", desc: "Quá tải biến tần" },
      { bit: "10", name: "LU", desc: "Thấp áp nguồn Bus DC" },
      { bit: "11", name: "OPT", desc: "Lỗi truyền thông Modbus" }
    ],
    example: "Khi Bit 7 của thanh ghi 1000H = 1, đọc thanh ghi 1008H để lấy mã lỗi."
  }
];
