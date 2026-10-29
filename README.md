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

### 1. Yêu cầu
- Node.js và npm
- MongoDB Atlas
- Docker Desktop (nếu chạy bằng Docker)

### 2. Chạy Backend

Mở Terminal tại thư mục dự án:

```bash
cd backend
npm ci
```

Tạo file `.env` dựa trên `.env.example` và cấu hình:

```env
PORT=5001
DB_NAME=236729_TranHoangKhiem
MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
```

Khởi động Backend:

```bash
npm run dev
```

Kiểm tra:
- http://localhost:5001/health
- http://localhost:5001/api/foods

### 3. Chạy Frontend

Mở Terminal thứ hai tại thư mục dự án:

```bash
cd frontend
npm ci
npm run dev
```

Truy cập:
http://localhost:5173

Frontend dùng Vite Proxy để kết nối Backend tại cổng 5001.

### 4. Chạy bằng Docker

Backend:

```bash
docker run -d --name food-backend \
  --env-file backend/.env \
  -e PORT=5000 \
  -p 5501:5000 \
  khiemth/backend:1.0
```

Frontend:

```bash
docker run -d --name food-frontend \
  -p 5502:80 \
  -e BACKEND_ORIGIN=http://host.docker.internal:5501 \
  khiemth/frontend:1.0
```

Truy cập ứng dụng Docker:
http://localhost:5502

Frontend sử dụng Nginx Reverse Proxy để kết nối Backend.



## Liên kết triển khai

### GitHub Repository
https://github.com/khiem0000/236729_TranHoangKhiem

### Docker Hub
- Backend: https://hub.docker.com/r/khiemth/backend
- Frontend: https://hub.docker.com/r/khiemth/frontend

### Render
- Frontend: https://web-236729.onrender.com
- Backend API: https://api-236729.onrender.com

### Các API kiểm tra
- Health Check: https://api-236729.onrender.com/health
- Danh sách món ăn: https://api-236729.onrender.com/api/foods
- API qua Nginx: https://web-236729.onrender.com/api/foods

### MongoDB Atlas
- Cluster: Cluster0
- Database: 236729_TranHoangKhiem
- Collection: foods


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

## Câu 7 - Triển khai Frontend trên Render

- Service: web-236729
- Frontend URL: https://web-236729.onrender.com
- Frontend API Proxy: https://web-236729.onrender.com/api/foods
- Docker Image: khiemth/frontend:1.0
- Backend Origin: https://api-236729.onrender.com

Frontend sử dụng React, Docker và Nginx Reverse Proxy.
Dữ liệu được lấy từ MongoDB Atlas thông qua Backend Express.


## Câu 8 - Triển khai Backend trên Render

- Service: api-236729
- Backend URL: https://api-236729.onrender.com
- Health Check: https://api-236729.onrender.com/health
- Foods API: https://api-236729.onrender.com/api/foods
- Docker Image: khiemth/backend:1.0

Backend được kết nối MongoDB Atlas qua các biến môi trường
MONGODB_URI và DB_NAME trên Render.

Hệ thống hỗ trợ lấy danh sách, xem chi tiết, thêm, sửa,
xóa và tìm kiếm món ăn.

## Câu 9 - Kiểm tra tổng thể và hoàn thiện bài nộp

### Thông tin sinh viên
- MSSV: 236729
- Họ tên: TranHoangKhiem

### Hệ thống đã triển khai
- GitHub: https://github.com/khiem0000/236729_TranHoangKhiem
- Docker Backend: https://hub.docker.com/r/khiemth/backend
- Docker Frontend: https://hub.docker.com/r/khiemth/frontend
- Frontend Render: https://web-236729.onrender.com
- Backend Render: https://api-236729.onrender.com

### MongoDB Atlas
- Cluster: Cluster0
- Database: 236729_TranHoangKhiem
- Collection: foods
- Dữ liệu mẫu: F001, F002, F003

### Kiểm tra hệ thống
- Frontend kết nối Backend qua Nginx Reverse Proxy.
- Backend kết nối MongoDB Atlas.
- API GET /health hoạt động.
- API GET /api/foods trả danh sách món ăn.
- Đã kiểm thử thêm, sửa, xóa món ăn.
- Kiểm thử xem chi tiết và tìm kiếm món ăn.
- Docker Images đã được đẩy lên Docker Hub.
- Frontend và Backend được triển khai trên Render.
