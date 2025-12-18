# 🧪 Đồ án môn Kiểm thử phần mềm (KTPM)

Repository này được sử dụng để quản lý mã nguồn, tài liệu và tiến độ làm **Đồ án môn Kiểm thử phần mềm** của nhóm gồm **4 thành viên**.  
Mục tiêu là thực hành các kỹ thuật kiểm thử, xây dựng test case và rèn luyện kỹ năng làm việc nhóm.

---

## 👥 Thành viên nhóm & Vai trò

| Họ và tên              | MSSV       | Vai trò chính       | Vai trò phụ             | Nhiệm vụ |
|------------------------|------------|---------------------|-------------------------|---------------------------------------------------|
| **Lý Kim Thúy**        | 3122411199 | Backend Developer   | Leader / Tester         | Quản lý nhóm, thiết kế kiến trúc, phát triển API, hỗ trợ viết test API |
| **Tô Thảo Nhi**        | 3122411139 | Tester              | Frontend Developer      | Viết & chạy test case, kiểm thử giao diện, hỗ trợ phát triển UI |
| **Đỗ Gia Huy**         | 3122411062 | Tester              | BA / Document Writer    | Thiết kế test scenario, test plan, viết báo cáo kiểm thử, phân tích yêu cầu |
| **Nguyễn Võ Minh Hiếu**| 3122411057 | Frontend Developer  | Tester                  | Phát triển giao diện, kiểm thử chức năng, hỗ trợ viết test case |

---


## 🎯 Mục tiêu môn học
- Hiểu và áp dụng **các mức kiểm thử**: Unit test, Integration test, System test, Acceptance test.  
- Thực hành **kiểm thử hộp đen, hộp trắng**.  
- Thiết kế **test case, test scenario, test plan**.  
- Sử dụng công cụ hỗ trợ kiểm thử (JUnit, Selenium, Postman, …).  
- Báo cáo kết quả kiểm thử và đánh giá chất lượng phần mềm.  

---

## 🛠 Công nghệ & Công cụ dự kiến
- **Ngôn ngữ lập trình**: JavaScript  
- **Backend**: Node.js  
- **Frontend**: ReactJS  
- **Cơ sở dữ liệu**: MySQL  
- **Công cụ kiểm thử**: Postman 

---

## 🚀 Triển khai ứng dụng

### Triển khai production (đề xuất)
- Backend + Database: Railway (MySQL managed + container)
- Frontend: Vercel (deploy Vite/React)

#### 1) Backend + Database trên Railway
1. Tạo project Railway, thêm **MySQL** (managed). Ghi lại `DATABASE_URL` do Railway cung cấp (định dạng `mysql://user:pass@host:port/dbname`).
2. Tạo service **Backend** và chọn **Deploy from GitHub repo** (chọn repo này) hoặc tải code thủ công.
3. Cấu hình biến môi trường cho service Backend:
   - `DATABASE_URL` = URL MySQL Railway cung cấp  
   - `JWT_SECRET` = khóa bí mật của bạn
   - `CORS_ORIGINS` = danh sách domain/frontend được phép, phân tách bởi dấu phẩy (ví dụ `https://your-frontend.vercel.app,http://localhost:3000`)
4. (Tùy chọn) Nếu dùng Prisma, bật migration/seed sau mỗi deploy:  
   - Build/Start command giữ mặc định (Dockerfile đã có `prisma generate`).  
   - Hoặc thêm script chạy `npx prisma migrate deploy` trong “Deploy Hooks” của Railway sau khi container lên.
5. Mở port công khai cho backend (Railway tự gán domain, ví dụ `https://<app>.railway.app`).
6. Lấy domain backend này để dùng cho frontend (bước Vercel).

#### 2) Frontend trên Vercel
1. Push code repo lên GitHub/GitLab, đăng nhập Vercel và **Import Project** từ repo.
2. Chọn root là thư mục `fe`. Vercel sẽ tự nhận ra Vite.
3. Thiết lập biến môi trường Vercel:
   - `VITE_BACKEND_URL` = domain backend Railway (ví dụ `https://<app>.railway.app`)
4. Build command: mặc định `npm run build` (Vercel sẽ chạy `npm install` trước). Output Vite là `dist` (Vercel tự nhận).
5. Deploy. Sau khi có domain Vercel, truy cập và kiểm tra luồng đăng nhập/sản phẩm.

