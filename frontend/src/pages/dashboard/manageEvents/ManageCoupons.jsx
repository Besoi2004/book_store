import React, { useState, useMemo } from 'react'
import { useDeleteCouponMutation, useFetchAllCouponsQuery, useToggleCouponStatusMutation } from '../../../redux/features/coupons/couponsApi';
import { formatVND } from '../../../utils/formatVND';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaSearch, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaPercent, FaCoins } from 'react-icons/fa';
import { MdFilterList } from 'react-icons/md';

const ManageCoupons = () => {
    const { data: coupons, refetch } = useFetchAllCouponsQuery();
    const [deleteCoupon] = useDeleteCouponMutation();
    const [toggleCouponStatus] = useToggleCouponStatusMutation();

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Filter coupons
    const filteredCoupons = useMemo(() => {
        if (!coupons) return [];

        return coupons.filter(coupon => {
            const matchesSearch = searchQuery === '' || 
                coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                coupon.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = selectedType === 'all' || coupon.discountType === selectedType;

            const now = new Date();
            let matchesStatus = true;
            if (selectedStatus === 'active') {
                matchesStatus = coupon.isActive && now >= new Date(coupon.startDate) && now <= new Date(coupon.endDate);
            } else if (selectedStatus === 'inactive') {
                matchesStatus = !coupon.isActive;
            } else if (selectedStatus === 'expired') {
                matchesStatus = now > new Date(coupon.endDate);
            } else if (selectedStatus === 'upcoming') {
                matchesStatus = now < new Date(coupon.startDate);
            }

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [coupons, searchQuery, selectedType, selectedStatus]);

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedType('all');
        setSelectedStatus('all');
    };

    const handleDeleteCoupon = async (id, code) => {
        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa mã giảm giá "${code}"?`);
        if (!confirmDelete) return;

        try {
            await deleteCoupon(id).unwrap();
            alert('Xóa mã giảm giá thành công!');
            refetch();
        } catch (error) {
            console.error('Failed to delete coupon:', error);
            alert(error.data?.message || 'Xóa mã giảm giá thất bại. Vui lòng thử lại.');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await toggleCouponStatus(id).unwrap();
            alert(`Mã giảm giá đã được ${!currentStatus ? 'kích hoạt' : 'vô hiệu hóa'}!`);
            refetch();
        } catch (error) {
            console.error('Failed to toggle coupon status:', error);
            alert('Không thể thay đổi trạng thái. Vui lòng thử lại.');
        }
    };

    const getCouponStatus = (coupon) => {
        const now = new Date();
        const startDate = new Date(coupon.startDate);
        const endDate = new Date(coupon.endDate);

        if (!coupon.isActive) {
            return { label: 'Đã tắt', color: 'bg-gray-100 text-gray-800' };
        }
        if (now < startDate) {
            return { label: 'Sắp diễn ra', color: 'bg-blue-100 text-blue-800' };
        }
        if (now > endDate) {
            return { label: 'Đã hết hạn', color: 'bg-red-100 text-red-800' };
        }
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return { label: 'Hết lượt', color: 'bg-orange-100 text-orange-800' };
        }
        return { label: 'Đang hoạt động', color: 'bg-green-100 text-green-800' };
    };

    return (
        <>
            {/* Page Header */}
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý mã giảm giá</h1>
                    <p className="text-gray-600">
                        Danh sách tất cả mã giảm giá trong hệ thống
                        ({filteredCoupons?.length || 0} / {coupons?.length || 0} mã)
                    </p>
                </div>
                <Link 
                    to="/dashboard/add-coupon" 
                    className="inline-flex items-center px-5 py-3 text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    <FaPlus className="h-5 w-5 mr-2" />
                    Tạo mã giảm giá mới
                </Link>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                <div className="flex items-center mb-4">
                    <MdFilterList className="h-5 w-5 text-purple-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Search */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tìm kiếm
                        </label>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Mã hoặc mô tả..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Type filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Loại giảm giá
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                            <option value="all">Tất cả loại</option>
                            <option value="fixed">Giảm cố định</option>
                            <option value="percentage">Giảm theo %</option>
                        </select>
                    </div>

                    {/* Status filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="inactive">Đã tắt</option>
                            <option value="expired">Đã hết hạn</option>
                            <option value="upcoming">Sắp diễn ra</option>
                        </select>
                    </div>
                </div>

                {/* Reset button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
                    >
                        Xóa bộ lọc
                    </button>
                    
                    {(searchQuery || selectedType !== 'all' || selectedStatus !== 'all') && (
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold text-purple-600">{filteredCoupons?.length}</span> kết quả được tìm thấy
                        </div>
                    )}
                </div>
            </div>

            {/* Table Section */}
            <section className="py-1">
                <div className="w-full mb-12 px-0 mx-auto">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg border border-gray-200">
                        <div className="rounded-t mb-0 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex flex-wrap items-center">
                                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                    <div className="flex items-center">
                                        <FaTicketAlt className="h-6 w-6 text-purple-600 mr-2" />
                                        <h3 className="font-bold text-lg text-gray-800">Danh sách mã giảm giá</h3>
                                    </div>
                                </div>
                                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                                    <span className="text-sm text-gray-600">
                                        Tổng: <span className="font-bold text-purple-600">{filteredCoupons?.length || 0}</span> mã
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="block w-full overflow-x-auto">
                            <table className="items-center bg-transparent w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                                            #
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                                            Mã giảm giá
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                                            Mô tả
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap">
                                            Loại giảm
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap">
                                            Giá trị
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap">
                                            Đơn tối thiểu
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                                            Thời gian
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap">
                                            Sử dụng
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap">
                                            Trạng thái
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap sticky right-0 bg-gray-100">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredCoupons && filteredCoupons.length > 0 ? (
                                        filteredCoupons.map((coupon, index) => {
                                            const status = getCouponStatus(coupon);
                                            return (
                                                <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                                                    <th className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-left text-gray-700 font-medium whitespace-nowrap">
                                                        {index + 1}
                                                    </th>
                                                    <td className="border-t px-4 align-middle border-gray-200 text-xs p-3">
                                                        <span className="font-bold text-purple-600 text-sm">{coupon.code}</span>
                                                    </td>
                                                    <td className="border-t px-4 align-middle border-gray-200 text-xs p-3">
                                                        <div className="max-w-xs">
                                                            <span className="text-gray-700">{coupon.description}</span>
                                                        </div>
                                                    </td>
                                                    <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                            coupon.discountType === 'fixed' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {coupon.discountType === 'fixed' ? (
                                                                <><FaCoins className="inline mr-1" />Cố định</>
                                                            ) : (
                                                                <><FaPercent className="inline mr-1" />Phần trăm</>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center">
                                                        <span className="font-bold text-purple-600">
                                                            {coupon.discountType === 'fixed' 
                                                                ? formatVND(coupon.discountValue)
                                                                : `${coupon.discountValue}%`
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center">
                                                        <span className="text-gray-700">
                                                            {coupon.minPurchase > 0 ? formatVND(coupon.minPurchase) : '-'}
                                                        </span>
                                                    </td>
                                                    <td className="border-t px-4 align-middle border-gray-200 text-xs p-3">
                                                        <div className="text-gray-700">
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-semibold">Từ:</span>
                                                                <span>{new Date(coupon.startDate).toLocaleDateString('vi-VN')}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-semibold">Đến:</span>
                                                                <span>{new Date(coupon.endDate).toLocaleDateString('vi-VN')}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center">
                                                        <span className="text-gray-700">
                                                            {coupon.usedCount} / {coupon.usageLimit || '∞'}
                                                        </span>
                                                    </td>
                                                    <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center whitespace-nowrap sticky right-0 bg-white">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <button 
                                                                onClick={() => handleToggleStatus(coupon._id, coupon.isActive)}
                                                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 inline-flex items-center ${
                                                                    coupon.isActive 
                                                                        ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                                                                        : 'text-green-600 bg-green-50 hover:bg-green-100'
                                                                }`}
                                                                title={coupon.isActive ? 'Tắt' : 'Bật'}
                                                            >
                                                                {coupon.isActive ? <FaToggleOff className="mr-1" /> : <FaToggleOn className="mr-1" />}
                                                                {coupon.isActive ? 'Tắt' : 'Bật'}
                                                            </button>
                                                            <Link 
                                                                to={`/dashboard/edit-coupon/${coupon._id}`}
                                                                className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 inline-flex items-center"
                                                            >
                                                                <FaEdit className="mr-1" />
                                                                Sửa
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleDeleteCoupon(coupon._id, coupon.code)}
                                                                className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-300 inline-flex items-center"
                                                            >
                                                                <FaTrash className="mr-1" />
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="border-t px-4 align-middle border-gray-200 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <FaTicketAlt className="h-16 w-16 text-gray-300 mb-3" />
                                                    <p className="text-lg font-semibold mb-1">Không tìm thấy mã giảm giá</p>
                                                    <p className="text-sm">Thử điều chỉnh bộ lọc hoặc tạo mã giảm giá mới</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ManageCoupons
