import React, { useState, useMemo } from 'react';
import Loading from '../../../components/Loading';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation, useBulkUpdateOrderStatusMutation } from '../../../redux/features/orders/ordersApi';
import { formatVND } from '../../../utils/formatVND';
import { MdShoppingCart, MdSearch, MdFilterList } from 'react-icons/md';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const ManageOrders = () => {
    const { data: orders, isLoading, isError, error, refetch } = useGetAllOrdersQuery();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [bulkUpdateOrderStatus] = useBulkUpdateOrderStatusMutation();

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);
    
    // Bulk update states
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [bulkStatus, setBulkStatus] = useState('confirmed');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Status configuration
    const statusConfig = {
        pending: { 
            label: 'Chờ xác nhận', 
            color: 'bg-yellow-100 text-yellow-800',
            icon: <FiClock className="inline h-4 w-4 mr-1" />
        },
        confirmed: { 
            label: 'Đã xác nhận', 
            color: 'bg-blue-100 text-blue-800',
            icon: <FiPackage className="inline h-4 w-4 mr-1" />
        },
        shipping: { 
            label: 'Đang giao', 
            color: 'bg-purple-100 text-purple-800',
            icon: <FiTruck className="inline h-4 w-4 mr-1" />
        },
        delivered: { 
            label: 'Đã giao', 
            color: 'bg-green-100 text-green-800',
            icon: <FiCheckCircle className="inline h-4 w-4 mr-1" />
        },
        cancelled: { 
            label: 'Hủy', 
            color: 'bg-red-100 text-red-800',
            icon: <FiXCircle className="inline h-4 w-4 mr-1" />
        }
    };

    // Filter orders
    const filteredOrders = useMemo(() => {
        if (!orders) return [];

        return orders.filter(order => {
            // Search filter
            const matchesSearch = searchQuery === '' || 
                order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.phone.includes(searchQuery) ||
                order._id.slice(-8).toUpperCase().includes(searchQuery.toUpperCase());

            // Status filter
            const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, selectedStatus]);

    React.useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedStatus]);

    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(start, start + itemsPerPage);
    }, [filteredOrders, currentPage, itemsPerPage]);
    const totalPages = Math.ceil((filteredOrders?.length || 0) / itemsPerPage);

    // Handle status change
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
            alert('Cập nhật trạng thái thành công!');
            refetch();
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
        }
    };

    // Handle bulk status update
    const handleBulkUpdate = async () => {
        if (selectedOrderIds.length === 0) {
            alert('Vui lòng chọn ít nhất một đơn hàng');
            return;
        }

        if (!confirm(`Bạn có chắc muốn cập nhật ${selectedOrderIds.length} đơn hàng sang trạng thái "${statusConfig[bulkStatus].label}"?`)) {
            return;
        }

        try {
            const result = await bulkUpdateOrderStatus({ orderIds: selectedOrderIds, status: bulkStatus }).unwrap();
            alert(result.message);
            setSelectedOrderIds([]);
            refetch();
        } catch (error) {
            console.error('Failed to bulk update:', error);
            alert('Cập nhật hàng loạt thất bại. Vui lòng thử lại.');
        }
    };

    // Handle checkbox selection
    const handleSelectOrder = (orderId) => {
        setSelectedOrderIds(prev => 
            prev.includes(orderId) 
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectedOrderIds.length === filteredOrders.length) {
            setSelectedOrderIds([]);
        } else {
            setSelectedOrderIds(filteredOrders.map(order => order._id));
        }
    };

    // Get valid statuses for bulk update based on selected orders
    const getValidBulkStatuses = useMemo(() => {
        if (selectedOrderIds.length === 0) {
            // Nếu chưa chọn đơn nào, hiển thị tất cả
            return Object.keys(statusConfig);
        }

        // Lấy trạng thái của các đơn đã chọn
        const selectedOrders = filteredOrders.filter(order => selectedOrderIds.includes(order._id));
        const statuses = selectedOrders.map(order => order.status);
        const uniqueStatuses = [...new Set(statuses)];

        // Nếu tất cả đơn đã chọn có cùng trạng thái
        if (uniqueStatuses.length === 1) {
            const currentStatus = uniqueStatuses[0];
            
            // Định nghĩa các trạng thái có thể chuyển đến
            const allowedTransitions = {
                'pending': ['confirmed', 'cancelled'],
                'confirmed': ['shipping', 'cancelled'],
                'shipping': ['delivered', 'cancelled'],
                'delivered': [], // Không cho phép chuyển từ delivered
                'cancelled': [] // Không cho phép chuyển từ cancelled
            };

            return allowedTransitions[currentStatus] || [];
        }

        // Nếu các đơn có trạng thái khác nhau, cho phép các trạng thái tiến triển
        return ['confirmed', 'shipping', 'delivered', 'cancelled'];
    }, [selectedOrderIds, filteredOrders, statusConfig]);

    // Get available statuses for a single order
    const getAvailableStatuses = (currentStatus) => {
        const allowedTransitions = {
            'pending': ['pending', 'confirmed', 'cancelled'],
            'confirmed': ['confirmed', 'shipping', 'cancelled'],
            'shipping': ['shipping', 'delivered', 'cancelled'],
            'delivered': ['delivered'], // Chỉ xem, không thay đổi
            'cancelled': ['cancelled'] // Chỉ xem, không thay đổi
        };
        return allowedTransitions[currentStatus] || Object.keys(statusConfig);
    };

    // Auto-set bulkStatus khi chọn đơn hàng
    React.useEffect(() => {
        if (selectedOrderIds.length > 0 && getValidBulkStatuses.length > 0) {
            // Nếu bulkStatus hiện tại không hợp lệ, đặt thành trạng thái đầu tiên
            if (!getValidBulkStatuses.includes(bulkStatus)) {
                setBulkStatus(getValidBulkStatuses[0]);
            }
        }
    }, [selectedOrderIds, getValidBulkStatuses]);

    // Reset filters
    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedStatus('all');
    };

    // Toggle order details
    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    // Count orders by status
    const orderCounts = useMemo(() => {
        if (!orders) return {};
        return orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});
    }, [orders]);

    if (isLoading) return <Loading />;

    if (isError) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center max-w-md">
                    <div className="bg-red-100 border-2 border-red-400 rounded-lg p-6 mb-4">
                        <FiXCircle className="h-16 w-16 text-red-600 mx-auto mb-3" />
                        <h2 className="text-xl font-bold text-red-800 mb-2">Lỗi tải đơn hàng</h2>
                        <p className="text-red-700 mb-4">
                            {error?.data?.message || error?.error || 'Không thể tải danh sách đơn hàng'}
                        </p>
                        <button
                            onClick={() => refetch()}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                        >
                            Thử lại
                        </button>
                    </div>
                    <p className="text-sm text-gray-600">
                        Vui lòng kiểm tra kết nối hoặc đăng nhập lại
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đơn hàng</h1>
                <p className="text-gray-600">
                    Quản lý và cập nhật trạng thái đơn hàng 
                    ({filteredOrders?.length || 0} / {orders?.length || 0} đơn hàng)
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {Object.entries(statusConfig).map(([status, config]) => (
                    <div 
                        key={status}
                        className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-600"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600 mb-1">{config.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{orderCounts[status] || 0}</p>
                            </div>
                            <div className={`${config.color} p-3 rounded-lg`}>
                                {config.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bulk Action Toolbar */}
            {selectedOrderIds.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg shadow-lg p-4 mb-6 animate-fadeIn">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">
                                {selectedOrderIds.length}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    Đã chọn {selectedOrderIds.length} đơn hàng
                                </p>
                                <p className="text-sm text-gray-600">
                                    {getValidBulkStatuses.length > 0 
                                        ? 'Cập nhật trạng thái hàng loạt'
                                        : 'Không thể cập nhật đơn đã giao hoặc đã hủy'
                                    }
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <select
                                value={bulkStatus}
                                onChange={(e) => setBulkStatus(e.target.value)}
                                className="px-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
                                disabled={getValidBulkStatuses.length === 0}
                            >
                                {getValidBulkStatuses.length === 0 ? (
                                    <option value="">Không thể cập nhật</option>
                                ) : (
                                    getValidBulkStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {statusConfig[status].label}
                                        </option>
                                    ))
                                )}
                            </select>
                            
                            <button
                                onClick={handleBulkUpdate}
                                disabled={getValidBulkStatuses.length === 0}
                                className={`px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ${
                                    getValidBulkStatuses.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                Cập nhật
                            </button>
                            
                            <button
                                onClick={() => setSelectedOrderIds([])}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-300"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                <div className="flex items-center mb-4">
                    <MdFilterList className="h-5 w-5 text-purple-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Search */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tìm kiếm
                        </label>
                        <div className="relative">
                            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tên, email, số điện thoại hoặc mã đơn..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Status filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái đơn hàng
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            {Object.entries(statusConfig).map(([status, config]) => (
                                <option key={status} value={status}>{config.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Reset button and filter info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
                    >
                        Xóa bộ lọc
                    </button>

                    {(searchQuery || selectedStatus !== 'all') && (
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold text-purple-600">{filteredOrders?.length}</span> kết quả được tìm thấy
                        </div>
                    )}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center">
                        <MdShoppingCart className="h-6 w-6 text-purple-600 mr-2" />
                        <h3 className="font-bold text-lg text-gray-800">Danh sách đơn hàng</h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredOrders && filteredOrders.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedOrderIds.length === filteredOrders.length}
                                            onChange={handleSelectAll}
                                            className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Mã đơn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Liên hệ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Sản phẩm
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Tổng tiền
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Thanh toán
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Ngày đặt
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedOrders.map((order) => (
                                    <React.Fragment key={order._id}>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrderIds.includes(order._id)}
                                                    onChange={() => handleSelectOrder(order._id)}
                                                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono font-bold text-gray-900">
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{order.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{order.email}</div>
                                                <div className="text-xs text-gray-500">{order.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {order.products?.length || order.productIds?.length || 0} sản phẩm
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-purple-600">
                                                    {formatVND(order.totalPrice)}
                                                </div>
                                                {order.rewardPointsEarned > 0 && (
                                                    <div className="text-xs text-amber-600">
                                                        +{order.rewardPointsEarned} điểm
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    order.paymentMethod === 'cod' 
                                                        ? 'bg-orange-100 text-orange-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {order.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusConfig[order.status]?.color}`}>
                                                    {statusConfig[order.status]?.icon}
                                                    {statusConfig[order.status]?.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                <div className="text-xs text-gray-400">
                                                    {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => toggleOrderDetails(order._id)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    {expandedOrder === order._id ? 'Ẩn' : 'Chi tiết'}
                                                </button>
                                            </td>
                                        </tr>
                                        
                                        {/* Expanded Order Details */}
                                        {expandedOrder === order._id && (
                                            <tr>
                                                <td colSpan="10" className="px-6 py-5 bg-gradient-to-br from-slate-50 to-blue-50 border-t border-b border-blue-100">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                                                        {/* Column 1 - Customer & Order Info */}
                                                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                                            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2 text-sm">
                                                                <span className="w-2 h-4 bg-purple-500 rounded-full inline-block"></span>
                                                                Thông tin đơn hàng
                                                            </h4>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-gray-500">Mã đơn:</span>
                                                                    <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                                        #{order._id.slice(-8).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <span className="text-gray-500 shrink-0">Ngày đặt:</span>
                                                                    <span className="text-gray-900 text-right text-xs">
                                                                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                                                                    </span>
                                                                </div>
                                                                <div className="border-t border-gray-100 pt-2 mt-1 space-y-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-500">Khách hàng:</span>
                                                                        <span className="font-semibold text-gray-900">{order.name}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center gap-2">
                                                                        <span className="text-gray-500 shrink-0">Email:</span>
                                                                        <span className="text-gray-900 text-xs break-all text-right">{order.email}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-500">Điện thoại:</span>
                                                                        <span className="font-medium text-gray-900">{order.phone}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="border-t border-gray-100 pt-2">
                                                                    <span className="text-gray-500 block mb-1">Địa chỉ giao hàng:</span>
                                                                    <div className="text-gray-900 bg-gray-50 p-2 rounded-lg text-xs leading-relaxed space-y-0.5">
                                                                        {order.address?.street && <p className="font-medium">{order.address.street}</p>}
                                                                        {(order.address?.ward || order.address?.district) && (
                                                                            <p className="text-gray-600">{[order.address.ward, order.address.district].filter(Boolean).join(', ')}</p>
                                                                        )}
                                                                        <p className="text-gray-600">
                                                                            {[order.address?.city, order.address?.country].filter(Boolean).join(', ')}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                                                                    <span className="text-gray-500">Thanh toán:</span>
                                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                        order.paymentMethod === 'cod'
                                                                            ? 'bg-orange-100 text-orange-800'
                                                                            : 'bg-green-100 text-green-800'
                                                                    }`}>
                                                                        {order.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Column 2 - Products & Price Breakdown */}
                                                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                                            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2 text-sm">
                                                                <span className="w-2 h-4 bg-blue-500 rounded-full inline-block"></span>
                                                                Sản phẩm ({order.products?.length || 0})
                                                            </h4>
                                                            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                                                                {order.products && order.products.length > 0 ? (
                                                                    order.products.map((product, idx) => (
                                                                        <div key={idx} className="flex items-start justify-between text-sm bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                                                            <div className="flex-1 min-w-0 mr-2">
                                                                                <p className="font-medium text-gray-900 text-xs leading-snug">{product.title}</p>
                                                                                <p className="text-gray-400 text-xs mt-0.5">
                                                                                    {formatVND(product.price)} × {product.quantity}
                                                                                </p>
                                                                            </div>
                                                                            <p className="font-semibold text-purple-600 whitespace-nowrap text-xs">
                                                                                {formatVND(product.price * product.quantity)}
                                                                            </p>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-gray-400 text-sm text-center py-4">Không có chi tiết sản phẩm</p>
                                                                )}
                                                            </div>

                                                            {/* Price Breakdown */}
                                                            <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5 text-sm">
                                                                <div className="flex justify-between text-gray-600">
                                                                    <span>Tạm tính:</span>
                                                                    <span>
                                                                        {formatVND(
                                                                            order.products?.reduce((sum, p) => sum + p.price * p.quantity, 0) || order.totalPrice
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                {order.discounts?.tierDiscount > 0 && (
                                                                    <div className="flex justify-between text-emerald-600">
                                                                        <span>Giảm hạng thành viên:</span>
                                                                        <span>-{formatVND(order.discounts.tierDiscount)}</span>
                                                                    </div>
                                                                )}
                                                                {order.discounts?.couponDiscount > 0 && (
                                                                    <div className="flex justify-between text-emerald-600">
                                                                        <span>
                                                                            Mã giảm giá
                                                                            {order.discounts?.couponCode && (
                                                                                <span className="ml-1 font-mono bg-emerald-50 px-1 py-0.5 rounded text-xs border border-emerald-200">
                                                                                    {order.discounts.couponCode}
                                                                                </span>
                                                                            )}:
                                                                        </span>
                                                                        <span>-{formatVND(order.discounts.couponDiscount)}</span>
                                                                    </div>
                                                                )}
                                                                {order.rewardPointsEarned > 0 && (
                                                                    <div className="flex justify-between text-amber-600">
                                                                        <span>Điểm thưởng tích lũy:</span>
                                                                        <span className="font-semibold">+{order.rewardPointsEarned} điểm</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-1">
                                                                    <span>Tổng cộng:</span>
                                                                    <span className="text-purple-600 text-base">{formatVND(order.totalPrice)}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Column 3 - Status Update */}
                                                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                                            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2 text-sm">
                                                                <span className="w-2 h-4 bg-green-500 rounded-full inline-block"></span>
                                                                Cập nhật trạng thái
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {getAvailableStatuses(order.status).map((status) => {
                                                                    const config = statusConfig[status];
                                                                    const isCurrentStatus = order.status === status;
                                                                    const canChange = !isCurrentStatus &&
                                                                        (order.status !== 'delivered' && order.status !== 'cancelled');

                                                                    return (
                                                                        <button
                                                                            key={status}
                                                                            onClick={() => canChange && handleStatusChange(order._id, status)}
                                                                            disabled={!canChange}
                                                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border-2 transition-all text-sm ${
                                                                                isCurrentStatus
                                                                                    ? 'border-purple-500 bg-purple-50'
                                                                                    : canChange
                                                                                        ? 'border-gray-200 hover:border-purple-400 hover:bg-purple-50 bg-white cursor-pointer'
                                                                                        : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                                                                            }`}
                                                                        >
                                                                            <span className={`flex items-center gap-1 ${
                                                                                isCurrentStatus ? 'font-semibold text-purple-700' : 'text-gray-700'
                                                                            }`}>
                                                                                {config.icon}
                                                                                {config.label}
                                                                            </span>
                                                                            {isCurrentStatus && (
                                                                                <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                                                                                    Hiện tại
                                                                                </span>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                                                <p className="text-xs text-amber-800 leading-relaxed">
                                                                    <strong>Lưu ý:</strong><br />
                                                                    • Xác nhận đơn sẽ cộng điểm thưởng cho KH<br />
                                                                    • Hủy đơn sẽ hoàn trả số lượng vào kho<br />
                                                                    • Không thể thay đổi đơn đã giao/đã hủy
                                                                </p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <MdShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                            <p className="text-lg font-semibold text-gray-500 mb-1">Không tìm thấy đơn hàng</p>
                            <p className="text-sm text-gray-400">Thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
                        </div>
                    )}
                </div>
                {/* Pagination */}
                {filteredOrders.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Hiển thị</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                            >
                                {[10, 20, 30, 50].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <span className="text-gray-500 ml-1">/ trang &nbsp;·&nbsp; {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredOrders.length)} / {filteredOrders.length} đơn hàng</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">‹</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).reduce((acc, p, i, arr) => { if (i > 0 && arr[i - 1] !== p - 1) acc.push('...'); acc.push(p); return acc; }, []).map((item, i) => item === '...' ? (<span key={`e-${i}`} className="px-2 text-gray-400">…</span>) : (<button key={item} onClick={() => setCurrentPage(item)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${currentPage === item ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>{item}</button>))}
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">›</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ManageOrders;
