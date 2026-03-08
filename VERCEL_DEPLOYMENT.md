# 📚 Book Store - Hướng Dẫn Deploy Lên Vercel

## ✅ Checklist Trước Khi Deploy

### Frontend
- [x] Có file `vercel.json` với cấu hình rewrites
- [x] Package.json có script `build`
- [x] BaseURL hỗ trợ environment variables
- [x] Có file `.env.example`
- [ ] Cấu hình Firebase (nếu sử dụng)

### Backend
- [x] Có file `vercel.json` với cấu hình cho Node.js
- [x] Package.json có scripts `start`
- [x] CORS được cấu hình cho production
- [x] Có file `.env.example`
- [x] MongoDB connection string sử dụng biến môi trường
- [ ] Environment variables được set trên Vercel

## 🚀 Các Bước Deploy

### Bước 1: Deploy Backend

1. **Push code lên GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy backend lên Vercel**
   - Truy cập [vercel.com](https://vercel.com)
   - Import project từ GitHub
   - Chọn thư mục `backend`
   - Thêm Environment Variables:
     ```
     DB_URL=your_mongodb_connection_string
     JWT_SECRET_KEY=your_jwt_secret_key
     FRONTEND_URL=https://your-frontend-url.vercel.app (sau khi deploy frontend)
     ```
   - Click Deploy

3. **Lấy Backend URL**
   - Sau khi deploy xong, copy URL backend (VD: `https://book-store-backend.vercel.app`)

### Bước 2: Deploy Frontend

1. **Tạo file `.env` trong frontend**
   ```env
   VITE_API_URL=https://your-backend-url.vercel.app
   ```

2. **Deploy frontend lên Vercel**
   - Truy cập [vercel.com](https://vercel.com)
   - Import project từ GitHub (lần 2)
   - Chọn thư mục `frontend`
   - Thêm Environment Variables:
     ```
     VITE_API_URL=https://your-backend-url.vercel.app
     ```
   - Click Deploy

3. **Lấy Frontend URL**
   - Sau khi deploy xong, copy URL frontend (VD: `https://book-store.vercel.app`)

### Bước 3: Cập Nhật Backend với Frontend URL

1. Quay lại Vercel dashboard của backend
2. Vào Settings → Environment Variables
3. Thêm hoặc cập nhật:
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
4. Redeploy backend

## 🔧 Lưu Ý Quan Trọng

### MongoDB Atlas
- Đảm bảo MongoDB Atlas cho phép kết nối từ tất cả IP (0.0.0.0/0) hoặc IP của Vercel
- Vào MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere

### Environment Variables
**Backend (.env):**
```env
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/book-store
JWT_SECRET_KEY=your_super_secret_key
FRONTEND_URL=https://your-frontend.vercel.app
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-backend.vercel.app
```

### CORS
- Backend đã được cấu hình để chấp nhận requests từ `.vercel.app` domains
- Nếu cần custom domain, thêm vào `allowedOrigins` trong `backend/index.js`

### Admin Account
- Chạy `node resetAdmin.js` trước khi deploy để tạo tài khoản admin
- Hoặc tạo admin sau khi deploy bằng cách:
  1. Kết nối MongoDB Atlas trực tiếp
  2. Hoặc tạo route tạm thời để create admin (nhớ xóa sau khi tạo xong)

## 📝 Kiểm Tra Sau Khi Deploy

1. **Test Backend:**
   - Truy cập: `https://your-backend.vercel.app/api/books`
   - Nên thấy danh sách sách (hoặc array rỗng nếu chưa có data)

2. **Test Frontend:**
   - Truy cập: `https://your-frontend.vercel.app`
   - Kiểm tra login admin
   - Thử thêm/sửa/xóa sách

3. **Test CORS:**
   - Mở Console trong browser
   - Kiểm tra không có lỗi CORS khi gọi API

## 🐛 Troubleshooting

### Lỗi CORS
- Kiểm tra `FRONTEND_URL` trong backend environment variables
- Đảm bảo redeploy backend sau khi thêm env vars

### Lỗi 500 - Database Connection
- Kiểm tra `DB_URL` đúng format
- Kiểm tra MongoDB Atlas Network Access cho phép Vercel IP
- Kiểm tra username/password trong connection string

### Lỗi 401/403 - Authentication
- Kiểm tra `JWT_SECRET_KEY` giống nhau giữa local và production
- Đảm bảo đã tạo admin account
- Clear localStorage và login lại

### Frontend không gọi được API
- Kiểm tra `VITE_API_URL` trong frontend env vars
- Mở Network tab trong DevTools xem request đi đâu
- Đảm bảo backend URL không có trailing slash

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## ✨ Cải Thiện Sau Deploy

1. **Custom Domain:** Thêm custom domain trong Vercel settings
2. **Analytics:** Bật Vercel Analytics để theo dõi traffic
3. **Performance:** Kiểm tra và tối ưu với Lighthouse
4. **Security:** 
   - Không commit file `.env`
   - Thay đổi JWT_SECRET_KEY định kỳ
   - Implement rate limiting

---

**Chúc bạn deploy thành công! 🎉**
