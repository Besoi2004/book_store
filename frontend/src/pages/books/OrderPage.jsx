import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { useGetOrdersByEmailQuery, useCancelOrderMutation } from '../../redux/features/orders/ordersApi';
import booksApi from '../../redux/features/books/booksApi';
import { formatVND } from '../../utils/formatVND';
import { FiPackage, FiMapPin, FiPhone, FiMail, FiBox, FiUser, FiClock, FiCheckCircle, FiTruck, FiXCircle, FiMessageCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';


const OrderPage = () => {
    const dispatch = useDispatch();
    const { currentUser } = useAuth();
    const { data: orders = [], isLoading, isError } = useGetOrdersByEmailQuery(currentUser?.email, {
        skip: !currentUser
    });
    const [cancelOrder] = useCancelOrderMutation();

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                label: 'Đợi xác nhận',
                icon: FiClock,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200'
            },
            confirmed: {
                label: 'Đã xác nhận',
                icon: FiCheckCircle,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200'
            },
            shipping: {
                label: 'Đang giao hàng',
                icon: FiTruck,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200'
            },
            delivered: {
                label: 'Đã giao hàng',
                icon: FiCheckCircle,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200'
            },
            cancelled: {
                label: 'Đã hủy',
                icon: FiXCircle,
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200'
            }
        };
        return configs[status] || configs.pending;
    };

    const handleCancelOrder = async (orderId, paymentMethod) => {
        if (paymentMethod !== 'cod') {
            Swal.fire({
                title: 'Không thể hủy đơn',
                text: 'Đơn hàng thanh toán chuyển khoản không thể tự hủy. Vui lòng liên hệ nhà sách.',
                icon: 'warning',
                confirmButtonText: 'Đã hiểu'
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Xác nhận hủy đơn',
            text: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Hủy đơn',
            cancelButtonText: 'Không'
        });

        if (result.isConfirmed) {
            try {
                await cancelOrder(orderId).unwrap();
                
                // Invalidate Books cache để cập nhật stock hiển thị
                dispatch(booksApi.util.invalidateTags(['Books']));
                
                Swal.fire({
                    title: 'Đã hủy đơn hàng!',
                    text: 'Đơn hàng của bạn đã được hủy thành công và số lượng sản phẩm đã được hoàn trả vào kho.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } catch (error) {
                Swal.fire({
                    title: 'Lỗi!',
                    text: error.data?.message || 'Không thể hủy đơn hàng. Vui lòng thử lại.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    const handleContactBookstore = () => {
        Swal.fire({
            title: 'Liên hệ nhà sách',
            html: `
                <div class="text-left space-y-3">
                    <p><strong>📞 Hotline:</strong> 1900-xxxx</p>
                    <p><strong>📧 Email:</strong> support@tiemsachhuvo.vn</p>
                    <p><strong>💬 Zalo:</strong> 0123-456-789</p>
                    <p class="text-sm text-gray-600 mt-4">Vui lòng cung cấp mã đơn hàng khi liên hệ để được hỗ trợ nhanh chóng.</p>
                </div>
            `,
            icon: 'info',
            confirmButtonText: 'Đã hiểu'
        });
    };

    if (isLoading) return <div className="flex items-center justify-center p-8"><div className="text-lg text-gray-600">Đang tải...</div></div>
    if (isError) return <div className="flex items-center justify-center p-8"><div className="text-lg text-red-600">Lỗi khi tải đơn hàng</div></div>
    
    return (
        <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Đơn hàng của tôi</h2>
            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-gray-100 to-blue-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                        <FiPackage className="w-16 h-16 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-600">Bạn chưa có đơn hàng nào. Hãy khám phá và mua sắm ngay!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, index) => {
                        const statusConfig = getStatusConfig(order.status);
                        const StatusIcon = statusConfig.icon;
                        const canCancel = order.status === 'pending' && order.paymentMethod === 'cod';
                        const canContact = order.status !== 'pending' || order.paymentMethod !== 'cod';

                        return (
                            <div key={order._id} className={`bg-white rounded-2xl p-6 border-2 ${statusConfig.borderColor} hover:shadow-lg transition-all duration-300`}>
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Mã đơn hàng</p>
                                            <p className="font-mono text-base font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${statusConfig.bgColor} ${statusConfig.color} font-semibold mb-2`}>
                                            <StatusIcon className="w-5 h-5" />
                                            {statusConfig.label}
                                        </div>
                                        <p className="text-2xl font-bold text-green-600">{formatVND(order.totalPrice)}</p>
                                    </div>
                                </div>

                                {/* Products */}
                                <div className="mb-4 bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiBox className="w-5 h-5 text-purple-600" />
                                        <p className="font-semibold text-gray-800">Sản phẩm ({order.products?.length || order.productIds?.length || 0})</p>
                                    </div>
                                    <div className="space-y-2">
                                        {order.products && order.products.length > 0 ? (
                                            order.products.map((product, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800">{product.title}</p>
                                                        <p className="text-sm text-gray-500">Số lượng: <span className="font-semibold">{product.quantity}</span></p>
                                                    </div>
                                                    <p className="text-purple-600 font-semibold">{formatVND(product.price * product.quantity)}</p>
                                                </div>
                                            ))
                                        ) : order.productIds && order.productIds.length > 0 ? (
                                            <div className="bg-white p-3 rounded-lg">
                                                <p className="text-sm text-gray-600">
                                                    <strong>Số lượng sản phẩm:</strong> {order.productIds.length}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    (Đơn hàng cũ - không có chi tiết sản phẩm)
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">Không có sản phẩm</p>
                                        )}
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                                        <FiUser className="w-5 h-5 text-purple-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500">Người nhận</p>
                                            <p className="font-semibold text-gray-800">{order.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                                        <FiPhone className="w-5 h-5 text-green-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500">Số điện thoại</p>
                                            <p className="font-semibold text-gray-800">{order.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg md:col-span-2">
                                        <FiMapPin className="w-5 h-5 text-red-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                                            <p className="font-semibold text-gray-800">
                                                {order.address.city}, {order.address.state}, {order.address.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 justify-end pt-3 border-t border-gray-200">
                                    {canCancel && (
                                        <button
                                            onClick={() => handleCancelOrder(order._id, order.paymentMethod)}
                                            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                        >
                                            <FiXCircle className="w-4 h-4" />
                                            Hủy đơn
                                        </button>
                                    )}
                                    {canContact && order.status !== 'cancelled' && (
                                        <button
                                            onClick={handleContactBookstore}
                                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                        >
                                            <FiMessageCircle className="w-4 h-4" />
                                            Liên hệ nhà sách
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default OrderPage