#### 3) Ghi chú bảo mật và cấu hình
- Không hard-code mật khẩu/secret trong repo; dùng biến môi trường trên Railway/Vercel.
- Nếu cần CORS: backend nên cho phép origin từ domain Vercel (ví dụ `https://your-frontend.vercel.app`).
- Nếu có upload file: xem xét dùng object storage (S3/R2) thay vì lưu trong container.

### Phương án 1: Docker Compose (khuyến nghị)
1. Cài đặt Docker & Docker Compose trên máy.
2. (Tùy chọn) Nếu muốn truy cập frontend qua port 3000, chỉnh dòng `ports` của service `frontend` trong `docker-compose.yml` thành `- "3000:5173"` để khớp với port mặc định của Vite.
3. Từ thư mục gốc dự án, chạy:
   ```bash
   docker compose up -d --build
   ```
4. Sau khi dịch vụ khởi động:
   - Backend: http://localhost:8888  
   - Frontend: http://localhost:3000 (hoặc http://localhost:5173 nếu bạn giữ nguyên cấu hình port mặc định của Vite)  
   - MySQL: host `localhost`, port `3307`, user `root`, password `123123`, database `ktpm_final`
   - Nếu backend không kết nối được DB, kiểm tra lại `DATABASE_URL` trong `docker-compose.yml` (nên để `mysql://root:123123@db:3306/ktpm_final`)

#### Triển khai lên VPS/Server
- Yêu cầu: máy chủ có Docker & Docker Compose, mở port public cho dịch vụ bạn muốn công khai (thường là 80/443 qua reverse proxy).
- Các bước gợi ý:
  1. SSH vào server và clone repo: `git clone <repo-url> && cd Heyboi`.
  2. Tạo file `.env` (nếu muốn giấu biến môi trường khỏi `docker-compose.yml`), ví dụ:
     ```bash
     # ./be/.env
     DATABASE_URL="mysql://root:your-db-pass@db:3306/ktpm_final"
     JWT_SECRET="your-strong-secret"
     
     # ./fe/.env
     VITE_BACKEND_URL="http://backend:8888"
     ```
     Sau đó trỏ `docker-compose.yml` đến file `.env` này hoặc cập nhật biến môi trường tương ứng.
  3. Chỉnh `docker-compose.yml` nếu cần:
     - Đổi port mapping frontend về 80 hoặc 3000 tùy ý, ví dụ:  
       ```yaml
       ports:
         - "80:5173"
       ```
     - Nếu dùng reverse proxy (Caddy/Traefik/Nginx) hãy cấu hình proxy đến `frontend:5173` và `backend:8888`.
  4. Chạy: `docker compose up -d --build`.
  5. Kiểm tra log: `docker compose logs -f backend frontend db`.
  6. Áp dụng HTTPS bằng reverse proxy (khuyến nghị dùng Traefik/Caddy để tự cấp TLS qua Let’s Encrypt).

### Phương án 2: Chạy thủ công (dev không dùng Docker)
1. Cài đặt Node.js 20+, npm và MySQL 8.0.
2. Tạo cơ sở dữ liệu trống `ktpm_final` (hoặc tên khác bạn muốn sử dụng).
3. Cấu hình biến môi trường:
   - Backend (`be/.env`):
     ```bash
     DATABASE_URL="mysql://root:123123@localhost:3307/ktpm_final"
     JWT_SECRET="your-secret-key"
     ```
   - Frontend (`fe/.env`):
     ```bash
     VITE_BACKEND_URL="http://localhost:8888"
     ```
4. Cài đặt & chạy Backend:
   ```bash
   cd be
   npm install
   npx prisma generate
   npx prisma migrate deploy   # áp dụng các migration hiện có
   npm run dev                 # server lắng nghe port 8888
   ```
5. Cài đặt & chạy Frontend:
   ```bash
   cd fe
   npm install
   npm run dev -- --host --port 3000   # hoặc bỏ --port để dùng mặc định 5173
   ```
6. Truy cập ứng dụng:
   - Backend: http://localhost:8888  
   - Frontend: http://localhost:3000 (hoặc port bạn đã cấu hình)
