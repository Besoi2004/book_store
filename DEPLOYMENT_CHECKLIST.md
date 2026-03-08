# ✅ Vercel Deployment Checklist

## 📋 Trước Khi Deploy

### Cấu Hình Dự Án
- [x] File `.gitignore` đã được cấu hình đúng
- [x] Thư mục `node_modules` không được commit
- [x] File `.env` không được commit
- [x] Có file `.env.example` cho cả frontend và backend

### Frontend ✅
- [x] `vercel.json` có cấu hình rewrites
- [x] `package.json` có script `build`
- [x] `baseURL.js` hỗ trợ environment variables
- [x] Sử dụng `import.meta.env.VITE_API_URL` cho API URL
- [x] Không có hardcoded localhost URLs

### Backend ✅
- [x] `vercel.json` cấu hình cho Node.js
- [x] `package.json` có script `start`
- [x] CORS cấu hình cho production (chấp nhận `.vercel.app` domains)
- [x] MongoDB connection string sử dụng biến môi trường
- [x] JWT secret sử dụng biến môi trường
- [x] Không có sensitive data trong code

### Database 🔧
- [ ] MongoDB Atlas đã được setup
- [ ] Network Access cho phép kết nối từ mọi nơi (0.0.0.0/0)
- [ ] Database user đã được tạo
- [ ] Connection string đã được test

### Authentication 🔐
- [x] Admin account đã được tạo (chạy `node resetAdmin.js`)
- [x] JWT secret đã được generate
- [x] Password hashing với bcrypt
- [x] Token expiration được set (1 hour)

## 🚀 Các Bước Deploy

### 1. Chuẩn Bị Code
```bash
# Kiểm tra không có lỗi
npm run build (trong frontend)
npm start (trong backend để test)

# Commit code
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Deploy Backend Trước
- [ ] Import project từ GitHub vào Vercel
- [ ] Chọn thư mục `backend` (Root Directory)
- [ ] Thêm Environment Variables:
  - [ ] `DB_URL` = MongoDB connection string
  - [ ] `JWT_SECRET_KEY` = JWT secret key
  - [ ] `FRONTEND_URL` = (thêm sau khi deploy frontend)
- [ ] Deploy & lấy backend URL

**Backend URL:** `________________________________`

### 3. Deploy Frontend
- [ ] Import project từ GitHub vào Vercel (lần 2, project mới)
- [ ] Chọn thư mục `frontend` (Root Directory)
- [ ] Thêm Environment Variables:
  - [ ] `VITE_API_URL` = Backend URL từ bước 2
- [ ] Deploy & lấy frontend URL

**Frontend URL:** `________________________________`

### 4. Cập Nhật Backend
- [ ] Quay lại Vercel dashboard của backend
- [ ] Settings → Environment Variables
- [ ] Thêm/Cập nhật `FRONTEND_URL` = Frontend URL từ bước 3
- [ ] Deployments → Redeploy latest deployment

## 🧪 Testing Sau Deploy

### Backend Testing
- [ ] Truy cập `https://your-backend.vercel.app/`
  - Kỳ vọng: Thấy "Hello" message
- [ ] Truy cập `https://your-backend.vercel.app/api/books`
  - Kỳ vọng: JSON array (có thể rỗng)
- [ ] Test với Postman/Thunder Client:
  ```
  POST /api/auth/admin
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
  - Kỳ vọng: Nhận token

### Frontend Testing
- [ ] Truy cập `https://your-frontend.vercel.app/`
  - Kỳ vọng: Trang home hiển thị đúng
- [ ] Kiểm tra Network tab (F12):
  - [ ] Không có CORS errors
  - [ ] API calls đi đến đúng backend URL
- [ ] Test Admin Login:
  - [ ] Truy cập `/admin`
  - [ ] Login với admin/admin123
  - [ ] Redirect đến dashboard
- [ ] Test CRUD Books:
  - [ ] Thêm sách mới
  - [ ] Sửa sách
  - [ ] Xóa sách
  - [ ] Xem danh sách sách ở trang home

### Integration Testing
- [ ] User có thể xem sách
- [ ] User có thể thêm sách vào cart
- [ ] User có thể đặt hàng
- [ ] Admin có thể quản lý sách
- [ ] Dashboard hiển thị thống kê

## 🐛 Common Issues & Solutions

### ❌ CORS Error
**Triệu chứng:** Console shows CORS policy error
**Giải pháp:**
- Kiểm tra `FRONTEND_URL` trong backend env vars
- Đảm bảo không có trailing slash
- Redeploy backend sau khi cập nhật env vars

### ❌ 500 Internal Server Error
**Triệu chứng:** API returns 500 error
**Giải pháp:**
- Kiểm tra Vercel Function Logs
- Kiểm tra `DB_URL` đúng format
- Kiểm tra MongoDB Atlas Network Access

### ❌ 401 Unauthorized
**Triệu chứng:** Login fails hoặc CRUD operations bị reject
**Giải pháp:**
- Đảm bảo admin account đã được tạo trong production database
- Kiểm tra `JWT_SECRET_KEY` có value
- Clear localStorage và login lại

### ❌ API calls đi đến localhost
**Triệu chứng:** Network tab shows calls to localhost:5000
**Giải pháp:**
- Kiểm tra `VITE_API_URL` trong frontend env vars
- Rebuild và redeploy frontend
- Hard refresh browser (Ctrl+Shift+R)

### ❌ Vercel Function Timeout
**Triệu chứng:** Requests timeout after 10s
**Giải pháp:**
- Tối ưu database queries
- Thêm indexes trong MongoDB
- Consider upgrading Vercel plan (Hobby has 10s limit)

## 📊 Performance Checklist

- [ ] Frontend build size < 500KB (gzipped)
- [ ] API response time < 1s
- [ ] Images are optimized
- [ ] No console.log in production code
- [ ] Lighthouse score > 85

## 🔐 Security Checklist

- [ ] `.env` files không được commit
- [ ] JWT secret đủ mạnh (64+ characters)
- [ ] Password được hash với bcrypt
- [ ] Admin endpoints có middleware protection
- [ ] Database credentials không exposed
- [ ] CORS chỉ cho phép trusted origins

## 📝 Post-Deployment

- [ ] Thêm custom domain (optional)
- [ ] Setup monitoring/alerts
- [ ] Enable Vercel Analytics
- [ ] Backup database
- [ ] Document API endpoints
- [ ] Write user guide

## 🎉 Deployment Success!

Nếu tất cả checklist trên đã hoàn thành:

✅ Backend deployed: `________________________________`
✅ Frontend deployed: `________________________________`
✅ Database connected: MongoDB Atlas
✅ Admin account: admin / admin123
✅ All features working

**Chúc mừng bạn đã deploy thành công!** 🚀

---

*Lưu file này và cập nhật URLs sau khi deploy*
