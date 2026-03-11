import React, { useState } from 'react';
import { useFetchAllRanksQuery, useUpdateRankMutation } from '../../../redux/features/ranks/ranksApi';
import { FaCrown, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ManageRanks = () => {
    const { data: ranksData, isLoading, refetch } = useFetchAllRanksQuery();
    const [updateRank] = useUpdateRankMutation();
    
    const [editingRank, setEditingRank] = useState(null);
    const [formData, setFormData] = useState({
        displayName: '',
        icon: '',
        minPoints: 0,
        maxPoints: null,
        discountPercent: 0,
        couponCode: '',
        couponDiscountType: 'percent',
        couponDiscountPercent: 0,
        couponDiscountAmount: 0,
        benefits: [],
        color: ''
    });

    const ranks = ranksData?.data || [];
    
    console.log('Ranks data:', ranks);

    const handleEdit = (rank) => {
        setEditingRank(rank);
        setFormData({
            displayName: rank.displayName,
            icon: rank.icon,
            minPoints: rank.minPoints,
            maxPoints: rank.maxPoints,
            discountPercent: rank.discountPercent,
            couponCode: rank.couponCode,
            couponDiscountType: rank.couponDiscountType || 'percent',
            couponDiscountPercent: rank.couponDiscountPercent || 0,
            couponDiscountAmount: rank.couponDiscountAmount || 0,
            benefits: rank.benefits,
            color: rank.color
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'minPoints' || name === 'maxPoints' || name === 'discountPercent' || name === 'couponDiscountPercent' || name === 'couponDiscountAmount'
                ? (value === '' ? null : Number(value))
                : value
        }));
    };

    const handleBenefitsChange = (e) => {
        const value = e.target.value;
        const benefitsArray = value.split('\n').filter(b => b.trim() !== '');
        setFormData(prev => ({
            ...prev,
            benefits: benefitsArray
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        try {
            const updateData = {
                id: editingRank._id,
                displayName: formData.displayName,
                icon: formData.icon,
                minPoints: Number(formData.minPoints),
                maxPoints: formData.maxPoints ? Number(formData.maxPoints) : null,
                discountPercent: Number(formData.discountPercent),
                couponCode: formData.couponCode || '',
                couponDiscountType: formData.couponDiscountType,
                couponDiscountPercent: formData.couponDiscountType === 'percent' ? Number(formData.couponDiscountPercent) || 0 : 0,
                couponDiscountAmount: formData.couponDiscountType === 'amount' ? Number(formData.couponDiscountAmount) || 0 : 0,
                benefits: Array.isArray(formData.benefits) ? formData.benefits : [],
                color: formData.color
            };
            
            console.log('Updating rank with data:', updateData);
            
            const result = await updateRank(updateData).unwrap();
            
            console.log('Update result:', result);
            
            await Swal.fire('Thành công!', 'Đã cập nhật hạng thành viên', 'success');
            setEditingRank(null);
            refetch();
        } catch (error) {
            console.error('Update error:', error);
            Swal.fire('Lỗi!', error.data?.message || 'Không thể cập nhật hạng', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <FaCrown className="text-yellow-500" />
                    Quản Lý Hạng Thành Viên
                </h1>
                <p className="text-gray-600">
                    Cập nhật điểm, giảm giá và quyền lợi cho từng hạng thành viên ({ranks.length} hạng)
                </p>
            </div>

            {/* Ranks Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hạng
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Điểm yêu cầu
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giảm giá
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã giảm giá
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giảm giá coupon
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quyền lợi
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{minWidth: '120px'}}>
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {ranks.map((rank) => (
                            <tr key={rank._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{rank.icon}</span>
                                        <span className="text-sm font-medium text-gray-900">{rank.displayName}</span>
                                        {rank.isDefault && (
                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Mặc định</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {rank.minPoints} - {rank.maxPoints || '∞'} điểm
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded">{rank.discountPercent}%</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {rank.couponCode ? (
                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded font-mono">{rank.couponCode}</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {(rank.couponDiscountType === 'percent' || !rank.couponDiscountType) && rank.couponDiscountPercent > 0 ? (
                                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">
                                            -{rank.couponDiscountPercent}%
                                        </span>
                                    ) : rank.couponDiscountType === 'amount' && rank.couponDiscountAmount > 0 ? (
                                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                                            -{rank.couponDiscountAmount.toLocaleString('vi-VN')}₫
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {rank.benefits && rank.benefits.length > 0 ? (
                                        <ul className="list-disc list-inside">
                                            {rank.benefits.map((benefit, idx) => (
                                                <li key={idx}>{benefit}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-gray-400 italic">Không có quyền lợi</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => {
                                            console.log('Edit clicked:', rank);
                                            handleEdit(rank);
                                        }}
                                        style={{
                                            display: 'inline-block',
                                            padding: '8px 16px',
                                            backgroundColor: '#2563eb',
                                            color: 'white',
                                            borderRadius: '8px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                                    >
                                        <FaEdit style={{display: 'inline', marginRight: '4px'}} />
                                        Sửa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {ranks.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Chưa có hạng thành viên</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingRank && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Chỉnh sửa: {editingRank.displayName}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Cập nhật thông tin hạng thành viên
                            </p>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Display Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên hiển thị *
                                    </label>
                                    <input
                                        type="text"
                                        name="displayName"
                                        value={formData.displayName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ví dụ: Đồng"
                                    />
                                </div>

                                {/* Icon */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Icon (Emoji)
                                    </label>
                                    <input
                                        type="text"
                                        name="icon"
                                        value={formData.icon}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="🥉"
                                    />
                                </div>

                                {/* Min Points */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Điểm tối thiểu *
                                    </label>
                                    <input
                                        type="number"
                                        name="minPoints"
                                        value={formData.minPoints}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Max Points */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Điểm tối đa (để trống = không giới hạn)
                                    </label>
                                    <input
                                        type="number"
                                        name="maxPoints"
                                        value={formData.maxPoints || ''}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Không giới hạn"
                                    />
                                </div>

                                {/* Discount Percent */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        % Giảm giá *
                                    </label>
                                    <input
                                        type="number"
                                        name="discountPercent"
                                        value={formData.discountPercent}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        max="100"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Coupon Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mã giảm giá
                                    </label>
                                    <input
                                        type="text"
                                        name="couponCode"
                                        value={formData.couponCode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="SILVER5"
                                    />
                                </div>

                                {/* Coupon Discount Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loại giảm giá coupon
                                    </label>
                                    <select
                                        name="couponDiscountType"
                                        value={formData.couponDiscountType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="percent">Giảm theo %</option>
                                        <option value="amount">Giảm theo số tiền</option>
                                    </select>
                                </div>

                                {/* Coupon Discount Percent - Only show if type is percent */}
                                {formData.couponDiscountType === 'percent' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            % Giảm giá coupon
                                        </label>
                                        <input
                                            type="number"
                                            name="couponDiscountPercent"
                                            value={formData.couponDiscountPercent}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="100"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="5"
                                        />
                                    </div>
                                )}

                                {/* Coupon Discount Amount - Only show if type is amount */}
                                {formData.couponDiscountType === 'amount' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tiền giảm coupon (VNĐ)
                                        </label>
                                        <input
                                            type="number"
                                            name="couponDiscountAmount"
                                            value={formData.couponDiscountAmount}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="1000"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="10000"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Color */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gradient Color (Tailwind classes)
                                </label>
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="from-amber-700 to-amber-900"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Sử dụng các class gradient của Tailwind CSS
                                </p>
                            </div>

                            {/* Benefits */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quyền lợi (mỗi dòng 1 quyền lợi)
                                </label>
                                <textarea
                                    value={formData.benefits.join('\n')}
                                    onChange={handleBenefitsChange}
                                    rows="6"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Giảm 5% mọi đơn hàng&#10;Ưu tiên hỗ trợ&#10;Tích điểm nhanh hơn"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Nhập mỗi quyền lợi trên một dòng riêng biệt
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setEditingRank(null)}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRanks;
