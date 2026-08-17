---
sidebar_position: 2
title: Cơ Chế Cập Nhật PWA (Progressive Web App)
description: Hướng dẫn chi tiết về cơ chế phát hiện và cập nhật Service Worker tự chủ người dùng (User-driven PWA Update) trong ứng dụng ShareMe.
---

# Cơ Chế Cập Nhật PWA (Progressive Web App)

Tài liệu này giải thích chi tiết kiến trúc, vòng đời và cách triển khai tính năng **Cập nhật PWA chủ động theo thao tác người dùng (User-driven PWA Update)** trong ứng dụng **ShareMe Tools**.

---

## 1. Tổng Quan Kiến Trúc

Thông thường, khi một Progressive Web App (PWA) có phiên bản mới, Service Worker mới sẽ được tải về ở background. Nếu cấu hình tự động `self.skipWaiting()`, Service Worker mới sẽ chiếm quyền kiểm soát ngay lập tức, làm ngắt kết nối hoặc reload trang đột ngột gây ảnh hưởng đến trải nghiệm của người dùng.

Để giải quyết vấn đề trên, ứng dụng **ShareMe Tools** áp dụng mô hình **Cập nhật có xác nhận (User-driven update)** với các tiêu chí:
1. **Không tự động kích hoạt**: Bản cập nhật mới tải về sẽ ở trạng thái chờ (`waiting`).
2. **Hiển thị thông báo trực quan**: Sử dụng UI Dialog (shadcn/ui) kết hợp với hình ảnh/icon minh họa.
3. **Chỉ cập nhật khi người dùng xác nhận**: Người dùng bấm nút **"Cập nhật ngay"** thì mới gửi lệnh kích hoạt Service Worker mới và reload lại trang.
4. **Thanh tiến trình (Progress Bar)**: Hiển thị phần trăm tiến trình mượt mượt giúp người dùng biết ứng dụng đang xử lý.

---

## 2. Các Thành Phần Chính Trong Hệ Thống

Kiến trúc cập nhật PWA gồm 4 thành phần kết nối với nhau:

```text
┌─────────────────┐       ┌──────────────────────┐
│  index.html     │ ────> │ window.__swRegister  │
└─────────────────┘       └──────────┬───────────┘
                                     │
                                     ▼
┌─────────────────┐       ┌──────────────────────┐
│  public/sw.js   │ <──── │ use-sw-update.js     │
└─────────────────┘       └──────────┬───────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │ PwaUpdateNotification│
                          └──────────────────────┘
```

### 2.1. Service Worker (`apps/tools/public/sw.js`)
- Trong sự kiện `install`, **không gọi** `self.skipWaiting()`. Bản SW mới sẽ dừng ở trạng thái `waiting`.
- Thêm sự kiện lắng nghe `message`:
  ```javascript
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });
  ```

### 2.2. Đăng ký Service Worker (`apps/tools/index.html`)
- Đoạn mã inline script thực hiện đăng ký Service Worker và lưu đối tượng registration vào biến toàn cục `window.__swRegistration`.
- Đồng thời phát một custom event `sw-registered` để các React component/hook có thể đăng ký lắng nghe kịp thời.

### 2.3. Custom Hook (`apps/tools/src/hooks/use-sw-update.js`)
Hook quản lý toàn bộ logic kiểm tra và cập nhật SW với các giá trị trả về:
- `hasUpdate` *(boolean)*: Bằng `true` khi phát hiện có Service Worker mới đang chờ kích hoạt.
- `isUpdating` *(boolean)*: Bằng `true` khi người dùng bấm nút cập nhật và tiến trình đang chạy.
- `updateProgress` *(number)*: Phần trăm tiến trình (0% - 100%).
- `applyUpdate()` *(function)*: Gửi tin nhắn `{ type: "SKIP_WAITING" }` tới SW đang chờ và tự động reload trang khi `controllerchange` kích hoạt.
- `dismissUpdate()` *(function)*: Tạm ẩn thông báo cập nhật (người dùng chọn "Để sau").

### 2.4. UI Component (`apps/tools/src/components/PwaUpdateNotification.jsx`)
- Được xây dựng dựa trên bộ thư viện **shadcn/ui** (`Dialog`, `Button`, `Progress`).
- Đặt tại cấp cao nhất trong `main.jsx` (bên trong `ThemeProvider`) để có thể hiển thị ở bất kỳ trang nào.
- Hỗ trợ prop `forceShow={true}` phục vụ việc kiểm thử giao diện (Test Mode UI) mà không cần tạo bản build SW thật.

---

## 3. Luồng Hoạt Động (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant App as React App
    participant Hook as useServiceWorkerUpdate
    participant SW as Service Worker

    Note over SW: Có phiên bản code mới được deploy
    SW->>Hook: Trạng thái SW chuyển sang installed (waiting)
    Hook->>App: Cập nhật state hasUpdate = true
    App->>User: Hiển thị Dialog thông báo có bản cập nhật

    alt Người dùng bấm "Cập nhật ngay"
        User->>App: Click nút "Cập nhật ngay"
        App->>Hook: Gọi hàm applyUpdate()
        Hook->>Hook: Bắt đầu chạy Progress animation
        Hook->>SW: postMessage({ type: 'SKIP_WAITING' })
        Note over SW: Kích hoạt self.skipWaiting()
        SW-->>Hook: Phát sự kiện controllerchange
        Hook->>Hook: Set Progress = 100%
        Hook->>App: window.location.reload()
        Note over User: Trang web tải lại với phiên bản mới nhất!
    else Người dùng bấm "Để sau"
        User->>App: Click nút "Để sau"
        App->>Hook: Gọi hàm dismissUpdate()
        Hook->>App: Ẩn Dialog (Service Worker vẫn tiếp tục chờ)
    end
```

---

## 4. Hướng Dẫn Kiểm Thử (Testing)

### 4.1. Kiểm Thử Giao Diện (UI Test Mode)
Để xem trước giao diện Modal mà không cần trigger Service Worker thật, bạn chỉ cần truyền prop `forceShow={true}` vào component:

```jsx
// Ví dụ tại một trang bất kỳ:
<PwaUpdateNotification forceShow={true} />
```

Khi ở chế độ `forceShow`:
- Dialog thông báo sẽ luôn hiển thị.
- Khi bấm **"Cập nhật ngay"**, thanh Progress bar sẽ chạy giả lập từ 0% đến 100% trong vòng 3 giây để kiểm tra animation.

### 4.2. Kiểm Thử Service Worker Thực Tế (DevTools)
1. Chạy dự án ở môi trường dev hoặc preview (`npm run build && npm run preview`).
2. Mở trình duyệt Chrome/Edge, nhấn **F12** mở **DevTools**.
3. Chuyển sang tab **Application** > **Service Workers**.
4. Chỉnh sửa một nội dung nhỏ trong `apps/tools/public/sw.js` (ví dụ đổi `CACHE_NAME = "shareme-tools-cache-v2"`).
5. Lưu file, trình duyệt sẽ tải bản SW mới về và hiển thị dòng trạng thái **waiting to activate**.
6. Lúc này `PwaUpdateNotification` trên giao diện sẽ tự động xuất hiện.
