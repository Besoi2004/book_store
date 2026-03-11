# Hệ thống đồng bộ dữ liệu người dùng

## Tổng quan

Hệ thống tự động đồng bộ dữ liệu người dùng giữa Firebase Authentication và MongoDB Database, đảm bảo dữ liệu luôn được cập nhật trên toàn bộ ứng dụng.

## Cách hoạt động

### 1. AuthContext - Quản lý trung tâm

**File**: `frontend/src/context/AuthContext.jsx`

**Chức năng chính**:
- Quản lý state `currentUser` chứa dữ liệu đầy đủ từ cả Firebase và MongoDB
- Tự động fetch dữ liệu từ MongoDB khi user đăng nhập
- Merge dữ liệu Firebase Auth với MongoDB User data
- Auto-refresh mỗi 5 phút để đồng bộ dữ liệu

**Dữ liệu trong currentUser**:
```javascript
{
  // Firebase Auth fields
  uid: "firebase_uid",
  email: "user@example.com",
  displayName: "User Name",
  photoURL: "https://...",
  
  // MongoDB User fields (tự động sync)
  username: "username",
  rewardPoints: 1500,
  tier: "gold",
  phone: "0123456789",
  address: "123 Street",
  city: "Ho Chi Minh",
  country: "Việt Nam",
  avatar: "base64_or_url"
}
```

### 2. refreshUserData() Function

**Chức năng**: Fetch dữ liệu mới nhất từ database và cập nhật `currentUser`

**Cách sử dụng**:
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { currentUser, refreshUserData } = useAuth();
  
  // Refresh khi cần
  const handleAction = async () => {
    // ... thực hiện action thay đổi dữ liệu
    await refreshUserData(); // Sync lại dữ liệu
  }
}
```

**Khi nào cần gọi refreshUserData()**:
- ✅ Sau khi cập nhật profile
- ✅ Sau khi hoàn thành đơn hàng (điểm thưởng thay đổi)
- ✅ Sau khi có thay đổi tier
- ✅ Khi cần đảm bảo dữ liệu mới nhất
- ❌ KHÔNG cần gọi thủ công trong useEffect (đã có auto-refresh)

### 3. Custom Hook - useUserSync

**File**: `frontend/src/hooks/useUserSync.js`

**Cách sử dụng**:
```javascript
import useUserSync from '../hooks/useUserSync';

function MyComponent() {
  // Auto sync once on mount
  const { currentUser, refreshUserData } = useUserSync();
  
  // Auto sync with custom interval (30 seconds)
  const { currentUser } = useUserSync(true, 30000);
  
  // No auto sync
  const { currentUser, refreshUserData } = useUserSync(false);
}
```

## Cấu trúc Sync trong các Component

### UserProfile.jsx
```javascript
// ✅ ĐÚNG - Sử dụng currentUser trực tiếp
const { currentUser, refreshUserData } = useAuth();

// Sync profile data từ currentUser
useEffect(() => {
  if (currentUser) {
    setProfileData({
      username: currentUser.username,
      email: currentUser.email,
      // ... other fields
    });
  }
}, [currentUser]);

// Sau khi save, refresh toàn bộ app
const handleSave = async () => {
  await axios.put('/api/users/...', data);
  await refreshUserData(); // ✅ Sync lại
};
```

### CartPage.jsx
```javascript
// ✅ ĐÚNG - Dùng currentUser.tier trực tiếp
const currentTier = currentUser?.tier || 'bronze';
const tierDiscount = tiers[currentTier].discount;

// Sau khi hoàn thành order
const response = await createOrder(newOrder).unwrap();
await refreshUserData(); // ✅ Sync điểm thưởng mới
```

### Navbar.jsx
```javascript
// ✅ ĐÚNG - Hiển thị dữ liệu trực tiếp
{currentUser?.tier && (
  <div>{currentUser.tier === 'gold' ? '👑 Vàng' : ...}</div>
)}

{currentUser?.rewardPoints && (
  <div>{currentUser.rewardPoints} điểm</div>
)}
```

## Flow Đồng bộ dữ liệu

```
1. User đăng nhập
   ↓
2. Firebase Authentication
   ↓
3. onAuthStateChanged trigger
   ↓
4. Fetch dữ liệu từ MongoDB (/api/users/:email)
   ↓
5. Merge Firebase + MongoDB data
   ↓
6. Set currentUser trong AuthContext
   ↓
7. Tất cả components nhận currentUser mới
   ↓
8. Auto-refresh mỗi 5 phút (nếu đang đăng nhập)
```

## Khi có thay đổi dữ liệu

```
User thực hiện action (mua hàng, cập nhật profile, etc.)
   ↓
API call cập nhật MongoDB
   ↓
Gọi refreshUserData()
   ↓
Fetch dữ liệu mới từ MongoDB
   ↓
Update currentUser trong AuthContext
   ↓
Tất cả components tự động re-render với dữ liệu mới
```

## API Endpoints sử dụng

### Sync user data
- `GET /api/users/:email` - Lấy dữ liệu user đầy đủ
- `PUT /api/users/:email` - Cập nhật thông tin user

### Create user (nếu chưa tồn tại)
- `PUT /api/auth/:email` - Tạo user mới trong MongoDB

## Best Practices

### ✅ NÊN
- Sử dụng `currentUser` từ AuthContext trực tiếp
- Gọi `refreshUserData()` sau khi có thay đổi dữ liệu quan trọng
- Dùng `useUserSync()` hook cho components cần sync thường xuyên
- Kiểm tra `currentUser?.field` để tránh undefined

### ❌ KHÔNG NÊN
- Fetch riêng dữ liệu user trong component
- Lưu state riêng cho user data (dễ out-of-sync)
- Gọi `refreshUserData()` quá nhiều lần không cần thiết
- Dùng `localStorage` để lưu user data (dễ lỗi thời)

## Troubleshooting

### Dữ liệu không cập nhật?
1. Kiểm tra API endpoint có trả về dữ liệu đúng không
2. Console.log `currentUser` để xem dữ liệu hiện tại
3. Đảm bảo đã gọi `refreshUserData()` sau khi cập nhật

### Component không re-render khi currentUser thay đổi?
1. Đảm bảo component đang sử dụng `useAuth()` hook
2. Kiểm tra dependencies trong useEffect
3. Verify component không có memoization blocking update

### Tier/Points không hiển thị đúng?
1. Check backend API có trả về `tier` và `rewardPoints` không
2. Verify field names match giữa frontend và backend
3. Gọi `refreshUserData()` để force sync

## Timeline Auto-refresh

- **Immediately**: Khi đăng nhập
- **Every 5 minutes**: Auto-refresh trong background
- **On demand**: Khi gọi `refreshUserData()` manually

## Security Notes

- User data được fetch từ backend API (đã authenticate)
- Không lưu sensitive data trong localStorage
- Token authentication được handle bởi Firebase
- API endpoints được protect bởi middleware

---

**Cập nhật cuối**: 2026-03-10
**Version**: 1.0.0
