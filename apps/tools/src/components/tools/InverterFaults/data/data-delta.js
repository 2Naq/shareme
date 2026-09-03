export const DELTA_FAULTS = [
  {
    id: "DELTA_OC",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    code: "oc",
    name: "Overcurrent (Quá dòng ngõ ra)",
    hexCode: "01H",
    decCode: 1,
    category: "overcurrent",
    categoryLabel: "Quá dòng & Chập mạch",
    severity: "error",
    causes: [
      "Dòng điện ngõ ra vượt ngưỡng quá dòng của biến tần (ocA: lúc tăng tốc, ocd: lúc giảm tốc, ocn: lúc chạy ổn định)",
      "Thời gian tăng tốc quá ngắn",
      "Kẹt tải cơ khí, động cơ bị kẹt rô-to",
      "Khối công suất IGBT ngõ ra bị chập hỏng"
    ],
    solutions: [
      "Tăng thời gian tăng tốc (tham số 01-12 trên MS300)",
      "Kiểm tra khớp nối cơ khí xem có bị kẹt",
      "Đo cách điện cuộn dây động cơ bằng đồng hồ Megger",
      "Đo kiểm tra khối IGBT ngõ ra"
    ],
    expertTips: "Trên dòng Delta MS300, biến tần phân tách chi tiết: ocA (quá dòng tăng tốc), ocd (quá dòng giảm tốc), ocn (quá dòng chạy đều). Hãy dựa vào ký tự thứ 3 để xác định chính xác giai đoạn bị lỗi.",
    relatedRegisters: ["2100H", "2104H"]
  },
  {
    id: "DELTA_OV",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    code: "ov",
    name: "Overvoltage (Quá điện áp Bus DC)",
    hexCode: "02H",
    decCode: 2,
    category: "overvoltage",
    categoryLabel: "Quá áp & Xả hãm",
    severity: "error",
    causes: [
      "Điện áp Bus DC vượt quá mức cho phép (410V đối với hệ 220V; 820V đối với hệ 460V)",
      "Thời gian giảm tốc quá nhanh khiến động cơ dội năng lượng tái sinh về bộ tụ",
      "Chưa lắp điện trở xả hãm hoặc điện trở xả bị đứt"
    ],
    solutions: [
      "Tăng thời gian giảm tốc (tham số 01-13 trên MS300)",
      "Lắp thêm điện trở xả hãm vào chân B1 và B2 (hoặc +/B1 và B2)",
      "Bật tính năng tự động hãm chống quá áp (tham số 06-01)"
    ],
    expertTips: "Kích hoạt tham số 06-01 = 1 (Over-voltage stall prevention) để biến tần tự động nới dài thời gian hãm nếu áp Bus DC tăng cao.",
    relatedRegisters: ["2100H", "2105H"]
  },
  {
    id: "DELTA_LV",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    code: "Lv",
    name: "Low voltage (Thấp áp nguồn Bus DC)",
    hexCode: "03H",
    decCode: 3,
    category: "power",
    categoryLabel: "Nguồn cấp & Mất pha",
    severity: "error",
    causes: [
      "Điện áp xoay chiều ngõ vào bị sụt áp dưới ngưỡng tối thiểu",
      "Mất pha nguồn điện xoay chiều đầu vào R, S, T",
      "Khởi động từ nguồn bị move tiếp điểm"
    ],
    solutions: [
      "Đo điện áp nguồn cấp 3 pha ngõ vào lúc động cơ khởi động",
      "Kiểm tra aptomat và khởi động từ cấp nguồn",
      "Cài đặt tham số 07-06 cho phép tự khởi động lại sau sụt nguồn chớp nhoáng"
    ],
    expertTips: "Đọc thanh ghi 2105H để giám sát điện áp Bus DC thực tế (đơn vị: 0.1V).",
    relatedRegisters: ["2100H", "2105H"]
  },
  {
    id: "DELTA_OL",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    code: "oL",
    name: "Motor overload (Quá tải động cơ)",
    hexCode: "04H",
    decCode: 4,
    category: "overload",
    categoryLabel: "Quá tải & Quá nhiệt",
    severity: "error",
    causes: [
      "Động cơ bị quá tải cơ khí vượt quá 150% dòng định mức trong thời gian dài",
      "Cài đặt sai dòng định mức động cơ trong tham số 05-01 (Full-load Current)"
    ],
    solutions: [
      "Kiểm tra tải cơ khí làm việc",
      "Cài đặt chính xác dòng định mức động cơ vào tham số 05-01 theo tem motor",
      "Lắp quạt làm mát độc lập cho động cơ nếu chạy tần số thấp kéo dài"
    ],
    expertTips: "Mức bảo vệ quá tải điện tử được cấu hình trong nhóm tham số 06-03 đến 06-06.",
    relatedRegisters: ["2100H", "2104H"]
  },
  {
    id: "DELTA_OL2",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    code: "oL2",
    name: "Drive overload (Quá tải biến tần)",
    hexCode: "05H",
    decCode: 5,
    category: "overload",
    categoryLabel: "Quá tải & Quá nhiệt",
    severity: "error",
    causes: [
      "Biến tần bị quá tải dòng điện liên tục bảo vệ khối công suất bán dẫn",
      "Công suất biến tần chọn quá nhỏ so với tải"
    ],
    solutions: [
      "Giảm bớt tải cơ khí",
      "Kéo dài thời gian tăng/giảm tốc",
      "Nâng công suất biến tần lên một cấp"
    ],
    expertTips: "oL là quá tải motor, oL2 là quá tải khối công suất biến tần.",
    relatedRegisters: ["2100H", "2104H"]
  },
  {
    id: "DELTA_OH",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    code: "oH",
    name: "Overheat (Quá nhiệt cánh tản nhiệt heatsink)",
    hexCode: "06H",
    decCode: 6,
    category: "overload",
    categoryLabel: "Quá tải & Quá nhiệt",
    severity: "error",
    causes: [
      "Cánh nhôm tản nhiệt IGBT quá nóng (> 90°C)",
      "Quạt tản nhiệt của biến tần bị chết hoặc nghẽn bụi bẩn",
      "Nhiệt độ bên trong tủ điện quá cao (> 50°C)"
    ],
    solutions: [
      "Vệ sinh sạch bụi bẩn trên cánh tản nhiệt biến tần",
      "Kiểm tra và thay mới quạt tản nhiệt biến tần",
      "Cải thiện quạt hút đối lưu làm mát tủ điện"
    ],
    expertTips: "Tham số 06-19 cấu hình hành vi của quạt làm mát (0: Tự động chạy theo nhiệt độ, 1: Luôn luôn chạy khi có điện).",
    relatedRegisters: ["2100H"]
  },
  {
    id: "DELTA_EF",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    code: "EF",
    name: "External fault (Lỗi thiết bị ngoại vi)",
    hexCode: "07H",
    decCode: 7,
    category: "warning",
    categoryLabel: "Cảnh báo vận hành (Không dừng)",
    severity: "error",
    causes: [
      "Chân ngõ vào đa chức năng (MI) được cài đặt chức năng EF (mã 10) bị kích hoạt từ rơ-le ngoài hoặc nút dừng khẩn E-Stop"
    ],
    solutions: [
      "Kiểm tra thiết bị ngoại vi đấu nối vào chân MI",
      "Nhả nút dừng khẩn cấp rồi reset biến tần"
    ],
    expertTips: "Đây là cơ chế khóa liên động an toàn chủ động từ mạch điều khiển ngoài.",
    relatedRegisters: ["2100H"]
  },
  {
    id: "DELTA_GFF",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    code: "GFF",
    name: "Ground fault (Chạm đất ngõ ra)",
    hexCode: "08H",
    decCode: 8,
    category: "overcurrent",
    categoryLabel: "Quá dòng & Chập mạch",
    severity: "error",
    causes: [
      "Phát hiện dòng rò chạm đất ở ngõ ra phía motor lớn hơn 50% dòng định mức",
      "Dây cáp động cơ bị trầy xước chạm vào vỏ máng cáp",
      "Động cơ bị ẩm ướt, đọng nước"
    ],
    solutions: [
      "Ngắt nguồn ngay lập tức, dùng Megger đo cách điện cuộn dây motor",
      "Kiểm tra đường cáp chạy trong máng kim loại",
      "Sấy khô cuộn dây động cơ"
    ],
    expertTips: "Tuyệt đối không xóa lỗi và bật chạy lại liên tục để tránh phá hủy khối công suất IGBT.",
    relatedRegisters: ["2100H"]
  },
  {
    id: "DELTA_CE",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    code: "cE",
    name: "Communication error (Lỗi truyền thông RS485)",
    hexCode: "09H",
    decCode: 9,
    category: "comm",
    categoryLabel: "Truyền thông & Ngoại vi",
    severity: "error",
    causes: [
      "Mất kết nối truyền thông Modbus RTU giữa PLC và biến tần quá thời gian timeout (tham số 09-02)",
      "Sai Baudrate (09-01), Parity (09-04) hoặc cáp RS485 bị đứt chập"
    ],
    solutions: [
      "Kiểm tra dây cáp mạng RS485 đấu vào cổng RJ45 (Chân 3 là SG+, Chân 4 là SG-)",
      "Kiểm tra cấu hình Baudrate, Parity và Station Address (09-00)",
      "Cài đặt tham số 09-03 = 0 để tắt chế độ cảnh báo ngắt lỗi khi thử nghiệm"
    ],
    expertTips: "Cổng RJ45 trên biến tần Delta MS300: Chân 3 là SG+, Chân 4 là SG-, Chân 5 và 6 là GND.",
    relatedRegisters: ["2100H", "2000H"]
  },
  {
    id: "DELTA_PHL",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-E", "CP2000", "C2000"],
    code: "PHL",
    name: "Phase loss (Mất pha đầu vào/đầu ra)",
    hexCode: "0AH",
    decCode: 10,
    category: "power",
    categoryLabel: "Nguồn cấp & Mất pha",
    severity: "error",
    causes: [
      "Mất 1 pha nguồn điện xoay chiều đầu vào (ORL) hoặc mất 1 pha ngõ ra motor (OPL)",
      "Lỏng ốc siết cầu đấu hoặc đứt dây cáp"
    ],
    solutions: [
      "Đo kiểm tra điện áp 3 pha đầu vào và thông mạch 3 pha đầu ra",
      "Siết chặt các ốc vít cầu đấu động lực"
    ],
    expertTips: "Tham số 06-45 cấu hình phát hiện mất pha đầu vào, tham số 06-46 cấu hình phát hiện mất pha ngõ ra.",
    relatedRegisters: ["2100H"]
  }
];

