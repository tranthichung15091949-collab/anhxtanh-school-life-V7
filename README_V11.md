# AnhXtanh School Life V11 — Emotes & Friendship

## Thay đổi
- Bảng ghi công gần sân khấu: Kiệt & Trung Anh; công cụ hỗ trợ ChatGPT, GitHub, Render (không tuyên bố tài trợ hoặc hợp tác chính thức).
- Menu Emotes: Vẫy tay, Cười vui, Chặn BM (động tác trêu đùa không va chạm), Nhảy, High-five.
- Đồng bộ emote qua WebSocket để người chơi khác có thể thấy. Server xác thực tên emote và giới hạn tốc độ gửi.
- Hiệu ứng được tạo riêng, không sao chép animation gốc từ trò chơi khác.

## Triển khai
Giải nén ZIP, tải **toàn bộ** file lên repository GitHub, giữ nguyên `public/index.html`, `public/game.js`, `server.js`, `package.json`, `render.yaml`. Sau đó Render → Manual Deploy → Deploy latest commit. Kiểm tra game trên hai trình duyệt để xác minh đồng bộ emote.

## Lưu ý
Đây là bản mã nguồn nâng cấp; chưa xác nhận chạy thử đồ họa trên Render. Chức năng emote vẫn hoạt động trên máy cá nhân nếu không kết nối mạng, nhưng người khác sẽ không nhìn thấy.
