import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getImgUrl } from '../../utils/getImgUrl'
import { formatVND } from '../../utils/formatVND'
import { getCategoryLabel } from '../../utils/categories.jsx'
import { removeFromCart, clearCart, updateQuantity } from '../../redux/features/cart/cartSlide'
import { useDispatch } from 'react-redux'
import { FiMinus, FiPlus, FiShoppingBag, FiUser, FiMapPin, FiPhone, FiAward, FiPercent, FiCreditCard, FiDollarSign } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi'
import { useApplyCouponMutation } from '../../redux/features/coupons/couponsApi'
import booksApi from '../../redux/features/books/booksApi'
import { useTierNotification } from '../../context/TierNotificationContext'
import { useForm } from "react-hook-form"
import Swal from 'sweetalert2'
import axios from 'axios'
import getBaseUrl from '../../utils/baseURL'
import { useFetchRankByPointsQuery } from '../../redux/features/ranks/ranksApi'
import { getRankColor } from '../../utils/rankColors';


const CartPage = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const { currentUser, refreshUserData } = useAuth();
    const { showTierUpgrade } = useTierNotification();
    const navigate = useNavigate();
    
    const [selectedItems, setSelectedItems] = useState(
        cartItems.reduce((acc, item) => ({ ...acc, [item._id]: true }), {})
    );
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    
    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();
    
    // Fetch current user's rank from API
    const currentPoints = currentUser?.rewardPoints || 0;
    const { data: currentRankData } = useFetchRankByPointsQuery(currentPoints, {
        skip: !currentUser
    });
    const currentRankInfo = currentRankData?.data;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm({
        defaultValues: {
            email: currentUser?.email || '',
        }
    });

    // Auto-fill form with user data when showing checkout form
    useEffect(() => {
        if (showCheckoutForm && currentUser) {
            setValue('name', currentUser.username || currentUser.displayName || '');
            setValue('phone', currentUser.phone || '');
            setValue('address', currentUser.address || '');
            setValue('ward', currentUser.ward || '');
            setValue('district', currentUser.district || '');
            setValue('city', currentUser.city || '');
            setValue('state', currentUser.city || '');
            setValue('country', currentUser.country || 'Việt Nam');
        }
    }, [showCheckoutForm, currentUser, setValue]);

    const selectedCartItems = cartItems.filter(item => selectedItems[item._id]);
    const subtotal = selectedCartItems.reduce((acc, item) => acc + (item.newPrice * (item.quantity || 1)), 0);
    
    // Calculate tier discount using rank data from API
    const tierDiscount = currentRankInfo?.discountPercent || 0;
    const tierDiscountAmount = (subtotal * tierDiscount / 100);
    
    // Calculate coupon discount
    const couponDiscountAmount = appliedCoupon?.discount || 0;

    // Shipping fee
    const shippingFee = 30000;
    
    // Calculate total reward points
    const totalRewardPoints = selectedCartItems.reduce((acc, item) => {
        return acc + ((item.rewardPoints || 0) * (item.quantity || 1));
    }, 0);
    
    // Total after discounts + shipping
    const totalPrice = (subtotal - tierDiscountAmount - couponDiscountAmount + shippingFee).toFixed(2);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            Swal.fire({
                title: "Lỗi",
                text: "Vui lòng nhập mã giảm giá",
                icon: "error",
                confirmButtonColor: "#d33"
            });
            return;
        }

        try {
            const requestData = { 
                code: couponCode.toUpperCase(), 
                orderTotal: subtotal
            };
            
            // Add userId if user is logged in (MongoDB _id)
            if (currentUser?._id) {
                requestData.userId = currentUser._id;
            }
            
            console.log('Applying coupon with data:', requestData);
            
            const response = await applyCoupon(requestData).unwrap();
            
            if (response.success) {
                setAppliedCoupon({
                    code: response.coupon.code,
                    description: response.coupon.description,
                    discount: response.discount,
                    isRankCoupon: response.coupon.isRankCoupon || false
                });
                Swal.fire({
                    title: "Áp dụng thành công!",
                    text: response.message,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
            const errorMessage = error?.data?.message || "Mã giảm giá không hợp lệ";
            Swal.fire({
                title: "Không thể áp dụng",
                text: errorMessage,
                icon: "error",
                confirmButtonColor: "#d33"
            });
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
    };
    
    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product._id));
        const newSelected = { ...selectedItems };
        delete newSelected[product._id];
        setSelectedItems(newSelected);
    }

    const handleClearCart = () => {
        dispatch(clearCart());
        setSelectedItems({});
    }

    const handleUpdateQuantity = (product, newQuantity) => {
        if (newQuantity > 0 && newQuantity <= product.stock) {
            dispatch(updateQuantity({ id: product._id, quantity: newQuantity }));
        }
    }

    const handleToggleSelectItem = (itemId) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    }

    const handleSelectAll = () => {
        const allSelected = cartItems.every(item => selectedItems[item._id]);
        if (allSelected) {
            setSelectedItems({});
        } else {
            setSelectedItems(cartItems.reduce((acc, item) => ({ ...acc, [item._id]: true }), {}));
        }
    }

    const onSubmit = async (data) => {
        if (!currentUser) {
            Swal.fire({
                title: "Vui lòng đăng nhập",
                text: "Bạn cần đăng nhập để đặt hàng",
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Đăng nhập"
            });
            navigate('/login');
            return;
        }

        const newOrder = {
            name: data.name,
            email: currentUser?.email,
            address: {
                city: data.city,
                state: data.state,
                country: data.country,
                district: data.district,
                ward: data.ward,
                street: data.address,
            },
            phone: data.phone,
            productIds: selectedCartItems.map(item => item?._id),
            quantities: selectedCartItems.map(item => item?.quantity || 1),
            totalPrice: parseFloat(totalPrice),
            shippingFee: shippingFee,
            paymentMethod: paymentMethod,
            discounts: {
                tierDiscount: tierDiscountAmount,
                couponDiscount: couponDiscountAmount,
                couponCode: appliedCoupon?.code || null
            }
        }
        
        try {
            const orderResponse = await createOrder(newOrder).unwrap();
            
            // Backend đã tự động tính và cộng rewardPoints
            const rewardPointsEarned = orderResponse.rewardPointsEarned || 0;
            
            // Invalidate Books cache để cập nhật stock hiển thị
            dispatch(booksApi.util.invalidateTags(['Books']));
            
            // Refresh user data để cập nhật points và tier mới
            if (refreshUserData) {
                await refreshUserData();
            }
            
            // Remove selected items from cart
            selectedCartItems.forEach(item => {
                dispatch(removeFromCart(item._id));
            });
            
            const paymentMethodText = paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng';
            const totalSavings = tierDiscountAmount + couponDiscountAmount;
            
            Swal.fire({
                title: "Đơn hàng đã được xác nhận!",
                html: `
                    <p>Đơn hàng của bạn đã được đặt thành công!</p>
                    <p class="mt-2"><strong>Phương thức:</strong> ${paymentMethodText}</p>
                    ${totalSavings > 0 ? `<p class="text-green-600">💰 Tiết kiệm: ${formatVND(totalSavings)}</p>` : ''}
                    ${rewardPointsEarned > 0 ? `<p class="mt-2 text-green-600 font-bold">🎁 +${rewardPointsEarned} điểm thưởng</p>` : ''}
                    ${orderResponse.message || ''}
                    ${paymentMethod === 'bank_transfer' ? '<p class="mt-2 text-sm text-gray-600">Vui lòng chuyển khoản theo thông tin đã cung cấp</p>' : ''}
                `,
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Xem đơn hàng"
            });
            
            navigate('/user/dashboard/orders');
        } catch (error) {
            console.error('Error creating order:', error);
            const errData = error?.data;
            const title = errData?.message || 'Lỗi đặt hàng';
            const details = errData?.errors?.length
                ? errData.errors.map(e => `• ${e}`).join('<br/>')
                : 'Vui lòng thử lại.';
            Swal.fire({
                title,
                html: details,
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "Đóng"
            });
        }
    }

    const allSelected = cartItems.length > 0 && cartItems.every(item => selectedItems[item._id]);
  return (
    <>
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>
          
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FiShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Giỏ hàng trống</h2>
              <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="font-semibold text-gray-700">Chọn tất cả ({cartItems.length} sản phẩm)</span>
                    </div>
                    <button
                      onClick={handleClearCart}
                      className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Xóa giỏ hàng
                    </button>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {cartItems.map((product) => (
                      <div key={product._id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex gap-4">
                          <input
                            type="checkbox"
                            checked={selectedItems[product._id] || false}
                            onChange={() => handleToggleSelectItem(product._id)}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mt-2"
                          />
                          
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                            <img
                              src={`${getImgUrl(product?.coverImage)}`}
                              alt={product?.title}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <div className="flex-1 pr-4">
                                <Link to={`/books/${product._id}`}>
                                  <h3 className="text-base font-semibold text-gray-900 hover:text-purple-600 transition-colors line-clamp-2">
                                    {product?.title}
                                  </h3>
                                </Link>
                                <p className="mt-1 text-sm text-gray-500 capitalize">
                                  <strong>Thể loại:</strong> {getCategoryLabel(product?.category)}
                                </p>
                                <p className="mt-1 text-sm text-gray-600 font-semibold">
                                  {formatVND(product?.newPrice)} / cuốn
                                </p>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-lg font-bold text-purple-600">
                                  {formatVND(product?.newPrice * (product?.quantity || 1))}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Số lượng:</span>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => handleUpdateQuantity(product, (product.quantity || 1) - 1)}
                                    className="bg-gray-100 hover:bg-gray-200 p-2 transition-colors disabled:opacity-50"
                                    disabled={(product.quantity || 1) <= 1}
                                  >
                                    <FiMinus className="w-4 h-4 text-gray-600" />
                                  </button>
                                  <input
                                    type="number"
                                    value={product.quantity || 1}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 1;
                                      handleUpdateQuantity(product, val);
                                    }}
                                    className="w-14 text-center font-medium text-gray-900 border-none focus:outline-none"
                                    min="1"
                                    max={product.stock}
                                  />
                                  <button
                                    onClick={() => handleUpdateQuantity(product, (product.quantity || 1) + 1)}
                                    className="bg-gray-100 hover:bg-gray-200 p-2 transition-colors disabled:opacity-50"
                                    disabled={(product.quantity || 1) >= product.stock}
                                  >
                                    <FiPlus className="w-4 h-4 text-gray-600" />
                                  </button>
                                </div>
                                <span className="text-xs text-gray-400">({product.stock} có sẵn)</span>
                              </div>

                              <button
                                onClick={() => handleRemoveFromCart(product)}
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </div>

              {/* Order Summary & Checkout */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
                  
                  {/* Membership Tier Display */}
                  {currentUser && currentRankInfo && (
                    <div className={`mb-4 p-3 ${getRankColor(currentRankInfo.name).bg} ${getRankColor(currentRankInfo.name).text} rounded-xl shadow-md`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{currentRankInfo.icon}</span>
                          <div>
                            <p className="text-xs opacity-90">Hạng thành viên</p>
                            <p className="font-bold">{currentRankInfo.displayName}</p>
                          </div>
                        </div>
                        {tierDiscount > 0 && (
                          <div className="text-right">
                            <p className="text-xs opacity-90">Giảm giá</p>
                            <p className="font-bold">{tierDiscount}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sản phẩm đã chọn</span>
                      <span className="font-semibold">{selectedCartItems.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tạm tính</span>
                      <span className="font-semibold">{formatVND(subtotal)}</span>
                    </div>
                    
                    {/* Tier Discount */}
                    {tierDiscountAmount > 0 && currentRankInfo && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Giảm giá hạng {currentRankInfo.displayName} (-{tierDiscount}%)</span>
                        <span className="font-semibold">-{formatVND(tierDiscountAmount)}</span>
                      </div>
                    )}
                    
                    {/* Coupon Discount */}
                    {appliedCoupon && couponDiscountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Mã giảm giá ({appliedCoupon.code})</span>
                        <span className="font-semibold">-{formatVND(couponDiscountAmount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="font-semibold">{formatVND(shippingFee)}</span>
                    </div>
                    
                    {/* Reward Points Display */}
                    {totalRewardPoints > 0 && (
                      <div className="flex justify-between text-sm bg-gradient-to-r from-yellow-50 to-orange-50 -mx-6 px-6 py-3 border-l-4 border-amber-500">
                        <span className="text-amber-700 font-medium flex items-center gap-1">
                          <FiAward className="w-4 h-4" />
                          Tổng điểm thưởng nhận được
                        </span>
                        <span className="text-amber-700 font-bold text-base">+{totalRewardPoints} điểm</span>
                      </div>
                    )}
                  </div>

                  {/* Coupon Code Input */}
                  {!showCheckoutForm && selectedCartItems.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiPercent className="inline w-4 h-4 mr-1" />
                        Mã giảm giá
                      </label>
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div>
                            <p className="font-semibold text-green-800">{appliedCoupon.code}</p>
                            <p className="text-xs text-green-600">{appliedCoupon.description}</p>
                          </div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Xóa
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Nhập mã giảm giá"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={!couponCode || isApplyingCoupon}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            {isApplyingCoupon ? 'Đang kiểm tra...' : 'Áp dụng'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                    <span>Tổng cộng</span>
                    <span className="text-purple-600">{formatVND(totalPrice)}</span>
                  </div>

                  {selectedCartItems.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-4">Vui lòng chọn sản phẩm để thanh toán</p>
                      <button
                        disabled
                        className="w-full py-3 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
                      >
                        Thanh toán
                      </button>
                    </div>
                  ) : !showCheckoutForm ? (
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          Swal.fire({
                            title: "Vui lòng đăng nhập",
                            text: "Bạn cần đăng nhập để đặt hàng",
                            icon: "warning",
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "Đăng nhập"
                          });
                          navigate('/login');
                        } else {
                          setShowCheckoutForm(true);
                        }
                      }}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Tiến hành thanh toán
                    </button>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <FiUser className="w-5 h-5" />
                          Thông tin giao hàng
                        </h3>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register("name", { required: "Vui lòng nhập tên" })}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Nguyễn Văn A"
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register("email")}
                              type="email"
                              disabled
                              defaultValue={currentUser?.email}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Số điện thoại <span className="text-red-500">*</span>
                            </label>
                          <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500">
                              <FiPhone className="w-4 h-4 ml-3 text-gray-400" />
                              <input
                                {...register("phone", {
                                  required: "Vui lòng nhập số điện thoại",
                                  pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Số điện thoại phải đúng 10 chữ số"
                                  }
                                })}
                                type="tel"
                                maxLength={10}
                                className="w-full px-3 py-2 border-none focus:outline-none rounded-lg"
                                placeholder="0123456789"
                              />
                            </div>
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Địa chỉ (số nhà, tên đường) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-start border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500">
                              <FiMapPin className="w-4 h-4 ml-3 mt-3 text-gray-400" />
                              <input
                                {...register("address", { required: "Vui lòng nhập địa chỉ" })}
                                type="text"
                                className="w-full px-3 py-2 border-none focus:outline-none rounded-lg"
                                placeholder="Số nhà, tên đường"
                              />
                            </div>
                            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phường / Xã <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register("ward", { required: "Vui lòng nhập phường/xã" })}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Phường / Xã"
                            />
                            {errors.ward && <p className="text-xs text-red-500 mt-1">{errors.ward.message}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quận / Huyện <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register("district", { required: "Vui lòng nhập quận/huyện" })}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Quận / Huyện"
                            />
                            {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district.message}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Thành phố / Tỉnh <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register("city", { required: "Vui lòng nhập thành phố" })}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Hồ Chí Minh"
                            />
                            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                          </div>

                          <div className="hidden">
                            <input
                              {...register("state")}
                              type="hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quốc gia <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register("country", { required: true })}
                              type="text"
                              defaultValue="Việt Nam"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>

                          {/* Payment Method */}
                          <div className="pt-2 pb-2 border-t border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              <FiCreditCard className="inline w-4 h-4 mr-1" />
                              Phương thức thanh toán <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                                <input
                                  type="radio"
                                  value="cod"
                                  checked={paymentMethod === 'cod'}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                  className="w-4 h-4 text-purple-600"
                                />
                                <FiDollarSign className="w-5 h-5 ml-3 text-gray-600" />
                                <div className="ml-3">
                                  <p className="font-semibold text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                                  <p className="text-xs text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                                </div>
                              </label>
                              
                              <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                                <input
                                  type="radio"
                                  value="bank_transfer"
                                  checked={paymentMethod === 'bank_transfer'}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                  className="w-4 h-4 text-purple-600"
                                />
                                <FiCreditCard className="w-5 h-5 ml-3 text-gray-600" />
                                <div className="ml-3">
                                  <p className="font-semibold text-gray-900">Chuyển khoản ngân hàng</p>
                                  <p className="text-xs text-gray-500">Chuyển khoản qua ngân hàng hoặc ví điện tử</p>
                                </div>
                              </label>
                              
                              <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors opacity-50">
                                <input
                                  type="radio"
                                  value="card"
                                  disabled
                                  className="w-4 h-4 text-purple-600"
                                />
                                <FiCreditCard className="w-5 h-5 ml-3 text-gray-600" />
                                <div className="ml-3">
                                  <p className="font-semibold text-gray-900">Thẻ tín dụng/ghi nợ</p>
                                  <p className="text-xs text-gray-500">Đang phát triển</p>
                                </div>
                              </label>
                            </div>
                            
                            {/* Bank Transfer Info */}
                            {paymentMethod === 'bank_transfer' && (
                              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm font-semibold text-gray-900 mb-2">Thông tin chuyển khoản:</p>
                                <div className="space-y-1 text-sm text-gray-700">
                                  <p><strong>Ngân hàng:</strong> Vietcombank</p>
                                  <p><strong>Số tài khoản:</strong> 1234567890</p>
                                  <p><strong>Chủ tài khoản:</strong> TIỆM SÁCH HƯ VÔ</p>
                                  <p><strong>Số tiền:</strong> <span className="font-bold text-purple-600">{formatVND(totalPrice)}</span></p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    💡 Vui lòng chuyển khoản đúng số tiền và ghi rõ <strong>Họ tên + Số điện thoại</strong> trong nội dung chuyển khoản
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-2">
                            <label className="flex items-start gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}
                                className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <span className="text-xs text-gray-600">
                                Tôi đồng ý với{' '}
                                <Link to="/contact" className="text-purple-600 hover:underline">
                                  Điều khoản dịch vụ
                                </Link>
                                {' '}và{' '}
                                <Link to="/contact" className="text-purple-600 hover:underline">
                                  Chính sách bảo mật
                                </Link>
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowCheckoutForm(false)}
                          className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                        >
                          Quay lại
                        </button>
                        <button
                          type="submit"
                          disabled={!isChecked || isLoading}
                          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Đang xử lý...' : 'Đặt hàng'}
                        </button>
                      </div>
                    </form>
                  )}

                  {currentUser && !showCheckoutForm && selectedCartItems.length > 0 && (
                    <p className="text-xs text-center text-gray-500 mt-4">
                      
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CartPage