export const DELTA_REGISTERS = [
  {
    id: "DELTA_REG_2000",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    addressDec1Based: 8193,
    addressHex0Based: "2000H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R/W",
    name: "Control Command (Từ lệnh điều khiển chạy)",
    category: "control",
    categoryLabel: "Lệnh điều khiển",
    description: "Thanh ghi điều khiển lệnh chạy/dừng/hướng quay cho biến tần Delta qua Modbus RTU (Địa chỉ Hex 2000H / Dec 8192)",
    bitDetails: [
      { bit: "Bit 0-1 = 10B (0012H)", name: "RUN FWD", desc: "Khởi động chạy động cơ theo chiều thuận (Ghi 18 / 0012H)" },
      { bit: "Bit 4-5 = 10B (0022H)", name: "RUN REV", desc: "Khởi động chạy động cơ theo chiều ngược (Ghi 34 / 0022H)" },
      { bit: "Bit 0-1 = 01B (0001H)", name: "STOP", desc: "Lệnh giảm tốc dừng động cơ (Ghi 1 / 0001H)" },
      { bit: "Bit 1 = 1 (0002H)", name: "RESET", desc: "Lệnh xóa lỗi sự cố (Trip Reset - Ghi 2 / 0002H)" }
    ],
    example: "Chạy thuận: ghi 0012H (18). Chạy ngược: ghi 0022H (34). Dừng: ghi 0001H (1). Xóa lỗi: ghi 0002H (2)."
  },
  {
    id: "DELTA_REG_2001",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    addressDec1Based: 8194,
    addressHex0Based: "2001H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R/W",
    name: "Frequency Command (Cài đặt tần số mục tiêu)",
    category: "control",
    categoryLabel: "Lệnh điều khiển",
    description: "Cài đặt tần số ngõ ra mục tiêu qua Modbus (Đơn vị: 0.01 Hz). Cần cài nguồn tần số qua RS485 (00-20 = 1).",
    bitDetails: [],
    example: "Ghi Function 06 địa chỉ 2001H giá trị 5000 để đặt 50.00 Hz."
  },
  {
    id: "DELTA_REG_2100",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    addressDec1Based: 8449,
    addressHex0Based: "2100H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "Error / Warning Code Monitor (Mã lỗi và Cảnh báo)",
    category: "fault",
    categoryLabel: "Giám sát & Lịch sử mã lỗi",
    description: "Thanh ghi đọc mã lỗi và cảnh báo sự cố chuẩn của Delta MS300 (Byte thấp: Mã lỗi sự cố; Byte cao: Mã cảnh báo)",
    bitDetails: [
      { bit: "Low Byte = 1", name: "oc", desc: "Quá dòng ngõ ra (ocA / ocd / ocn)" },
      { bit: "Low Byte = 2", name: "ov", desc: "Quá điện áp Bus DC (ovA / ovd / ovn)" },
      { bit: "Low Byte = 3", name: "oH", desc: "Quá nhiệt biến tần" },
      { bit: "Low Byte = 4", name: "Lv", desc: "Thấp điện áp Bus DC" },
      { bit: "Low Byte = 5", name: "oL", desc: "Quá tải động cơ" },
      { bit: "Low Byte = 9", name: "cE", desc: "Mất truyền thông RS485" },
      { bit: "Low Byte = 11", name: "GFF", desc: "Chạm đất ngõ ra" }
    ],
    example: "Đọc Function 03 địa chỉ 2100H. Nếu giá trị khác 0 thì biến tần đang báo lỗi (lấy Byte thấp & 0xFF để xem mã lỗi)."
  },
  {
    id: "DELTA_REG_2101",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    addressDec1Based: 8450,
    addressHex0Based: "2101H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "Drive Operation Status (Trạng thái vận hành)",
    category: "status",
    categoryLabel: "Trạng thái vận hành",
    description: "Thanh ghi trạng thái hoạt động của biến tần Delta (Hex 2101H / Dec 8449)",
    bitDetails: [
      { bit: "Bit 0-1 = 11B", name: "OPERATING", desc: "Biến tần đang chạy xuất điện áp" },
      { bit: "Bit 0-1 = 00B", name: "STOPPED", desc: "Biến tần đang ở trạng thái dừng" },
      { bit: "Bit 0-1 = 01B", name: "DECELERATING", desc: "Biến tần đang giảm tốc" },
      { bit: "Bit 2 = 1", name: "JOG", desc: "Đang kích hoạt chế độ nhấp JOG" },
      { bit: "Bit 4-3 = 10B", name: "REV", desc: "Đang quay theo chiều ngược" },
      { bit: "Bit 4-3 = 00B", name: "FWD", desc: "Đang quay theo chiều thuận" }
    ],
    example: "Đọc Function 03 địa chỉ 2101H để giám sát biến tần đang chạy hay dừng."
  },
  {
    id: "DELTA_REG_2102",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    addressDec1Based: 8451,
    addressHex0Based: "2102H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "Frequency Command Monitor F (Tần số đặt hiện tại)",
    category: "monitor",
    categoryLabel: "Giám sát ngõ ra",
    description: "Tần số mục tiêu F đang được cài đặt trong biến tần (Đơn vị: 0.01 Hz)",
    bitDetails: [],
    example: "Đọc về 5000 tương ứng 50.00 Hz."
  },
  {
    id: "DELTA_REG_2103",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    addressDec1Based: 8452,
    addressHex0Based: "2103H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "Output Frequency Monitor H (Tần số ngõ ra thực tế)",
    category: "monitor",
    categoryLabel: "Giám sát ngõ ra",
    description: "Tần số ngõ ra thực tế H đang phát cho động cơ (Đơn vị: 0.01 Hz)",
    bitDetails: [],
    example: "Đọc về 5000 tương ứng 50.00 Hz."
  },
  {
    id: "DELTA_REG_2104",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    addressDec1Based: 8453,
    addressHex0Based: "2104H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "Output Current Monitor A (Dòng điện ngõ ra thực tế)",
    category: "monitor",
    categoryLabel: "Giám sát ngõ ra",
    description: "Dòng điện hiệu dụng ngõ ra cấp cho động cơ (Đơn vị: 0.01 A; nếu > 655.35A đổi sang 0.1A)",
    bitDetails: [],
    example: "Đọc về 380 tương ứng 3.80 A."
  },
  {
    id: "DELTA_REG_2105",
    brand: "delta",
    brandLabel: "Delta Electronics",
    models: ["MS300", "VFD-M", "VFD-E", "VFD-EL", "CP2000", "C2000"],
    addressDec1Based: 8454,
    addressHex0Based: "2105H",
    type: "holding",
    typeLabel: "Holding Register (16-bit)",
    rw: "R",
    name: "DC Bus Voltage Monitor (Điện áp Bus DC)",
    category: "monitor",
    categoryLabel: "Giám sát ngõ ra",
    description: "Điện áp một chiều trên bộ tụ lọc Bus DC (Đơn vị: 0.1 V)",
    bitDetails: [],
    example: "Hệ 220V đọc về khoảng 3100 (310.0V DC); Hệ 380V đọc về khoảng 5400 (540.0V DC)."
  }
];
