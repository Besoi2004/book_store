# 📚 Tiệm Sách Hư Vô

Ứng dụng bán sách trực tuyến full-stack xây dựng bằng **MERN Stack** (MongoDB, Express, React, Node.js).

---

## ✨ Tính năng

### 👤 Người dùng
- Đăng ký / đăng nhập bằng Email hoặc Google (Firebase Auth)
- Duyệt & tìm kiếm sách theo danh mục
- Giỏ hàng, đặt hàng, theo dõi trạng thái đơn hàng
- Áp dụng mã giảm giá (coupon)
- Hệ thống điểm thưởng (reward points)
- Hệ thống hạng thành viên (Đồng / Bạc / Vàng / Kim cương)
- Gửi yêu cầu liên hệ theo chủ đề
- Nhận thông báo khi đơn hàng cập nhật / yêu cầu được phản hồi

### 🛠️ Admin
- Dashboard thống kê tổng quan
- Quản lý sách (thêm, sửa, xóa)
- Quản lý đơn hàng & cập nhật trạng thái
- Quản lý người dùng
- Quản lý mã giảm giá
- Quản lý yêu cầu liên hệ (lọc theo chủ đề, trạng thái)
- Quản lý hạng thành viên

---

## 🏗️ Tech Stack

| Phần | Công nghệ |
|------|-----------|
| Frontend | React 19, Vite, Tailwind CSS |
| State Management | Redux Toolkit, RTK Query |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Auth | Firebase Authentication |
| Deployment | Vercel (cả frontend & backend) |

---

## 📁 Cấu trúc thư mục

```
book_store_project/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/     # Shared components
│   │   ├── context/        # React context (Auth, Notifications)
│   │   ├── firebase/       # Firebase config
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Pages (home, books, dashboard, user)
│   │   ├── redux/          # Redux store & RTK Query APIs
│   │   └── utils/          # Helper functions
│   └── public/
│       └── book.json       # Static book data
│
└── backend/                # Node.js + Express API
    ├── src/
    │   ├── books/          # Sách (CRUD)
    │   ├── contacts/       # Liên hệ
    │   ├── coupons/        # Mã giảm giá
    │   ├── middleware/     # Auth middleware
    │   ├── notifications/  # Thông báo
    │   ├── orders/         # Đơn hàng
    │   ├── ranks/          # Hạng thành viên
    │   ├── stats/          # Thống kê admin
    │   └── users/          # Người dùng
    └── index.js            # Entry point
```

---

## 🚀 Cài đặt & Chạy local

### Yêu cầu
- Node.js >= 18
- MongoDB (local hoặc Atlas)
- Firebase project

### 1. Clone repo

```bash
git clone <repo-url>
cd book_store_project
```

### 2. Cài đặt backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend/`:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/bookstore
JWT_SECRET_KEY=your_jwt_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Khởi động backend:

```bash
npm run start:dev   # development (nodemon)
npm start           # production
```

### 3. Cài đặt frontend

```bash
cd frontend
npm install
```

Tạo file `.env` trong thư mục `frontend/`:

```env
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.appspot.com
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id
VITE_BASE_URL=http://localhost:5000
```

Khởi động frontend:

```bash
npm run dev
```

### 4. Khởi tạo dữ liệu ranks (lần đầu)

```bash
cd backend
npm run init-ranks
```

### 5. Tạo tài khoản admin (lần đầu)

```bash
cd backend
node createAdmin.js
```

---

## 🌐 API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/books` | Lấy danh sách sách | ❌ |
| POST | `/api/orders` | Tạo đơn hàng | ✅ |
| GET | `/api/orders/email/:email` | Đơn hàng theo email | ✅ |
| POST | `/api/contacts` | Gửi yêu cầu liên hệ | ❌ |
| GET | `/api/contacts` | Lấy tất cả liên hệ | Admin |
| GET | `/api/notifications/:email` | Thông báo người dùng | ✅ |
| GET | `/api/ranks` | Danh sách hạng | ❌ |
| POST | `/api/auth/admin` | Đăng nhập admin | ❌ |

---

## 📦 Deploy lên Vercel

Xem hướng dẫn chi tiết tại [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md).

---

## 🔑 Đăng nhập Admin

Xem hướng dẫn tại [`ADMIN_LOGIN_GUIDE.md`](./ADMIN_LOGIN_GUIDE.md).
