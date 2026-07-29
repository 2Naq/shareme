# Shareme Tools & Docs

Một bộ công cụ trực tuyến và tài liệu kỹ thuật dùng trong công việc và học tập.

---

## Cấu Trúc Monorepo

Dự án sử dụng mô hình Monorepo (NPM Workspaces) chia thành 2 ứng dụng chính:

- **`apps/tools`**: Ứng dụng React + Vite chứa các bộ công cụ tính toán và mô phỏng trực quan.
- **`apps/docs`**: Trang tài liệu kỹ thuật xây dựng trên Docusaurus, lưu trữ cẩm nang, tài liệu PLC/HMI/Biến tần.

---

## Các Tính Năng Nổi Bật (Tools)

### 1. Tính Toán & Mô Phỏng Độ Sụt Áp (Voltage Drop)

- Mô phỏng đơn tuyến trực quan mô tả dòng năng lượng truyền tải.
- Hỗ trợ đa dạng hệ thống nguồn: Điện 1 pha AC (220V), 3 pha AC (380V), và Một chiều DC.
- Tính toán dòng điện tải, sụt áp trên dây, công suất hao tổn và hiệu suất đường dây.

### 2. Bộ Chuyển Đổi Dữ Liệu Công Nghiệp (Data Conversion)

- **Hệ cơ số (Base Converter):** Chuyển đổi qua lại giữa các hệ Dec, Hex, Bin, Oct.
- **CRC16 Modbus:** Tính mã kiểm tra lỗi CRC16 cho các khung truyền Modbus RTU.
- **Dec/Hex/Swap:** Chuyển đổi dữ liệu và thực hiện đảo byte (Byte Swap, Word Swap).
- **Float ↔ Register:** Chuyển đổi số thực IEEE 754 thành 2 thanh ghi 16-bit
- **Modbus Frame:** Hỗ trợ dựng nhanh khung truyền Modbus RTU đọc/ghi.
- **ASCII ↔ HEX:** Chuyển đổi chuỗi ký tự sang mã thập lục phân.

### 3. Tính Toán Thông Số Điện Công Nghiệp

- Tính nhanh dòng điện $I$, công suất $P$, điện áp $U$.
- Gợi ý chọn loại Aptomat (CB/MCCB) và tiết diện cáp điện tương ứng theo tiêu chuẩn.

### 4. Chuyển Đổi Analog (Analog Scaling)

- Tính toán chuyển đổi giá trị vật lý (nhiệt độ, áp suất, lưu lượng...) sang giá trị số nguyên trong PLC đối với các dải tín hiệu chuẩn 4-20mA, 0-10V...

### 5. Đọc Giá Trị Điện Trở (Resistor Calculator)

- **Điện trở vạch màu:** Xác định trị số điện trở cắm qua mã màu (4 vạch hoặc 5 vạch màu).
- **Điện trở dán SMD:** Giải mã trị số điện trở dán theo chuẩn 3-digit, 4-digit hoặc EIA-96.

---

## Hướng Dẫn Cài Đặt & Chạy Dưới Local

Yêu cầu máy tính đã cài đặt **Node.js** (Khuyên dùng LTS).

1.  **Clone mã nguồn dự án:**

    ```bash
    git clone https://github.com/2Naq/shareme
    cd shareme
    ```

2.  **Cài đặt các gói phụ thuộc (Dependencies):**

    ```bash
    npm install
    ```

3.  **Chạy dự án ở chế độ phát triển (Development Mode):**

    ```bash
    npm run dev
    ```

    _Lệnh này sẽ khởi chạy đồng thời cả trang tài liệu (Docusaurus) và trang công cụ (Vite tools) kèm proxy server kết nối._

4.  **Biên dịch dự án (Build for Production):**
    ```bash
    npm run build
    ```

---

## Giấy Phép (License)

Dự án được phân phối dưới giấy phép **MIT License**. Vui lòng giữ lại thông tin tác giả và tệp License gốc.

## Liên Hệ Hợp Tác

Cảm ơn ní đã quan tâm và sử dụng mã nguồn dự án này! Nếu dự án hữu ích, hãy cho mình xin 1 ⭐ trên GitHub nhé.

**Nếu ní có nhu cầu:**

- Phát triển hoặc tùy chỉnh thêm các công cụ tính toán chuyên biệt.
- Thiết kế hệ thống giám sát tự động hóa Web SCADA, kết nối thu thập dữ liệu PLC/HMI (Siemens, Mitsubishi, Omron, Delta...).
- Hợp tác làm dự án phần mềm công nghiệp (Freelance).

Rất vui được đồng hành cùng ní!
