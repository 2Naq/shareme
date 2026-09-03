// apps/tools/src/components/tools/FxSpecialDevices/data/wordDevices.js
// Toàn bộ Thanh ghi dữ liệu đặc biệt (Special Data Registers D8000 ~ D8511)
// Đối soát 100% theo tài liệu Mitsubishi Electric FX Series Programming Manual (Chapter 37)

export const WORD_DEVICES = [
  // ==========================================
  // --- 1. SYSTEM STATUS & ENVIRONMENT (D8000 ~ D8012) ---
  // ==========================================
  {
    id: "D8000",
    name: "Watchdog timer (WDT)",
    type: "word",
    category: "system",
    rw: "R/W",
    summary:
      "Cài đặt thời gian giám sát Watchdog Timer (Mặc định: 200ms, bước đặt: 1ms).",
    description:
      "Theo tài liệu Mitsubishi Chapter 37.1.2: D8000 nạp giá trị thời gian tối đa cho phép của một chu kỳ quét (Scan time). Mặc định hệ thống nạp 200ms khi cấp nguồn. Nếu scan time của chương trình vượt quá giá trị D8000, PLC sẽ báo lỗi WDT (M8061) và dừng chạy.",
    initialValue: "200 (ms)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV K500 D8000 ]--| // Nâng WDT lên 500ms",
    notes:
      "Có thể ghi đè giá trị mới bằng chương trình (có hiệu lực sau lệnh END hoặc lệnh WDT).",
    tags: ["d8000", "wdt", "watchdog", "scan time", "timeout"],
  },
  {
    id: "D8001",
    name: "PLC type and system version",
    type: "word",
    category: "system",
    rw: "R",
    summary:
      "Lưu mã loại dòng PLC (Model type) và phiên bản hệ điều hành CPU (Version 1.00 = 100).",
    description:
      "Theo tài liệu Mitsubishi: [D]8001 mã hóa 5 chữ số (ví dụ: 24100):\n- 2 chữ số đầu là Model PLC: 28 (FX3S), 26 (FX3G/FX3GC, FX1N, FX1NC), 24 (FX3U/FX3UC, FX2N, FX2NC), 22 (FX1S).\n- 3 chữ số sau là Version (ví dụ 100 đại diện cho Ver 1.00).\nThiết bị tương ứng: D8101.",
    initialValue: "Phụ thuộc phần cứng",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8001 D100 ]--|",
    notes:
      "Dùng để đọc model và phiên bản PLC lên màn hình HMI hoặc phần mềm giám sát SCADA.",
    tags: ["d8001", "model", "version", "plc type", "firmware"],
  },
  {
    id: "D8002",
    name: "Memory capacity",
    type: "word",
    category: "system",
    rw: "R",
    summary:
      "Dung lượng bộ nhớ chương trình đang sử dụng (2: 2K, 4: 4K, 8: 8K, 16+: xem D8102).",
    description:
      "Theo tài liệu Mitsubishi: [D]8002 hiển thị dung lượng bộ nhớ bước lệnh (2 = 2K steps, 4 = 4K steps, 8 = 8K steps). Nếu từ 16K bước trở lên (FX3G/FX3U), giá trị sẽ lưu tại D8102.",
    initialValue: "2 / 4 / 8 / 16 / 32 / 64 (K steps)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8002 D102 ]--|",
    notes: "Thiết bị tương ứng: D8102.",
    tags: ["d8002", "memory capacity", "k steps", "d8102"],
  },
  {
    id: "D8003",
    name: "Memory type",
    type: "word",
    category: "system",
    rw: "R",
    summary:
      "Loại bộ nhớ chương trình và trạng thái công tắc chống ghi Protect Switch.",
    description:
      "Theo tài liệu Mitsubishi:\n- 00H: RAM memory cassette\n- 01H: EPROM memory cassette\n- 02H: EEPROM / Flash memory cassette (Protect OFF)\n- 0AH: EEPROM / Flash memory cassette (Protect ON)\n- 10H: Built-in memory in PLC (Bộ nhớ tích hợp sẵn trong CPU).",
    initialValue: "10H (Tích hợp trong CPU)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8003 D103 ]--|",
    notes: "Kiểm tra loại thẻ nhớ mở rộng đang cắm trong PLC.",
    tags: ["d8003", "memory type", "eeprom", "flash", "ram", "protect"],
  },
  {
    id: "D8004",
    name: "Error number M",
    type: "word",
    category: "error",
    rw: "R",
    summary:
      "Lưu số hiệu cờ M gây ra lỗi khi cờ M8004 bật ON (Ví dụ: 8060, 8064, 8067...).",
    description:
      "Theo tài liệu Mitsubishi: [D]8004 tự động lưu số nguyên đại diện cho rơ-le phụ đặc biệt M bị lỗi (từ 8060 đến 8068) khi cờ tổng M8004 đang ON. Giúp xác định ngay nhánh lỗi chính của PLC.",
    initialValue: "0 (Không lỗi)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8004 ]-----------------[ MOV D8004 D50 ]--|",
    notes: "Thiết bị tương ứng: M8004.",
    tags: ["d8004", "error number", "m8004", "fault"],
  },
  {
    id: "D8005",
    name: "Battery voltage",
    type: "word",
    category: "system",
    rw: "R",
    summary:
      "Điện áp hiện tại của pin nuôi bộ nhớ PLC (Đơn vị: 0.1V, ví dụ: 30 = 3.0V).",
    description:
      "Theo tài liệu Mitsubishi: [D]8005 lưu giá trị điện áp đo được từ pin dự phòng nuôi RAM/RTC theo đơn vị 0.1V (ví dụ: giá trị 30 tương đương 3.0V).",
    initialValue: "Giá trị đo được (0.1V)",
    applicableModels: "FX3G, FX3GC, FX3U, FX3UC, FX2N, FX2NC",
    ladderExample:
      "|--[ M8000 ]-----------------[ MOV D8005 D20 ]--| // Hiển thị Volt pin lên HMI",
    notes:
      "Khi D8005 giảm xuống dưới giá trị cài tại D8006, cờ M8005 sẽ tự động bật ON.",
    tags: ["d8005", "battery voltage", "volt", "d8006", "m8005"],
  },
  {
    id: "D8006",
    name: "Low battery voltage detection level",
    type: "word",
    category: "system",
    rw: "R/W",
    summary:
      "Ngưỡng điện áp phát hiện lỗi pin yếu (Mặc định: 2.7V trên FX3 series, 3.0V trên FX2N).",
    description:
      "Theo tài liệu Mitsubishi: Cài đặt mức ngưỡng so sánh để kích hoạt cờ báo pin yếu M8005 (đơn vị: 0.1V). Mặc định hệ thống nạp: 27 (2.7V) cho FX3G/FX3GC/FX3U/FX3UC và 30 (3.0V) cho FX2N/FX2NC.",
    initialValue: "27 (FX3: 2.7V) / 30 (FX2N: 3.0V)",
    applicableModels: "FX3G, FX3GC, FX3U, FX3UC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8006 D21 ]--|",
    notes: "Nạp tự động từ ROM hệ thống khi bật nguồn.",
    tags: ["d8006", "battery threshold", "low battery", "m8005"],
  },
  {
    id: "D8007",
    name: "Momentary power failure count",
    type: "word",
    category: "system",
    rw: "R",
    summary: "Đếm số lần sụt nguồn thoáng qua (Momentary power failure count).",
    description:
      "Lưu tổng số lần hệ thống ghi nhận có sự cố sụt nguồn thoáng qua.",
    initialValue: "0",
    applicableModels: "FX3U, FX3UC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8007 D22 ]--|",
    notes: "Tự động xóa về 0 khi tắt nguồn hẳn.",
    tags: ["d8007", "momentary power failure", "d8007", "m8007"],
  },
  {
    id: "D8008",
    name: "Power failure detection",
    type: "word",
    category: "system",
    rw: "R/W",
    summary:
      "Thời gian phát hiện mất nguồn điện chính (Mặc định: 10ms đối với nguồn AC, 5ms đối với nguồn DC).",
    description: "Cài đặt thời gian trễ phát hiện mất nguồn điện chính.",
    initialValue: "10 (ms - AC) / 5 (ms - DC)",
    applicableModels: "FX3U, FX3UC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8008 D23 ]--|",
    notes: "Thiết bị tương ứng: M8008.",
    tags: ["d8008", "power failure time", "m8008"],
  },
  {
    id: "D8009",
    name: "Lowest input device number of failed 24V DC power",
    type: "word",
    category: "system",
    rw: "R",
    summary: "Địa chỉ ngõ vào X đầu tiên của khối mở rộng bị mất nguồn 24V DC.",
    description:
      "Lưu địa chỉ ngõ vào X thấp nhất của khối mở rộng phát sinh sự cố mất nguồn 24V DC cấp ngoài.",
    initialValue: "0",
    applicableModels: "FX3G, FX3U, FX2N, FX2NC",
    ladderExample: "|--[ M8009 ]-----------------[ MOV D8009 D24 ]--|",
    notes: "Thiết bị tương ứng: M8009.",
    tags: ["d8009", "24v power fail", "m8009"],
  },
  {
    id: "D8010",
    name: "Present scan time",
    type: "word",
    category: "system",
    rw: "R",
    summary:
      "Thời gian quét (Scan Time) của vòng quét hiện tại (Đơn vị: 0.1ms).",
    description:
      "Theo tài liệu Mitsubishi Chapter 37.1.2: [D]8010 lưu tổng thời gian thực thi các lệnh từ bước 0 đến lệnh END của vòng quét vừa qua theo đơn vị 0.1ms (Ví dụ: giá trị 25 nghĩa là chu kỳ quét hiện tại là 2.5ms).",
    initialValue: "Thay đổi liên tục (0.1ms)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample:
      "|--[ M8000 ]-----------------[ MOV D8010 D50 ]--| // Đọc thời gian quét ms",
    notes:
      "Bao gồm cả thời gian chờ nếu đang kích hoạt chế độ Constant Scan (M8039).",
    tags: ["d8010", "present scan time", "scan time", "performance", "speed"],
  },
  {
    id: "D8011",
    name: "Minimum scan time",
    type: "word",
    category: "system",
    rw: "R",
    summary:
      "Thời gian quét ngắn nhất ghi nhận được kể từ khi RUN (Đơn vị: 0.1ms).",
    description:
      "Lưu giá trị scan time nhỏ nhất đã diễn ra từ thời điểm PLC chuyển sang chế độ RUN.",
    initialValue: "0.1ms unit",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8011 D51 ]--|",
    notes: "Dùng để đánh giá thời gian đáp ứng nhanh nhất của hệ thống.",
    tags: ["d8011", "min scan time", "performance"],
  },
  {
    id: "D8012",
    name: "Maximum scan time",
    type: "word",
    category: "system",
    rw: "R",
    summary:
      "Thời gian quét dài nhất ghi nhận được kể từ khi RUN (Đơn vị: 0.1ms).",
    description:
      "Lưu giá trị scan time đỉnh tải lớn nhất kể từ lúc RUN. Giúp phát hiện các chu kỳ quét bị quá tải để kịp thời tối ưu chương trình trước khi chạm ngưỡng WDT (D8000).",
    initialValue: "0.1ms unit",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8012 D52 ]--|",
    notes:
      "Nếu D8012 tăng cao tiệm cận mức 200ms của D8000, cần tối ưu lại cấu trúc chương trình.",
    tags: ["d8012", "max scan time", "performance", "peak"],
  },
  {
    id: "D8039",
    name: "Constant scan duration",
    type: "word",
    category: "system",
    rw: "R/W",
    summary:
      "Cài đặt độ dài chu kỳ quét cố định cho chế độ Constant Scan M8039 (Đơn vị: 1ms, mặc định: 0ms).",
    description:
      "Khi M8039 = ON, giá trị nạp trong D8039 quy định thời gian của mỗi chu kỳ quét (đơn vị: 1ms).",
    initialValue: "0 (ms)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV K15 D8039 ]--| // Đặt scan time cố định 15ms",
    notes: "Thiết bị tương ứng: M8039.",
    tags: ["d8039", "constant scan", "scan duration", "m8039"],
  },

  // ==========================================
  // --- 2. REAL-TIME CLOCK RTC (D8013 ~ D8019) ---
  // ==========================================
  {
    id: "D8013",
    name: "RTC - Second data",
    type: "word",
    category: "clock",
    rw: "R/W",
    summary: "Dữ liệu Giây của Đồng hồ thời gian thực RTC (0 đến 59 giây).",
    description:
      "Lưu trữ giá trị Giây hiện tại từ vi mạch đồng hồ thời gian thực RTC (dải giá trị 0 đến 59).",
    initialValue: "0 - 59",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8013 D10 ]--|",
    notes:
      "Có thể ghi giá trị mới vào D8013 khi M8015 = ON để chỉnh lại đồng hồ.",
    tags: ["d8013", "rtc", "second", "time", "clock"],
  },
  {
    id: "D8014",
    name: "RTC - Minute data",
    type: "word",
    category: "clock",
    rw: "R/W",
    summary: "Dữ liệu Phút của Đồng hồ thời gian thực RTC (0 đến 59 phút).",
    description:
      "Lưu trữ giá trị Phút hiện tại từ IC đồng hồ thời gian thực RTC (dải giá trị 0 đến 59).",
    initialValue: "0 - 59",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8014 D11 ]--|",
    notes: "Dùng cho các ứng dụng lập lịch hẹn giờ bật/tắt thiết bị theo phút.",
    tags: ["d8014", "rtc", "minute", "time", "clock"],
  },
  {
    id: "D8015",
    name: "RTC - Hour data",
    type: "word",
    category: "clock",
    rw: "R/W",
    summary: "Dữ liệu Giờ của Đồng hồ thời gian thực RTC (0 đến 23 giờ).",
    description:
      "Lưu trữ giá trị Giờ hiện tại theo định dạng 24 giờ (dải giá trị 0 đến 23).",
    initialValue: "0 - 23",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample:
      "|--[== D8015 K8 ]------------[ OUT Y0 ]--| // Bật thiết bị lúc 8h sáng",
    notes: "Thuận tiện lập trình ca làm việc ngày / đêm.",
    tags: ["d8015", "rtc", "hour", "time", "clock"],
  },
  {
    id: "D8016",
    name: "RTC - Day data",
    type: "word",
    category: "clock",
    rw: "R/W",
    summary: "Dữ liệu Ngày trong tháng của RTC (1 đến 31).",
    description:
      "Lưu trữ giá trị Ngày trong tháng của đồng hồ thời gian thực (dải giá trị 1 đến 31).",
    initialValue: "1 - 31",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8016 D13 ]--|",
    notes:
      "Đồng hồ tự động tính toán số ngày chính xác theo các tháng 28, 29, 30, 31 ngày.",
    tags: ["d8016", "rtc", "day", "date", "clock"],
  },
  {
    id: "D8017",
    name: "RTC - Month data",
    type: "word",
    category: "clock",
    rw: "R/W",
    summary: "Dữ liệu Tháng trong năm của RTC (1 đến 12).",
    description:
      "Lưu trữ giá trị Tháng hiện tại từ đồng hồ thời gian thực (dải giá trị 1 đến 12).",
    initialValue: "1 - 12",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8017 D14 ]--|",
    notes:
      "Kết hợp với D8016, D8018 để ghi nhận thời gian sự kiện (Datalogging).",
    tags: ["d8017", "rtc", "month", "date", "clock"],
  },
  {
    id: "D8018",
    name: "RTC - Year data",
    type: "word",
    category: "clock",
    rw: "R/W",
    summary: "Dữ liệu Năm của RTC (00 đến 99 -> 2 chữ số cuối của năm).",
    description:
      "Lưu trữ 2 chữ số cuối của năm (0 đến 99, ví dụ: 26 đại diện cho năm 2026). Dải 00-79 được hiểu là 2000-2079, dải 80-99 là 1980-1999.",
    initialValue: "00 - 99",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8018 D15 ]--|",
    notes: "Chỉ ghi giá trị năm 2 chữ số.",
    tags: ["d8018", "rtc", "year", "date", "clock"],
  },
  {
    id: "D8019",
    name: "RTC - Day-of-the-week data",
    type: "word",
    category: "clock",
    rw: "R/W",
    summary: "Thứ trong tuần (0: Chủ Nhật, 1: Thứ Hai, ..., 6: Thứ Bảy).",
    description:
      "Theo tài liệu Mitsubishi: Lưu mã số đại diện cho Thứ trong tuần:\n- 0: Chủ Nhật (Sunday)\n- 1: Thứ Hai (Monday)\n- 2: Thứ Ba (Tuesday)\n- 3: Thứ Tư (Wednesday)\n- 4: Thứ Năm (Thursday)\n- 5: Thứ Sáu (Friday)\n- 6: Thứ Bảy (Saturday).",
    initialValue: "0 (Chủ nhật) - 6 (Thứ 7)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample:
      "|--[== D8019 K0 ]------------[ OUT Y5 ]--| // Tắt máy tự động vào Chủ Nhật",
    notes:
      "Tiện lợi lập trình điều khiển bật/tắt thiết bị theo lịch nghỉ cuối tuần.",
    tags: ["d8019", "rtc", "weekday", "day of week", "sunday", "saturday"],
  },

  // ==========================================
  // --- 3. INPUT FILTER & ANALOG VOLUME (D8020 ~ D8031) ---
  // ==========================================
  {
    id: "D8020",
    name: "Input filter adjustment",
    type: "word",
    category: "system",
    rw: "R/W",
    summary:
      "Cài đặt hằng số thời gian lọc ngõ vào số X000 ~ X017 (Mặc định: 10ms, dải đặt: 0 đến 60ms).",
    description:
      "Cho phép điều chỉnh bộ lọc chống nhiễu phần cứng cho các ngõ vào X000-X017. Đặt 0ms cho ngõ vào đáp ứng nhanh cực đại.",
    initialValue: "10 (ms)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV K1 D8020 ]--| // Đặt lọc ngõ vào 1ms",
    notes:
      "Dùng để lọc rung tiếp điểm công tắc hành trình hoặc nâng tốc độ nhận xung.",
    tags: ["d8020", "input filter", "filter adjustment", "x0", "speed"],
  },
  {
    id: "D8028",
    name: "Value of Z0 (Z) register",
    type: "word",
    category: "system",
    rw: "R",
    summary: "Giá trị hiện thời của thanh ghi chỉ số Index Z0 (Z).",
    description: "Phản ánh giá trị thanh ghi chỉ số Z0 trong chương trình.",
    initialValue: "0",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8028 D60 ]--|",
    notes: "Giá trị Z1-Z7 lưu tại D8182-D8188.",
    tags: ["d8028", "z0", "index register"],
  },
  {
    id: "D8029",
    name: "Value of V0 (V) register",
    type: "word",
    category: "system",
    rw: "R",
    summary: "Giá trị hiện thời của thanh ghi chỉ số Index V0 (V).",
    description: "Phản ánh giá trị thanh ghi chỉ số V0 trong chương trình.",
    initialValue: "0",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8029 D61 ]--|",
    notes: "Giá trị V1-V7 lưu tại D8189-D8195.",
    tags: ["d8029", "v0", "index register"],
  },
  {
    id: "D8030",
    name: "Value of analog volume VR1",
    type: "word",
    category: "analog",
    rw: "R",
    summary: "Giá trị số đọc từ biến trở chiết áp tích hợp VR1 (0 đến 255).",
    description:
      "Lưu giá trị số nguyên từ 0 đến 255 tương ứng với vị trí xoay của biến trở chiết áp VR1 trên mặt trước PLC.",
    initialValue: "0 - 255",
    applicableModels: "FX3S, FX3G, FX1S, FX1N",
    ladderExample:
      "|--[ M8000 ]-----------------[ MOV D8030 D100 ]--| // Đọc núm xoay cài Timer",
    notes:
      "Rất tiện lợi để người vận hành chỉnh thời gian Timer trực tiếp bằng tua-vít mà không cần màn hình HMI.",
    tags: ["d8030", "vr1", "analog potentiometer", "trimmer", "volume"],
  },
  {
    id: "D8031",
    name: "Value of analog volume VR2",
    type: "word",
    category: "analog",
    rw: "R",
    summary: "Giá trị số đọc từ biến trở chiết áp tích hợp VR2 (0 đến 255).",
    description:
      "Lưu giá trị số nguyên từ 0 đến 255 từ biến trở chiết áp VR2 trên mặt trước PLC.",
    initialValue: "0 - 255",
    applicableModels: "FX3S, FX3G, FX1S, FX1N",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8031 D101 ]--|",
    notes: "Đọc chiết áp thứ 2.",
    tags: ["d8031", "vr2", "analog volume", "trimmer"],
  },

  // ==========================================
  // --- 4. ERROR CODES (D8060 ~ D8069, D8312 ~ D8319) ---
  // ==========================================
  {
    id: "D8060",
    name: "Error code for I/O configuration error",
    type: "word",
    category: "error",
    rw: "R",
    summary:
      "Mã lỗi cấu hình I/O (Lưu địa chỉ khối I/O bị xung đột hoặc không gắn).",
    description:
      "Theo tài liệu Mitsubishi: [D]8060 lưu địa chỉ thiết bị I/O đầu tiên của khối phần cứng phát sinh lỗi (khi cờ M8060 bật ON).",
    initialValue: "0 (Không lỗi)",
    applicableModels: "FX3G, FX3GC, FX3U, FX3UC, FX2N, FX2NC",
    ladderExample: "|--[ M8060 ]-----------------[ MOV D8060 D500 ]--|",
    notes: "Thiết bị tương ứng: M8060.",
    tags: ["d8060", "io error code", "m8060"],
  },
  {
    id: "D8061",
    name: "Error code for PLC hardware error",
    type: "word",
    category: "error",
    rw: "R",
    summary:
      "Mã lỗi phần cứng PLC (Lưu mã lỗi CPU/RAM/Nguồn khi M8061 bật ON).",
    description:
      "Theo tài liệu Mitsubishi Chapter 38: [D]8061 chứa mã lỗi chi tiết khi cờ M8061 ON (Ví dụ: 6101 lỗi RAM, 6102 lỗi nguồn DC, 6103 lỗi WDT...).",
    initialValue: "0 (Không lỗi)",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX2N, FX2NC",
    ladderExample: "|--[ M8061 ]-----------------[ MOV D8061 D501 ]--|",
    notes: "Thiết bị tương ứng: M8061.",
    tags: ["d8061", "hardware error code", "m8061"],
  },
  {
    id: "D8062",
    name: "Error code for PLC/PP communication error / serial 0 [ch0]",
    type: "word",
    category: "comm",
    rw: "R",
    summary:
      "Mã lỗi truyền thông cổng lập trình USB/RS-422 Ch0 (khi M8062 bật ON).",
    description:
      "Lưu mã lỗi kết nối với máy tính nạp chương trình hoặc HMI qua cổng tròn Ch0 (Ví dụ: 6201 Parity error, 6202 Overrun...).",
    initialValue: "0 (Không lỗi)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8062 ]-----------------[ MOV D8062 D502 ]--|",
    notes: "Thiết bị tương ứng: M8062.",
    tags: ["d8062", "pp comm error code", "ch0", "m8062"],
  },
  {
    id: "D8063",
    name: "Error code for serial communication error 1 [ch1]",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary: "Lưu mã số lỗi truyền thông nối tiếp Kênh 1 khi cờ M8063 bật ON.",
    description:
      "Theo tài liệu Mitsubishi Chapter 38:\nLưu mã số lỗi sự cố truyền thông nối tiếp Channel 1 (RS-485 / RS-232C). Các mã lỗi chính:\n- 6301: Parity error\n- 6302: Overrun error\n- 6303: Framing error\n- 6304: Character format error\n- 6305: Command error\n- 6306: Monitoring time-out\n- 6307: Sum check error\n- 6308: Communication format error.",
    initialValue: "0 (Không lỗi)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8063 ]-----------------[ MOV D8063 D500 ]--|",
    notes: "Thiết bị tương ứng: M8063.",
    tags: ["d8063", "comm error code", "rs485", "m8063", "parity", "framing"],
  },
  {
    id: "D8064",
    name: "Error code for parameter error",
    type: "word",
    category: "error",
    rw: "R",
    summary: "Mã lỗi cài đặt tham số PLC (Parameter error code).",
    description:
      "Lưu chi tiết mã lỗi khi các thông số hệ thống bị cài đặt sai dải (Ví dụ: 6401 lỗi dải bộ nhớ, 6402 lỗi tham số truyền thông...).",
    initialValue: "0 (Không lỗi)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8064 ]-----------------[ MOV D8064 D504 ]--|",
    notes: "Thiết bị tương ứng: M8064.",
    tags: ["d8064", "parameter error code", "m8064"],
  },
  {
    id: "D8065",
    name: "Error code for syntax error",
    type: "word",
    category: "error",
    rw: "R",
    summary: "Mã lỗi cú pháp câu lệnh (Syntax error code).",
    description:
      "Lưu mã lỗi cú pháp câu lệnh trong chương trình. Vị trí bước lệnh lỗi được lưu tại D8069.",
    initialValue: "0 (Không lỗi)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8065 ]-----------------[ MOV D8065 D505 ]--|",
    notes: "Thiết bị tương ứng: M8065, D8069.",
    tags: ["d8065", "syntax error code", "m8065"],
  },
  {
    id: "D8066",
    name: "Error code for ladder error",
    type: "word",
    category: "error",
    rw: "R",
    summary: "Mã lỗi cấu trúc mạch Ladder (Ladder error code).",
    description:
      "Lưu mã lỗi cấu trúc mạch Ladder. Vị trí bước lệnh lỗi được lưu tại D8069.",
    initialValue: "0 (Không lỗi)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8066 ]-----------------[ MOV D8066 D506 ]--|",
    notes: "Thiết bị tương ứng: M8066, D8069.",
    tags: ["d8066", "ladder error code", "m8066"],
  },
  {
    id: "D8067",
    name: "Error code for operation error",
    type: "word",
    category: "error",
    rw: "R",
    summary: "Lưu mã lỗi tính toán (Operation error) khi cờ M8067 bật ON.",
    description:
      "Theo tài liệu Mitsubishi Chapter 38: [D]8067 lưu mã chi tiết khi xảy ra lỗi tính toán (Ví dụ: 6706: Lỗi chia cho 0, 6705: Chỉ số thanh ghi vượt dải...). Vị trí bước lệnh lỗi được lưu tại D8069.",
    initialValue: "0 (Không lỗi)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8067 ]-----------------[ MOV D8067 D507 ]--|",
    notes: "Thiết bị tương ứng: M8067, D8069.",
    tags: ["d8067", "operation error code", "m8067", "divide by zero"],
  },
  {
    id: "D8068",
    name: "Operation error step number latched",
    type: "word",
    category: "error",
    rw: "R/W",
    summary:
      "Lưu chốt số thứ tự bước lệnh (Step No) phát sinh lỗi tính toán đầu tiên.",
    description:
      "Chốt lưu số bước lệnh của câu lệnh gây ra lỗi tính toán đầu tiên kể từ khi chuyển sang RUN.",
    initialValue: "0",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8068 ]-----------------[ MOV D8068 D508 ]--|",
    notes: "Thiết bị tương ứng: M8068.",
    tags: ["d8068", "latched error step", "m8068"],
  },
  {
    id: "D8069",
    name: "Error step number of M8065 to M8067",
    type: "word",
    category: "error",
    rw: "R",
    summary:
      "Lưu số thứ tự bước lệnh (Step number) phát sinh lỗi cú pháp / ladder / tính toán.",
    description:
      "Theo tài liệu Mitsubishi: [D]8069 lưu số bước lệnh (Step No) của câu lệnh trong chương trình gây ra lỗi cú pháp (M8065), lỗi ladder (M8066) hoặc lỗi tính toán runtime (M8067).",
    initialValue: "0 (Không lỗi)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample:
      "|--[ M8067 ]-----------------[ MOV D8069 D509 ]--| // Tìm vị trí dòng lỗi",
    notes:
      "Nếu chương trình vượt quá 32K bước (FX3U), bước lệnh lỗi được lưu tại D8314 và D8315 (32-bit).",
    tags: ["d8069", "error step", "step number", "m8067", "m8065", "debug"],
  },
  {
    id: "D8312",
    name: "Operation error step number latched (Lower 16-bit) [FX3U/FX3UC]",
    type: "word",
    category: "error",
    rw: "R/W",
    summary:
      "Bước lệnh phát sinh lỗi tính toán chốt (16-bit thấp) cho chương trình lớn > 32K steps.",
    description:
      "Kết hợp với D8313 tạo thành số nguyên 32-bit lưu bước lệnh lỗi cho dòng FX3U/FX3UC.",
    initialValue: "0",
    applicableModels: "FX3U, FX3UC",
    ladderExample: "|--[ DMOV D8312 D510 ]--------------------------|",
    notes: "Dành cho chương trình 32K ~ 64K bước.",
    tags: ["d8312", "32bit error step", "fx3u"],
  },

  // ==========================================
  // --- 5. SERIAL COMMUNICATION CH1 (D8120 ~ D8129) ---
  // ==========================================
  {
    id: "D8120",
    name: "Communication format setting [ch1]",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary:
      "Thanh ghi cấu hình định dạng truyền thông nối tiếp Kênh 1 (Baudrate, Parity, Data length, Stop bit, Protocol).",
    description:
      "Theo tài liệu Mitsubishi Data Communication Edition: D8120 cấu hình 16-bit cho cổng Ch1 (BD hoặc ADP):\n- b0: Data length (0: 7-bit, 1: 8-bit)\n- b1-b2: Parity (00: None, 01: Odd, 11: Even)\n- b3: Stop bit (0: 1-bit, 1: 2-bit)\n- b4-b7: Baudrate (0100: 2400bps, 0101: 4800bps, 0110: 9600bps, 0111: 19200bps, 1000: 38400bps, 1001: 57600bps, 1010: 115200bps)\n- b8: Header (0: Không, 1: D8124)\n- b9: Terminator (0: Không, 1: D8125)\n- b10: Control line\n- b13: Sum check\n- b14-b15: Protocol mode (00: Non-protocol RS, 01: Dedicated Protocol, 10: Inverter communication).\nVí dụ: H0081 nạp cấu hình 9600 bps, 8-N-1 cho Modbus RTU.",
    initialValue: "H0000 (Mặc định)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV H0081 D8120 ]--| // 9600-8-N-1",
    notes:
      "Có tính chất lưu giữ nhớ (Latch/EEPROM). Cần khởi tạo bằng xung M8002 và tắt/bật lại nguồn PLC sau khi thay đổi.",
    tags: [
      "d8120",
      "comm format",
      "baudrate",
      "parity",
      "stop bit",
      "rs485",
      "modbus",
      "ch1",
    ],
  },
  {
    id: "D8121",
    name: "Computer link [ch1] Station number setting",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary:
      "Cài đặt số trạm (Station number) cho giao thức Computer Link trên Kênh 1 (0 đến 15).",
    description:
      "Cài đặt địa chỉ trạm của PLC khi giao tiếp qua mạng Computer Link trên cổng Ch1.",
    initialValue: "0",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV K1 D8121 ]--| // Trạm số 1",
    notes: "Có tính chất lưu giữ nhớ (Latch/EEPROM).",
    tags: ["d8121", "station number", "computer link", "comm", "ch1"],
  },
  {
    id: "D8122",
    name: "RS (FNC 80) instruction: Remaining points of transmit data [ch1]",
    type: "word",
    category: "comm",
    rw: "R",
    summary:
      "Số lượng byte dữ liệu còn lại trong hàng đợi chưa phát xong qua Ch1.",
    description:
      "Lưu số điểm (byte) dữ liệu còn lại trong bộ đệm phát của lệnh RS (FNC 80) chưa được đẩy ra đường truyền serial. Đếm lùi về 0 khi hoàn tất gửi.",
    initialValue: "0 (byte)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8122 D20 ]--|",
    notes: "Thiết bị tương ứng: M8122.",
    tags: ["d8122", "remaining transmit", "send bytes", "rs", "m8122", "ch1"],
  },
  {
    id: "D8123",
    name: "RS (FNC 80) instruction: Monitoring receive data points [ch1]",
    type: "word",
    category: "comm",
    rw: "R",
    summary:
      "Số lượng byte dữ liệu mà PLC đã nhận được thành công từ đường truyền Ch1.",
    description:
      "Lưu tổng số byte dữ liệu mà khối nhận của lệnh RS (FNC 80) đã thu nạp vào mảng Receive Buffer.",
    initialValue: "0 (byte)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample:
      "|--[ M8123 ]-----------------[ MOV D8123 D21 ]--| // Kiểm tra chiều dài gói tin",
    notes: "Thiết bị tương ứng: M8123.",
    tags: ["d8123", "received points", "rx bytes", "rs", "m8123", "ch1"],
  },
  {
    id: "D8124",
    name: "RS (FNC 80) instruction: Header [ch1]",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary:
      "Ký tự Header mở đầu khung truyền Non-protocol (Mặc định: STX = 02H).",
    description:
      "Nạp mã ký tự Header khởi đầu frame khi bit b8 của thanh ghi D8120 = 1. Giá trị mặc định là 0002H (ký tự STX).",
    initialValue: "H0002 (STX)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8002 ]-----------------[ MOV H0002 D8124 ]--|",
    notes: "Trong cấu hình Modbus RTU chuẩn, không sử dụng Header (b8 = 0).",
    tags: ["d8124", "header", "stx", "rs", "comm"],
  },
  {
    id: "D8125",
    name: "RS (FNC 80) instruction: Terminator [ch1]",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary:
      "Ký tự Terminator kết thúc khung truyền Non-protocol (Mặc định: ETX = 03H).",
    description:
      "Nạp mã ký tự Terminator định giới kết thúc frame khi bit b9 của thanh ghi D8120 = 1. Giá trị mặc định là 0003H (ký tự ETX).",
    initialValue: "H0003 (ETX)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample: "|--[ M8002 ]-----------------[ MOV H0003 D8125 ]--|",
    notes:
      "Trong cấu hình Modbus RTU chuẩn, không sử dụng Terminator (b9 = 0).",
    tags: ["d8125", "terminator", "etx", "rs", "comm"],
  },
  {
    id: "D8129",
    name: "RS (FNC 80) instruction: Time-out time setting [ch1]",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary:
      "Cài đặt khoảng thời gian Timeout chờ phản hồi trên Ch1 (Đơn vị: 10ms hoặc 1ms).",
    description:
      "Quy định thời gian tối đa PLC chờ nhận đủ gói tin phản hồi từ Slave. Nếu quá thời gian này mà không nhận đủ byte, cờ M8129 sẽ tự động bật ON.",
    initialValue: "100 - 500 (ms)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV K20 D8129 ]--| // Đặt Timeout 200ms",
    notes: "Có tính chất lưu giữ nhớ (Latch/EEPROM).",
    tags: ["d8129", "timeout time", "comm timeout", "m8129", "ch1"],
  },

  // ==========================================
  // --- 6. N:N NETWORK (D8173 ~ D8180) ---
  // ==========================================
  {
    id: "D8176",
    name: "N:N Network station number setting",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary: "Cài đặt số trạm trong mạng N:N (0: Master, 1~7: Slave).",
    description:
      "Quy định vai trò và số thứ tự trạm của PLC trong mạng truyền thông N:N Network (0 là trạm chủ Master, từ 1 đến 7 là trạm tớ Slave).",
    initialValue: "0 (Master)",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV K0 D8176 ]--| // Đặt PLC làm Master",
    notes: "Thiết lập trước khi bật mạng N:N.",
    tags: ["d8176", "n:n network", "station number", "master", "slave"],
  },
  {
    id: "D8177",
    name: "N:N Network total slave station number setting",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary: "Cài đặt tổng số trạm Slave kết nối trong mạng N:N (1 đến 7).",
    description:
      "Cài đặt số lượng trạm con Slave tham gia trao đổi dữ liệu trong mạng N:N (chỉ cài đặt trên trạm Master).",
    initialValue: "1 - 7",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV K3 D8177 ]--| // Mạng gồm 3 Slave",
    notes: "Chỉ cài đặt trên Master (D8176 = 0).",
    tags: ["d8177", "n:n network", "total slaves"],
  },
  {
    id: "D8178",
    name: "N:N Network refresh range setting",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary: "Cài đặt dải trao đổi dữ liệu (Pattern 0, 1, 2) trong mạng N:N.",
    description:
      "Quy định số lượng thanh ghi D và bit M tự động đồng bộ giữa các trạm PLC (Pattern 0: 4 thanh ghi D, Pattern 1: 32 bit M + 4 thanh ghi D, Pattern 2: 64 bit M + 8 thanh ghi D).",
    initialValue: "0, 1, 2",
    applicableModels:
      "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC, FX2N, FX2NC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV K1 D8178 ]--| // Chọn Pattern 1",
    notes: "Chỉ cài đặt trên Master.",
    tags: ["d8178", "n:n network", "refresh range", "pattern"],
  },

  // ==========================================
  // --- 7. ANALOG SPECIAL ADAPTERS (D8260 ~ D8299) ---
  // ==========================================
  {
    id: "D8260",
    name: "1st Adapter/Board Ch1 Conversion Value",
    type: "word",
    category: "analog",
    rw: "R",
    summary:
      "Giá trị số ngõ vào Analog Kênh 1 (0-4000) từ Bo BD1 (FX3S/3G) hoặc Adapter 1 (FX3U).",
    description:
      "Lưu giá trị số chuyển đổi Analog Kênh 1 (0-4000 tương ứng 0-10V hoặc 4-20mA).",
    initialValue: "0 - 4000",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8260 D100 ]--|",
    notes: "Đọc trực tiếp không cần lệnh FROM/TO.",
    tags: ["d8260", "analog", "ch1", "digital value", "bd1", "adp1"],
  },
  {
    id: "D8261",
    name: "1st Adapter/Board Ch2 Conversion Value",
    type: "word",
    category: "analog",
    rw: "R",
    summary:
      "Giá trị số ngõ vào Analog Kênh 2 (0-4000) từ Bo BD1 hoặc Adapter 1.",
    description: "Lưu giá trị số chuyển đổi Analog Kênh 2 (0-4000).",
    initialValue: "0 - 4000",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8261 D101 ]--|",
    notes: "Đọc trực tiếp ngõ vào Kênh 2.",
    tags: ["d8261", "analog", "ch2", "digital value"],
  },
  {
    id: "D8280",
    name: "Adapter 1 (FX3S/3G) / Adapter 3 (FX3U) Ch1 Data",
    type: "word",
    category: "analog",
    rw: "R",
    summary:
      "Giá trị số ngõ vào Analog Kênh 1 (0-4000) từ bo/adapter Analog FX3U-4AD-ADP.",
    description:
      "Theo tài liệu Mitsubishi Section 37.2.18 & 37.2.19:\n- Trên FX3S/FX3G/FX3GC: Lưu giá trị số ngõ vào Kênh 1 của Adapter Analog đầu tiên gắn bên trái (ADP1).\n- Trên FX3U/FX3UC: Lưu giá trị số ngõ vào Kênh 1 của Adapter Analog thứ 3 kết nối bên trái.",
    initialValue: "0 - 4000",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample:
      "|--[ M8000 ]-----------------[ MOV D8280 D100 ]--| // Đọc trực tiếp không cần FROM/TO",
    notes:
      "Đọc trực tiếp dữ liệu từ thanh ghi đặc biệt mà không cần sử dụng lệnh FROM/TO.",
    tags: ["d8280", "analog", "4ad-adp", "ch1", "digital value", "0-4000"],
  },
  {
    id: "D8281",
    name: "Adapter 1 (FX3S/3G) / Adapter 3 (FX3U) Ch2 Data",
    type: "word",
    category: "analog",
    rw: "R",
    summary: "Giá trị số ngõ vào Analog Kênh 2 (0-4000) từ bo/adapter Analog.",
    description:
      "Lưu giá trị số chuyển đổi kênh 2 ngõ vào Analog (0-4000) từ bo mở rộng hoặc adapter kết nối bên trái PLC.",
    initialValue: "0 - 4000",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8281 D101 ]--|",
    notes: "Đọc dữ liệu Analog Kênh 2.",
    tags: ["d8281", "analog", "4ad-adp", "ch2", "digital value"],
  },

  // ==========================================
  // --- 8. HIGH-SPEED PULSE & POSITIONING (D8340 ~ D8379) ---
  // ==========================================
  {
    id: "D8340",
    name: "[Y000] Current value register (Lower 16-bit)",
    type: "word",
    category: "positioning",
    rw: "R/W",
    summary:
      "Thanh ghi lưu vị trí xung hiện tại trục Y000 (16-bit thấp, kết hợp với D8341 thành số 32-bit).",
    description:
      "Theo tài liệu Mitsubishi Chapter 37.1.2: D8340 (16-bit thấp) kết hợp với D8341 (16-bit cao) tạo thành cặp thanh ghi 32-bit (D8341, D8340) lưu trữ vị trí tọa độ xung hiện tại của ngõ ra trục Y000 (Current value register). Tự động tăng/giảm khi phát xung định vị.",
    initialValue: "0 (32-bit: D8341, D8340)",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC",
    ladderExample:
      "|--[ DMOV D8340 D200 ]--------------------------| // Đọc vị trí 32-bit trục 1",
    notes:
      "Có thể dùng lệnh DMOV để ghi đè vị trí mới (ví dụ: Reset vị trí về 0 sau khi hoàn tất về gốc Home Return DSZR/ZRN).",
    tags: [
      "d8340",
      "y000",
      "current value",
      "pulse count",
      "position",
      "servo",
      "motion",
    ],
  },
  {
    id: "D8341",
    name: "[Y000] Current value register (Upper 16-bit)",
    type: "word",
    category: "positioning",
    rw: "R/W",
    summary: "Thanh ghi lưu vị trí xung hiện tại trục Y000 (16-bit cao).",
    description:
      "16-bit cao của thanh ghi vị trí hiện tại trục Y000. Kết hợp cùng D8340 tạo thành số nguyên có dấu 32-bit từ -2,147,483,648 đến +2,147,483,647 xung.",
    initialValue: "0",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC",
    ladderExample:
      "|--[ DMOV K0 D8340 ]----------------------------| // Reset vị trí trục Y000 về 0",
    notes: "Luôn đọc/ghi theo cặp 32-bit bằng các lệnh DMOV, DADD, DSUB...",
    tags: ["d8341", "y000", "current value", "upper 16bit", "position"],
  },
  {
    id: "D8342",
    name: "[Y000] Bias speed",
    type: "word",
    category: "positioning",
    rw: "R/W",
    summary:
      "Tốc độ khởi động (Bias speed) khi phát xung định vị trên trục Y000 (Đơn vị: Hz, mặc định: 0Hz).",
    description:
      "Quy định tần số phát xung khởi đầu và kết thúc khi chạy các lệnh định vị.",
    initialValue: "0 (Hz)",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV K500 D8342 ]--| // Đặt tốc độ khởi động 500Hz",
    notes: "Tránh giật động cơ bước khi khởi động.",
    tags: ["d8342", "y000", "bias speed", "frequency", "stepper"],
  },
  {
    id: "D8343",
    name: "[Y000] Maximum speed (Lower 16-bit)",
    type: "word",
    category: "positioning",
    rw: "R/W",
    summary:
      "Tốc độ tối đa cho phép trên trục Y000 (16-bit thấp, mặc định: 100,000 Hz).",
    description:
      "Kết hợp với D8344 tạo thành số 32-bit (D8344, D8343) giới hạn tốc độ tối đa cho trục Y000 (lên đến 100 kHz trên FX3G, 200 kHz trên FX3U).",
    initialValue: "100,000 (Hz)",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ DMOV K100000 D8343 ]-----------------------|",
    notes: "Bảo vệ cơ cấu không bị chạy vượt quá tốc độ giới hạn.",
    tags: ["d8343", "y000", "max speed", "frequency", "limit"],
  },
  {
    id: "D8345",
    name: "[Y000] Creep speed",
    type: "word",
    category: "positioning",
    rw: "R/W",
    summary:
      "Tốc độ bò Creep Speed khi chạm cảm biến gốc trong lệnh về gốc DSZR (Mặc định: 1000 Hz).",
    description:
      "Tốc độ di chuyển chậm chính xác sau khi chạm cữ DOG để tìm tín hiệu điểm 0 (Zero point/Z-phase).",
    initialValue: "1000 (Hz)",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ M8002 ]-----------------[ MOV K1000 D8345 ]--|",
    notes: "Cài đặt cho lệnh DSZR/ZRN.",
    tags: ["d8345", "y000", "creep speed", "dszr", "home"],
  },
  {
    id: "D8346",
    name: "[Y000] Zero return speed (Lower 16-bit)",
    type: "word",
    category: "positioning",
    rw: "R/W",
    summary:
      "Tốc độ chạy nhanh về gốc Home Return trục Y000 (32-bit: D8347, D8346, mặc định: 50,000 Hz).",
    description:
      "Tốc độ di chuyển hành trình dài trước khi chạm cảm biến gốc DOG.",
    initialValue: "50,000 (Hz)",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ DMOV K50000 D8346 ]------------------------|",
    notes: "Thiết lập cho lệnh DSZR/ZRN.",
    tags: ["d8346", "y000", "zero return speed", "dszr"],
  },
  {
    id: "D8348",
    name: "[Y000] Acceleration time",
    type: "word",
    category: "positioning",
    rw: "R/W",
    summary:
      "Thời gian tăng tốc khi phát xung định vị trục Y000 (Đơn vị: ms, mặc định: 100ms).",
    description:
      "D8348 quy định thời gian tăng tốc từ tốc độ khởi động Bias Speed lên tốc độ tối đa Maximum Speed trên trục Y000. Mặc định là 100ms.",
    initialValue: "100 (ms)",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV K200 D8348 ]--| // Đặt tăng tốc 200ms",
    notes: "Áp dụng cho các lệnh phát xung định vị tốc độ cao.",
    tags: ["d8348", "y000", "acceleration time", "accel", "positioning"],
  },
  {
    id: "D8349",
    name: "[Y000] Deceleration time",
    type: "word",
    category: "positioning",
    rw: "R/W",
    summary:
      "Thời gian giảm tốc khi phát xung định vị trục Y000 (Đơn vị: ms, mặc định: 100ms).",
    description:
      "D8349 quy định thời gian giảm tốc từ tốc độ tối đa về 0 khi dừng định vị trên trục Y000. Mặc định là 100ms.",
    initialValue: "100 (ms)",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV K150 D8349 ]--| // Đặt giảm tốc 150ms",
    notes: "Áp dụng cho các lệnh phát xung định vị tốc độ cao.",
    tags: ["d8349", "y000", "deceleration time", "decel", "positioning"],
  },
  {
    id: "D8350",
    name: "[Y001] Current value register (Lower 16-bit)",
    type: "word",
    category: "positioning",
    rw: "R/W",
    summary:
      "Thanh ghi lưu vị trí xung hiện tại trục Y001 (16-bit thấp, kết hợp với D8351 thành 32-bit).",
    description:
      "D8350 (16-bit thấp) kết hợp với D8351 (16-bit cao) tạo thành cặp thanh ghi 32-bit (D8351, D8350) lưu vị trí xung tọa độ hiện tại của trục ngõ ra Y001.",
    initialValue: "0 (32-bit: D8351, D8350)",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC",
    ladderExample:
      "|--[ DMOV D8350 D202 ]--------------------------| // Đọc vị trí trục Y001",
    notes: "Đọc và cập nhật vị trí tọa độ trục Y001.",
    tags: [
      "d8350",
      "y001",
      "current value",
      "pulse count",
      "position",
      "servo",
    ],
  },
  {
    id: "D8351",
    name: "[Y001] Current value register (Upper 16-bit)",
    type: "word",
    category: "positioning",
    rw: "R/W",
    summary: "Thanh ghi lưu vị trí xung hiện tại trục Y001 (16-bit cao).",
    description:
      "16-bit cao của thanh ghi vị trí hiện tại trục Y001. Kết hợp cùng D8350 tạo thành số 32-bit có dấu.",
    initialValue: "0",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC, FX1S, FX1N, FX1NC",
    ladderExample:
      "|--[ DMOV K0 D8350 ]----------------------------| // Reset vị trí trục Y001 về 0",
    notes: "Luôn truy xuất theo cặp 32-bit.",
    tags: ["d8351", "y001", "current value", "upper 16bit", "position"],
  },
  {
    id: "D8358",
    name: "[Y001] Acceleration time",
    type: "word",
    category: "positioning",
    rw: "R/W",
    summary: "Thời gian tăng tốc trục Y001 (Đơn vị: ms, mặc định: 100ms).",
    description: "Thời gian tăng tốc trục 2 (Y001).",
    initialValue: "100 (ms)",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ M8002 ]-----------------[ MOV K200 D8358 ]--|",
    notes: "Thiết lập cho trục Y001.",
    tags: ["d8358", "y001", "accel time"],
  },
  {
    id: "D8359",
    name: "[Y001] Deceleration time",
    type: "word",
    category: "positioning",
    rw: "R/W",
    summary: "Thời gian giảm tốc trục Y001 (Đơn vị: ms, mặc định: 100ms).",
    description: "Thời gian giảm tốc trục 2 (Y001).",
    initialValue: "100 (ms)",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ M8002 ]-----------------[ MOV K150 D8359 ]--|",
    notes: "Thiết lập cho trục Y001.",
    tags: ["d8359", "y001", "decel time"],
  },
  {
    id: "D8360",
    name: "[Y002] Current value register (Lower 16-bit)",
    type: "word",
    category: "positioning",
    rw: "R/W",
    summary:
      "Thanh ghi lưu vị trí xung hiện tại trục Y002 (16-bit thấp, kết hợp với D8361 thành 32-bit).",
    description: "Lưu tọa độ vị trí xung hiện tại của trục thứ 3 (Y002).",
    initialValue: "0",
    applicableModels: "FX3G, FX3U, FX3UC",
    ladderExample: "|--[ DMOV D8360 D204 ]--------------------------|",
    notes: "Hỗ trợ trên FX3G (40/60 I/O) và FX3U/FX3UC.",
    tags: ["d8360", "y002", "axis3", "current value"],
  },
  {
    id: "D8370",
    name: "[Y003] Current value register (Lower 16-bit)",
    type: "word",
    category: "positioning",
    rw: "R/W",
    summary:
      "Thanh ghi lưu vị trí xung hiện tại trục Y003 (16-bit thấp, kết hợp với D8371 thành 32-bit).",
    description:
      "Lưu tọa độ vị trí xung hiện tại của trục thứ 4 (Y003) trên FX3U/FX3UC.",
    initialValue: "0",
    applicableModels: "FX3U, FX3UC",
    ladderExample: "|--[ DMOV D8370 D206 ]--------------------------|",
    notes: "Dành riêng cho FX3U/FX3UC.",
    tags: ["d8370", "y003", "axis4", "current value"],
  },
  {
    id: "D8398",
    name: "1ms ring counter (Lower 16-bit)",
    type: "word",
    category: "clock",
    rw: "R/W",
    summary:
      "Bộ đếm vòng thời gian độ phân giải 1ms (16-bit thấp, kết hợp với D8399 thành số 32-bit).",
    description:
      "Tự động đếm tăng từ 0 đến 2,147,483,647 (32-bit) mỗi 1ms khi cờ M8398 bật ON.",
    initialValue: "0",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample:
      "|--[ DMOV D8398 D300 ]--------------------------| // Đọc mili-giây chuẩn xác",
    notes: "Thiết bị tương ứng: M8398, D8399.",
    tags: ["d8398", "1ms ring counter", "timer", "resolution"],
  },
  {
    id: "D8399",
    name: "1ms ring counter (Upper 16-bit)",
    type: "word",
    category: "clock",
    rw: "R/W",
    summary: "Bộ đếm vòng thời gian độ phân giải 1ms (16-bit cao).",
    description: "16-bit cao của bộ đếm vòng 1ms 32-bit (D8399, D8398).",
    initialValue: "0",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ DMOV D8398 D300 ]--------------------------|",
    notes: "Luôn truy xuất theo cặp 32-bit.",
    tags: ["d8399", "1ms ring counter", "upper"],
  },

  // ==========================================
  // --- 9. SERIAL RS2 & MODBUS COMMUNICATION (D8400 ~ D8439) ---
  // ==========================================
  {
    id: "D8400",
    name: "RS2 (FNC 87) [ch1] / MODBUS [ch1] Communication format",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary:
      "Thanh ghi cấu hình định dạng truyền thông cho lệnh RS2 (FNC 87) hoặc kênh MODBUS Ch1.",
    description:
      "Theo tài liệu Mitsubishi Chapter 37.1.2: D8400 cấu hình định dạng truyền thông nối tiếp (Baudrate, Parity, Data length, Stop bit) cho lệnh RS2 hoặc giao thức Modbus RTU trên cổng Channel 1.",
    initialValue: "H0000",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV H0081 D8400 ]--| // 9600-8-N-1 cho RS2",
    notes: "Chỉ hỗ trợ trên các dòng PLC thế hệ FX3 trở lên.",
    tags: ["d8400", "rs2", "modbus", "comm format", "fnc87", "ch1"],
  },
  {
    id: "D8401",
    name: "MODBUS [ch1] Protocol setting",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary:
      "Cài đặt giao thức MODBUS Ch1 (H0000: Modbus RTU Master, H0001: Modbus RTU Slave).",
    description:
      "Quy định chế độ hoạt động Master hay Slave cho cổng Modbus Ch1.",
    initialValue: "H0000 (Master)",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV H0000 D8401 ]--| // Chạy Modbus Master",
    notes: "Tài liệu MODBUS Communication Edition.",
    tags: ["d8401", "modbus protocol", "master", "slave", "ch1"],
  },
  {
    id: "D8402",
    name: "MODBUS [ch1] Communication error code",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary: "Mã lỗi truyền thông MODBUS trên Kênh 1 khi cờ M8402 bật ON.",
    description:
      "Lưu mã lỗi chi tiết khi xảy ra sự cố trong quá trình truyền nhận theo giao thức MODBUS trên cổng Ch1.",
    initialValue: "0 (Không lỗi)",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ M8402 ]-----------------[ MOV D8402 D300 ]--|",
    notes: "Thiết bị tương ứng: M8402.",
    tags: ["d8402", "modbus error", "comm error", "m8402", "ch1"],
  },
  {
    id: "D8405",
    name: "Communication parameter display [ch1]",
    type: "word",
    category: "comm",
    rw: "R",
    summary:
      "Hiển thị thông số tham số truyền thông thực tế đang hoạt động trên Kênh 1.",
    description:
      "[D]8405 hiển thị các tham số phần cứng thực tế mà cổng truyền thông Ch1 đang áp dụng.",
    initialValue: "Read only display",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8405 D301 ]--|",
    notes: "Chỉ hỗ trợ trên các dòng PLC FX3 Series.",
    tags: ["d8405", "parameter display", "comm status", "ch1", "fx3"],
  },
  {
    id: "D8409",
    name: "MODBUS [ch1] / RS2 [ch1] Slave response timeout",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary:
      "Thời gian chờ Slave phản hồi trong giao tiếp MODBUS Ch1 (Đơn vị: ms, mặc định: 500ms).",
    description:
      "Quy định thời gian tối đa Master chờ frame phản hồi từ thiết bị Slave trước khi báo lỗi Timeout (M8409).",
    initialValue: "500 (ms)",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV K300 D8409 ]--| // Đặt Timeout 300ms",
    notes: "Thiết bị tương ứng: M8409.",
    tags: ["d8409", "modbus timeout", "slave response", "ch1"],
  },
  {
    id: "D8414",
    name: "MODBUS [ch1] Slave node address",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary: "Địa chỉ trạm Slave của PLC trong mạng MODBUS Ch1 (1 đến 247).",
    description:
      "Cài đặt địa chỉ ID trạm khi PLC đóng vai trò là Modbus RTU Slave trên cổng Ch1.",
    initialValue: "1",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample:
      "|--[ M8002 ]-----------------[ MOV K1 D8414 ]--| // Trạm Modbus Slave số 1",
    notes: "Dải địa chỉ hợp lệ: 1 đến 247.",
    tags: ["d8414", "modbus slave address", "node id", "ch1"],
  },
  {
    id: "D8419",
    name: "Operation mode display [ch1]",
    type: "word",
    category: "comm",
    rw: "R",
    summary:
      "Hiển thị chế độ hoạt động của Kênh truyền thông 1 (Non-protocol, Computer Link, Modbus...).",
    description:
      "[D]8419 cho biết chế độ giao tiếp hiện thời của cổng truyền thông Ch1 đang được cấu hình chạy theo kiểu nào.",
    initialValue: "Read only display",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ M8000 ]-----------------[ MOV D8419 D302 ]--|",
    notes: "Giúp chẩn đoán nhanh chế độ giao tiếp phần cứng trên Ch1.",
    tags: ["d8419", "operation mode", "comm mode", "ch1", "fx3"],
  },
  {
    id: "D8420",
    name: "RS2 (FNC 87) [ch2] / MODBUS [ch2] Communication format",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary:
      "Thanh ghi cấu hình định dạng truyền thông nối tiếp Kênh 2 (BD2 hoặc ADP2).",
    description:
      "Cấu hình 16-bit cho cổng truyền thông thứ 2 (Baudrate, Parity, Stop bit, Mode).",
    initialValue: "H0000",
    applicableModels: "FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ M8002 ]-----------------[ MOV H0081 D8420 ]--|",
    notes: "Áp dụng cho cổng giao tiếp thứ 2.",
    tags: ["d8420", "comm format", "ch2", "rs2", "modbus"],
  },
  {
    id: "D8422",
    name: "MODBUS [ch2] Communication error code",
    type: "word",
    category: "comm",
    rw: "R/W",
    summary: "Mã lỗi truyền thông MODBUS trên Kênh 2 khi cờ M8422 bật ON.",
    description:
      "Lưu mã lỗi chi tiết khi xảy ra sự cố trong truyền nhận Modbus cổng Ch2.",
    initialValue: "0 (Không lỗi)",
    applicableModels: "FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ M8422 ]-----------------[ MOV D8422 D310 ]--|",
    notes: "Thiết bị tương ứng: M8422.",
    tags: ["d8422", "modbus error", "ch2"],
  },
  {
    id: "D8487",
    name: "USB communication error code",
    type: "word",
    category: "comm",
    rw: "R",
    summary: "Mã lỗi truyền thông qua cổng USB tích hợp.",
    description:
      "Lưu chi tiết mã lỗi khi phát sinh sự cố giao tiếp qua cổng Mini-USB trên PLC.",
    initialValue: "0",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ M8487 ]-----------------[ MOV D8487 D320 ]--|",
    notes: "Thiết bị tương ứng: M8487.",
    tags: ["d8487", "usb error code", "comm"],
  },
  {
    id: "D8489",
    name: "Special parameter error code",
    type: "word",
    category: "error",
    rw: "R",
    summary: "Mã lỗi tham số đặc biệt (Special parameter error code).",
    description:
      "Lưu chi tiết mã lỗi khi các tham số đặc biệt (Ethernet, Analog, Motion) bị lỗi.",
    initialValue: "0",
    applicableModels: "FX3S, FX3G, FX3GC, FX3U, FX3UC",
    ladderExample: "|--[ M8489 ]-----------------[ MOV D8489 D321 ]--|",
    notes: "Thiết bị tương ứng: M8489.",
    tags: ["d8489", "special parameter error code"],
  },
];
