import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateCouponMutation, useFetchAllCouponsQuery, useUpdateCouponMutation } from '../../../redux/features/coupons/couponsApi';
import Swal from 'sweetalert2';
import { FaTicketAlt, FaPercent, FaCoins, FaCalendar } from 'react-icons/fa';
import { CATEGORIES } from '../../../utils/categories.jsx';

const AddCoupon = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
    const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
    const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
    const { data: coupons } = useFetchAllCouponsQuery();
    
    const discountType = watch('discountType', 'fixed');
    const startDate = watch('startDate');

    // Load coupon data for edit mode
    useEffect(() => {
        if (isEditMode && coupons) {
            const coupon = coupons.find(c => c._id === id);
            if (coupon) {
                setValue('code', coupon.code);
                setValue('description', coupon.description);
                setValue('discountType', coupon.discountType);
                setValue('discountValue', coupon.discountValue);
                setValue('minPurchase', coupon.minPurchase);
                setValue('maxDiscount', coupon.maxDiscount || '');
                setValue('startDate', new Date(coupon.startDate).toISOString().split('T')[0]);
                setValue('endDate', new Date(coupon.endDate).toISOString().split('T')[0]);
                setValue('usageLimit', coupon.usageLimit || '');
                setValue('isActive', coupon.isActive);
            }
        }
    }, [isEditMode, id, coupons, setValue]);

    const onSubmit = async (data) => {
        // Validate dates
        if (new Date(data.endDate) < new Date(data.startDate)) {
            Swal.fire({
                title: "Lỗi",
                text: "Ngày kết thúc phải sau ngày bắt đầu!",
                icon: "error",
                confirmButtonColor: "#d33",
            });
            return;
        }

        // Validate discount value for percentage type
        if (data.discountType === 'percentage' && data.discountValue > 100) {
            Swal.fire({
                title: "Lỗi",
                text: "Phần trăm giảm giá không được vượt quá 100%!",
                icon: "error",
                confirmButtonColor: "#d33",
            });
            return;
        }

        const couponData = {
            code: data.code.toUpperCase().trim(),
            description: data.description,
            discountType: data.discountType,
            discountValue: Number(data.discountValue),
            minPurchase: Number(data.minPurchase) || 0,
            maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
            startDate: new Date(data.startDate).toISOString(),
            endDate: new Date(data.endDate).toISOString(),
            usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
            isActive: data.isActive === true || data.isActive === 'true',
        };

        try {
            if (isEditMode) {
                await updateCoupon({ id, ...couponData }).unwrap();
                Swal.fire({
                    title: "Thành công!",
                    text: "Cập nhật mã giảm giá thành công!",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                });
            } else {
                await createCoupon(couponData).unwrap();
                Swal.fire({
                    title: "Thành công!",
                    text: "Tạo mã giảm giá thành công!",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                });
                reset();
            }
            navigate('/dashboard/manage-coupons');
        } catch (error) {
            console.error("Error saving coupon:", error);
            const errorMessage = error?.data?.message || error?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
            Swal.fire({
                title: "Lỗi",
                text: errorMessage,
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto md:p-6 p-3">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <FaTicketAlt className="w-8 h-8" />
                    {isEditMode ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
                </h2>
                <p className="text-purple-100 mt-2">
                    {isEditMode ? 'Cập nhật thông tin mã giảm giá' : 'Điền thông tin đầy đủ để tạo mã giảm giá'}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className='bg-white rounded-xl shadow-lg p-6'>
                {/* Thông tin cơ bản */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-purple-200">
                        <FaTicketAlt className="w-5 h-5 text-purple-600" />
                        <h3 className="text-xl font-bold text-gray-800">Thông tin cơ bản</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã giảm giá <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register('code', { 
                                    required: 'Vui lòng nhập mã giảm giá',
                                    pattern: {
                                        value: /^[A-Z0-9]+$/,
                                        message: 'Mã chỉ được chứa chữ in hoa và số'
                                    }
                                })}
                                placeholder="VD: SUMMER2024"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all uppercase"
                            />
                            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register('description', { required: 'Vui lòng nhập mô tả' })}
                                placeholder="VD: Giảm giá mùa hè"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Thông tin giảm giá */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-purple-200">
                        <FaPercent className="w-5 h-5 text-purple-600" />
                        <h3 className="text-xl font-bold text-gray-800">Thông tin giảm giá</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Discount Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại giảm giá <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register('discountType', { required: true })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            >
                                <option value="fixed">Giảm cố định (VNĐ)</option>
                                <option value="percentage">Giảm theo phần trăm (%)</option>
                            </select>
                        </div>

                        {/* Discount Value */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giá trị giảm <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                {...register('discountValue', { 
                                    required: 'Vui lòng nhập giá trị giảm',
                                    min: { value: 1, message: 'Giá trị phải lớn hơn 0' }
                                })}
                                placeholder={discountType === 'fixed' ? 'VD: 50000' : 'VD: 10'}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {discountType === 'fixed' ? 'Số tiền giảm (VNĐ)' : 'Phần trăm giảm (tối đa 100%)'}
                            </p>
                            {errors.discountValue && <p className="text-red-500 text-xs mt-1">{errors.discountValue.message}</p>}
                        </div>

                        {/* Min Purchase */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đơn hàng tối thiểu
                            </label>
                            <input
                                type="number"
                                {...register('minPurchase', { min: 0 })}
                                placeholder="VD: 100000"
                                defaultValue={0}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">Để 0 nếu không có yêu cầu tối thiểu</p>
                        </div>

                        {/* Max Discount (only for percentage) */}
                        {discountType === 'percentage' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giảm tối đa
                                </label>
                                <input
                                    type="number"
                                    {...register('maxDiscount', { min: 0 })}
                                    placeholder="VD: 500000"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1">Số tiền giảm tối đa (VNĐ)</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Thời gian và giới hạn */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-purple-200">
                        <FaCalendar className="w-5 h-5 text-purple-600" />
                        <h3 className="text-xl font-bold text-gray-800">Thời gian và giới hạn</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày bắt đầu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                {...register('startDate', { required: 'Vui lòng chọn ngày bắt đầu' })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày kết thúc <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                {...register('endDate', { required: 'Vui lòng chọn ngày kết thúc' })}
                                min={startDate}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
                        </div>

                        {/* Usage Limit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giới hạn lượt sử dụng
                            </label>
                            <input
                                type="number"
                                {...register('usageLimit', { min: 1 })}
                                placeholder="VD: 100"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">Để trống nếu không giới hạn</p>
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center h-full">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('isActive')}
                                    defaultChecked={true}
                                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    Kích hoạt ngay
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/manage-coupons')}
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-all duration-300"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isCreating || isUpdating}
                        className="px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isCreating || isUpdating ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Tạo mã giảm giá')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCoupon;
