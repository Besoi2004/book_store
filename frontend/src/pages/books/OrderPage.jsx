import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { useGetOrdersByEmailQuery, useCancelOrderMutation } from '../../redux/features/orders/ordersApi';
import booksApi from '../../redux/features/books/booksApi';
import { formatVND } from '../../utils/formatVND';
import { getImgUrl } from '../../utils/getImgUrl';
import {
    FiPackage, FiMapPin, FiPhone, FiMail, FiBox, FiUser,
    FiClock, FiCheckCircle, FiTruck, FiXCircle, FiMessageCircle,
    FiCreditCard, FiTag, FiStar, FiChevronDown, FiChevronUp, FiCalendar, FiDollarSign
} from 'react-icons/fi';
import Swal from 'sweetalert2';


const STATUS_STEPS = ['pending', 'confirmed', 'shipping', 'delivered'];

const getStatusConfig = (status) => {
    const configs = {
        pending:   { label: 'Đợi xác nhận', icon: FiClock,        color: 'text-yellow-600', bgColor: 'bg-yellow-50',  borderColor: 'border-yellow-300', stepColor: 'bg-yellow-400' },
        confirmed: { label: 'Đã xác nhận',  icon: FiCheckCircle,  color: 'text-blue-600',   bgColor: 'bg-blue-50',    borderColor: 'border-blue-300',   stepColor: 'bg-blue-500'   },
        shipping:  { label: 'Đang giao',     icon: FiTruck,        color: 'text-purple-600', bgColor: 'bg-purple-50',  borderColor: 'border-purple-300', stepColor: 'bg-purple-500' },
        delivered: { label: 'Đã giao',       icon: FiCheckCircle,  color: 'text-green-600',  bgColor: 'bg-green-50',   borderColor: 'border-green-300',  stepColor: 'bg-green-500'  },
        cancelled: { label: 'Đã hủy',        icon: FiXCircle,      color: 'text-red-600',    bgColor: 'bg-red-50',     borderColor: 'border-red-300',    stepColor: 'bg-red-400'    },
    };
    return configs[status] || configs.pending;
};

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const OrderCard = ({ order, onCancel, onContact }) => {
    const [expanded, setExpanded] = useState(true);
    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;
    const isCancelled = order.status === 'cancelled';
    const canCancel = order.status === 'pending' && order.paymentMethod === 'cod';
    const canContact = !canCancel && !isCancelled;

    const subtotal = order.products?.reduce((sum, p) => sum + p.price * p.quantity, 0) ?? order.totalPrice;
    const tierDiscount = order.discounts?.tierDiscount || 0;
    const couponDiscount = order.discounts?.couponDiscount || 0;
    const couponCode = order.discounts?.couponCode;
    const shippingFee = order.shippingFee ?? 30000;
    const currentStep = isCancelled ? -1 : STATUS_STEPS.indexOf(order.status);

    return (
        <div className={`bg-white rounded-2xl border-2 ${statusConfig.borderColor} shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}>

            {/* ── Top bar ── */}
            <div className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3 ${statusConfig.bgColor}`}>
                <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-lg border border-gray-200">
                        #{order._id.slice(-10).toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                        <FiCalendar className="w-3.5 h-3.5" />
                        {formatDate(order.createdAt)}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold ${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                    </span>
                    <button onClick={() => setExpanded(e => !e)} className="p-1.5 rounded-lg hover:bg-white/60 transition-colors text-gray-500">
                        {expanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* ── Progress stepper ── */}
            {!isCancelled && (
                <div className="px-6 pt-4 pb-2">
                    <div className="flex items-center">
                        {STATUS_STEPS.map((step, idx) => {
                            const done = idx <= currentStep;
                            const cfg = getStatusConfig(step);
                            const StepIcon = cfg.icon;
                            return (
                                <React.Fragment key={step}>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${done ? cfg.stepColor + ' text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                                            <StepIcon className="w-4 h-4" />
                                        </div>
                                        <span className={`text-[10px] font-medium whitespace-nowrap ${done ? cfg.color : 'text-gray-400'}`}>{cfg.label}</span>
                                    </div>
                                    {idx < STATUS_STEPS.length - 1 && (
                                        <div className={`flex-1 h-1 mx-1 rounded-full mb-4 transition-all ${idx < currentStep ? cfg.stepColor : 'bg-gray-100'}`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            )}

            {expanded && (
                <div className="px-5 pb-5 pt-2 space-y-4">

                    {/* ── Products ── */}
                    <div className="rounded-xl border border-gray-100 overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                            <FiBox className="w-4 h-4 text-purple-500" />
                            <span className="font-semibold text-gray-700 text-sm">
                                Sản phẩm ({order.products?.length || order.productIds?.length || 0})
                            </span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {order.products && order.products.length > 0 ? (
                                order.products.map((product, idx) => (
                                    <div key={idx} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                                        <img
                                            src={getImgUrl(product.coverImage)}
                                            alt={product.title}
                                            className="w-12 h-16 object-cover rounded-lg shadow-sm flex-shrink-0 bg-gray-100"
                                            onError={(e) => { e.target.style.display = 'none' }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">{product.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{formatVND(product.price)} × {product.quantity}</p>
                                        </div>
                                        <p className="text-purple-600 font-bold text-sm flex-shrink-0">{formatVND(product.price * product.quantity)}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-gray-500">
                                    {order.productIds?.length || 0} sản phẩm (đơn hàng cũ)
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Info + Summary grid ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Delivery info */}
                        <div className="rounded-xl border border-gray-100 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                                <FiMapPin className="w-4 h-4 text-red-500" />
                                <span className="font-semibold text-gray-700 text-sm">Thông tin giao hàng</span>
                            </div>
                            <div className="px-4 py-3 space-y-2.5 text-sm">
                                <div className="flex items-start gap-2">
                                    <FiUser className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400">Người nhận</p>
                                        <p className="font-semibold text-gray-800">{order.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <FiPhone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400">Số điện thoại</p>
                                        <p className="font-semibold text-gray-800">{order.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400">Địa chỉ</p>
                                        <div className="font-semibold text-gray-800 space-y-0.5">
                                            {order.address?.street && <p>{order.address.street}</p>}
                                            {(order.address?.ward || order.address?.district) && (
                                                <p className="text-gray-600 font-normal text-xs">
                                                    {[order.address.ward, order.address.district].filter(Boolean).join(', ')}
                                                </p>
                                            )}
                                            <p className="text-gray-600 font-normal text-xs">
                                                {[order.address?.city, order.address?.country].filter(Boolean).join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <FiCreditCard className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400">Thanh toán</p>
                                        <p className="font-semibold text-gray-800">
                                            {order.paymentMethod === 'cod' ? '💵 Thanh toán khi nhận hàng (COD)' : '🏦 Chuyển khoản ngân hàng'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price summary */}
                        <div className="rounded-xl border border-gray-100 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                                <FiDollarSign className="w-4 h-4 text-green-500" />
                                <span className="font-semibold text-gray-700 text-sm">Chi tiết thanh toán</span>
                            </div>
                            <div className="px-4 py-3 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span className="font-medium text-gray-800">{formatVND(subtotal)}</span>
                                </div>
                                {tierDiscount > 0 && (
                                    <div className="flex justify-between text-purple-600">
                                        <span className="flex items-center gap-1"><FiStar className="w-3.5 h-3.5" /> Ưu đãi hạng thành viên</span>
                                        <span className="font-medium">-{formatVND(tierDiscount)}</span>
                                    </div>
                                )}
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-pink-600">
                                        <span className="flex items-center gap-1">
                                            <FiTag className="w-3.5 h-3.5" />
                                            Mã giảm giá {couponCode && <span className="bg-pink-100 px-1.5 py-0.5 rounded text-xs font-mono">{couponCode}</span>}
                                        </span>
                                        <span className="font-medium">-{formatVND(couponDiscount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span className="font-medium text-gray-800">{shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                                    <span className="text-gray-800">Tổng cộng</span>
                                    <span className="text-green-600 text-lg">{formatVND(order.totalPrice)}</span>
                                </div>
                                {order.rewardPointsEarned > 0 && (
                                    <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-600 bg-amber-50 px-2 py-1.5 rounded-lg">
                                        <FiStar className="w-3.5 h-3.5" />
                                        Tích được <strong>{order.rewardPointsEarned} điểm</strong> từ đơn hàng này
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    {(canCancel || canContact) && (
                        <div className="flex gap-3 justify-end pt-1">
                            {canCancel && (
                                <button
                                    onClick={() => onCancel(order._id, order.paymentMethod)}
                                    className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
                                >
                                    <FiXCircle className="w-4 h-4" />
                                    Hủy đơn hàng
                                </button>
                            )}
                            {canContact && (
                                <Link
                                    to="/contact"
                                    className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
                                >
                                    <FiMessageCircle className="w-4 h-4" />
                                    Liên hệ hỗ trợ
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


const OrderPage = () => {
    const dispatch = useDispatch();
    const { currentUser } = useAuth();
    const { data: orders = [], isLoading, isError } = useGetOrdersByEmailQuery(currentUser?.email, {
        skip: !currentUser
    });
    const [cancelOrder] = useCancelOrderMutation();

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
                dispatch(booksApi.util.invalidateTags(['Books']));
                Swal.fire({ title: 'Đã hủy đơn hàng!', text: 'Đơn hàng của bạn đã được hủy thành công và số lượng sản phẩm đã được hoàn trả vào kho.', icon: 'success', confirmButtonText: 'OK' });
            } catch (error) {
                Swal.fire({ title: 'Lỗi!', text: error.data?.message || 'Không thể hủy đơn hàng. Vui lòng thử lại.', icon: 'error', confirmButtonText: 'OK' });
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
            <div className="flex items-center justify-between mb-6">
                <h2 className='text-2xl font-bold text-gray-800'>Đơn hàng của tôi</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{orders.length} đơn hàng</span>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-gray-100 to-blue-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                        <FiPackage className="w-16 h-16 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-600">Bạn chưa có đơn hàng nào. Hãy khám phá và mua sắm ngay!</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {orders.map((order) => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            onCancel={handleCancelOrder}
                            onContact={handleContactBookstore}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default OrderPage