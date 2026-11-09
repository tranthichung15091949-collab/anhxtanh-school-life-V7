# AnhXtanh School Life V6

Bản dựng 3D tham khảo ảnh mặt tiền do người dùng cung cấp. Các khu nhà phụ và nội thất được mô phỏng sáng tạo, không phải bản vẽ kiến trúc chính thức.

## Cách chạy
1. Cài Node.js phiên bản LTS.
2. Mở Terminal trong thư mục `anhxtanh_v6`.
3. Chạy `npm install` rồi `npm start`.
4. Mở `http://localhost:3000`. Cần Internet để tải Three.js từ CDN.

## Điều khiển
- WASD/phím mũi tên: di chuyển; Shift: chạy; kéo chuột: xoay camera.
- Đến gần dãy lớp, nhấn E để vào phòng học; nhấn E lần nữa để ra.
- Bảng giao diện: căn tin, lịch học và sự kiện.

## Multiplayer
Máy chủ WebSocket đồng bộ vị trí và chat cơ bản. Để chơi qua Internet cần deploy máy chủ Node.js lên hosting hỗ trợ WebSocket. Chưa có tài khoản xác thực, quản trị/moderation hay lưu trữ máy chủ. Không sử dụng mật khẩu thật hoặc thông tin cá nhân.

## Giới hạn
Mô hình phong cách low-poly, không phải scan 3D. Giờ học trong game là thời gian mô phỏng bắt đầu 7:15.

## Triển khai website online
Xem `DEPLOY_ONLINE.md` để triển khai GitHub + Render. Có sẵn `render.yaml`.
