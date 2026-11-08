# Đưa AnhXtanh School Life V6 lên website để chơi cùng bạn bè

## Cách dễ nhất: GitHub + Render

1. Tạo tài khoản GitHub và Render (có thể cần sự hỗ trợ của phụ huynh/người lớn nếu dịch vụ yêu cầu).
2. Giải nén file ZIP này. Trên GitHub, tạo repository mới, chọn **Add file > Upload files** rồi tải lên **nội dung bên trong** thư mục `anhxtanh_v6_online` (không tải cả thư mục cha). Cần thấy `server.js`, `package.json`, `render.yaml`, thư mục `public` ở cấp gốc.
3. Trên Render, chọn **New > Blueprint**, kết nối GitHub, chọn repository vừa tạo và xác nhận tạo web service theo `render.yaml`. Nếu không thấy Blueprint, chọn **New > Web Service**, chọn repository, đặt runtime Node, build command `npm install --omit=dev`, start command `npm start`.
4. Đợi Render build/deploy thành công, mở đường dẫn `https://<ten-website>.onrender.com` mà Render cấp. Đó là link thật để gửi bạn bè; không cần localhost.
5. Hai người mở cùng URL ở hai trình duyệt/thiết bị khác nhau, đặt tên nhân vật khác nhau và thử di chuyển, chat.

## Lưu ý

- WebSocket tự chọn `wss://` trên HTTPS, không cần cấu hình URL riêng.
- Gói miễn phí có thể ngủ khi không dùng, lần truy cập đầu có thể chậm; giới hạn và chính sách Render có thể thay đổi.
- Multiplayer hiện chỉ đồng bộ người chơi khi cùng một máy chủ đang chạy. Dữ liệu không được lưu bền vững, server khởi động lại sẽ xóa phiên chơi.
- Chưa có đăng ký/đăng nhập bảo mật, lọc nội dung hay công cụ quản trị chat. Chỉ chia sẻ link trong nhóm tin cậy, không dùng tên thật, mật khẩu, số điện thoại hay thông tin cá nhân trong tên nhân vật/chat.
- Cần kết nối Internet để tải Three.js từ CDN.
- Không đưa `node_modules` hoặc `.env` lên GitHub.
