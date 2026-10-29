# 236729_TranHoangKhiem

## Thông tin sinh viên
- MSSV: 236729
- Họ tên: TranHoangKhiem

## Đề tài
Xây dựng và triển khai hệ thống quản lý món ăn trên nền tảng điện toán đám mây.

## Công nghệ sử dụng
- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Quản lý mã nguồn: Git, GitHub
- Đóng gói: Docker, Docker Hub
- Triển khai: Render

## Cấu trúc dự án
- `backend/`: REST API quản lý món ăn.
- `frontend/`: Giao diện React quản lý món ăn.

## Chức năng
- Hiển thị danh sách món ăn.
- Xem chi tiết món ăn.
- Thêm, cập nhật và xóa món ăn.
- Tìm kiếm món ăn theo từ khóa.

## Hướng dẫn cài đặt và chạy
Sẽ cập nhật lệnh cài đặt và chạy sau khi hoàn thành backend và frontend.

## Liên kết triển khai
Sẽ cập nhật URL Frontend, Backend và Docker Hub sau khi triển khai.

## Câu 5 - Docker Backend

Docker Hub: https://hub.docker.com/r/khiemth/backend

### Build Backend
docker buildx build --platform linux/amd64 -t khiemth/backend:1.0 --load ./backend

### Chạy Backend
docker run -d --name food-backend --env-file backend/.env -e PORT=5000 -p 5501:5000 khiemth/backend:1.0

### Kiểm tra
- http://localhost:5501/health
- http://localhost:5501/api/foods
## Câu 6 - Docker Frontend

Docker Hub:
https://hub.docker.com/r/khiemth/frontend

Build:
docker buildx build --platform linux/amd64 -t khiemth/frontend:1.0 --load ./frontend

Chạy Frontend:
docker run -d --name food-frontend -p 5502:80 -e BACKEND_ORIGIN=http://host.docker.internal:5501 khiemth/frontend:1.0

Truy cập:
http://localhost:5502