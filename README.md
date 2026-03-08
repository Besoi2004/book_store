# 📚 Book Store - Full Stack MERN Application

Ứng dụng quản lý cửa hàng sách được xây dựng với MERN stack (MongoDB, Express, React, Node.js) và có thể deploy lên Vercel.

## 🚀 Công Nghệ Sử Dụng

### Frontend
- **React 19** - UI Library
- **Redux Toolkit** - State Management
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build Tool
- **Axios** - HTTP Client
- **React Hook Form** - Form Handling
- **SweetAlert2** - Beautiful Alerts
- **Chart.js** - Data Visualization
- **Swiper** - Carousel/Slider
- **Firebase** - Authentication (optional)

### Backend
- **Node.js & Express** - Server Framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment Variables

## 📁 Cấu Trúc Dự Án

```
book_store_project/
├── frontend/              # React Frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux store & slices
│   │   ├── routers/      # Route configuration
│   │   ├── utils/        # Utility functions
│   │   └── firebase/     # Firebase config
│   ├── public/
│   ├── vercel.json
│   └── package.json
│
├── backend/              # Express Backend
│   ├── src/
│   │   ├── books/       # Book module (routes, controllers, models)
│   │   ├── orders/      # Order module
│   │   ├── users/       # User module
│   │   ├── stats/       # Statistics module
│   │   └── middleware/  # Custom middleware
│   ├── index.js
│   ├── vercel.json
│   └── package.json
│
├── VERCEL_DEPLOYMENT.md  # Deployment guide
└── README.md
```

## 🛠️ Cài Đặt & Chạy Local

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd book_store_project
```

### 2. Cài Đặt Backend
```bash
cd backend
npm install

# Tạo file .env
cp .env.example .env
# Cập nhật .env với thông tin MongoDB và JWT secret

# Tạo admin account
node resetAdmin.js

# Chạy server
npm run start:dev
```

Backend sẽ chạy trên `http://localhost:5000`

### 3. Cài Đặt Frontend
```bash
cd frontend
npm install

# Tạo file .env (nếu cần)
# echo "VITE_API_URL=http://localhost:5000" > .env

# Chạy development server
npm run dev
```

Frontend sẽ chạy trên `http://localhost:5173`

## 🔐 Admin Credentials

Sau khi chạy `node resetAdmin.js`:
- **Username:** admin
- **Password:** admin123
- **Email:** admin@bookstore.com

## ✨ Tính Năng

### Cho Người Dùng
- ✅ Xem danh sách sách với phân loại
- ✅ Tìm kiếm và lọc sách
- ✅ Xem chi tiết sách
- ✅ Thêm sách vào giỏ hàng
- ✅ Đặt hàng và thanh toán
- ✅ Xem lịch sử đơn hàng
- ✅ Đăng ký/Đăng nhập tài khoản

### Cho Admin
- ✅ Quản lý sách (CRUD)
- ✅ Xem danh sách đơn hàng
- ✅ Thống kê doanh thu
- ✅ Dashboard với biểu đồ

## 🌐 Deploy Lên Vercel

Xem hướng dẫn chi tiết tại: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

### Tóm Tắt Nhanh:
1. Deploy Backend → Lấy backend URL
2. Deploy Frontend với env var `VITE_API_URL`
3. Cập nhật Backend với env var `FRONTEND_URL`
4. Cấu hình MongoDB Atlas cho phép Vercel IP

## 📝 API Endpoints

### Books
- `GET /api/books` - Lấy tất cả sách
- `GET /api/books/:id` - Lấy sách theo ID
- `POST /api/books/create-book` - Tạo sách mới (Admin)
- `PUT /api/books/edit/:id` - Cập nhật sách (Admin)
- `DELETE /api/books/:id` - Xóa sách (Admin)

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/email/:email` - Lấy đơn hàng theo email

### Authentication
- `POST /api/auth/admin` - Login admin
- `POST /api/auth/create-admin` - Tạo admin (development only)

### Admin Stats
- `GET /api/admin` - Lấy thống kê admin

## 🔒 Bảo Mật

- ✅ Passwords được hash với bcrypt
- ✅ JWT authentication cho admin routes
- ✅ CORS được cấu hình đúng
- ✅ Environment variables cho sensitive data
- ✅ Validate input với React Hook Form

## 🐛 Troubleshooting

### MongoDB Connection Error
- Kiểm tra connection string trong `.env`
- Đảm bảo MongoDB Atlas cho phép IP của bạn

### CORS Error
- Kiểm tra `FRONTEND_URL` trong backend `.env`
- Đảm bảo frontend URL đúng trong CORS config

### 403 Forbidden
- Kiểm tra token trong localStorage
- Login lại nếu token hết hạn (1 hour)

## 📦 Scripts

### Backend
```bash
npm start          # Start production server
npm run start:dev  # Start development server with nodemon
node createAdmin.js   # Create admin account
node resetAdmin.js    # Reset admin account
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Student ID:** 22010078

## 🙏 Acknowledgments

- React team for the amazing library
- MongoDB for the database
- Vercel for easy deployment
- Tailwind CSS for beautiful styling

---

⭐ **Nếu bạn thấy project hữu ích, hãy cho một star nhé!** ⭐
