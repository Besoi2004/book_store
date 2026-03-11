import React, { useState, useMemo } from 'react';
import { useFetchAllContactsQuery, useUpdateContactMutation, useDeleteContactMutation, useFetchContactStatsQuery } from '../../../redux/features/contacts/contactsApi';
import { MdEmail, MdSearch, MdFilterList, MdBook } from 'react-icons/md';
import { FiClock, FiMessageCircle, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ManageForms = () => {
    const { data: contactsData, isLoading, isError, error, refetch } = useFetchAllContactsQuery();
    const { data: statsData } = useFetchContactStatsQuery();
    const [updateContact] = useUpdateContactMutation();
    const [deleteContact] = useDeleteContactMutation();

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedTopic, setSelectedTopic] = useState('all');
    const [expandedContact, setExpandedContact] = useState(null);

    const CONTACT_TOPICS = [
        { value: 'cancel_order', label: 'Hủy đơn hàng', color: 'bg-red-100 text-red-700' },
        { value: 'not_received', label: 'Chưa nhận được hàng', color: 'bg-orange-100 text-orange-700' },
        { value: 'return_exchange', label: 'Đổi/trả hàng', color: 'bg-yellow-100 text-yellow-700' },
        { value: 'payment_issue', label: 'Vấn đề thanh toán', color: 'bg-pink-100 text-pink-700' },
        { value: 'product_inquiry', label: 'Hỏi thông tin sản phẩm', color: 'bg-blue-100 text-blue-700' },
        { value: 'product_complaint', label: 'Khiếu nại sản phẩm', color: 'bg-purple-100 text-purple-700' },
        { value: 'book_request', label: 'Tìm sách', color: 'bg-indigo-100 text-indigo-700' },
        { value: 'other', label: 'Khác', color: 'bg-gray-100 text-gray-700' },
    ];
    const topicMap = Object.fromEntries(CONTACT_TOPICS.map(t => [t.value, t]));

    const contacts = contactsData?.contacts || [];
    const stats = statsData?.stats || { total: 0, pending: 0, responded: 0, resolved: 0, bookRequests: 0 };

    // Status configuration
    const statusConfig = {
        pending: { 
            label: 'Chờ xử lý', 
            color: 'bg-yellow-100 text-yellow-800',
            icon: <FiClock className="inline h-4 w-4 mr-1" />
        },
        responded: { 
            label: 'Đã phản hồi', 
            color: 'bg-blue-100 text-blue-800',
            icon: <FiMessageCircle className="inline h-4 w-4 mr-1" />
        },
        resolved: { 
            label: 'Đã giải quyết', 
            color: 'bg-green-100 text-green-800',
            icon: <FiCheckCircle className="inline h-4 w-4 mr-1" />
        }
    };

    // Filter contacts
    const filteredContacts = useMemo(() => {
        if (!contacts) return [];

        return contacts.filter(contact => {
            // Search filter
            const matchesSearch = searchQuery === '' || 
                contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (contact.bookRequestTitle && contact.bookRequestTitle.toLowerCase().includes(searchQuery.toLowerCase()));

            // Status filter
            const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;

            // Topic filter
            const matchesTopic = selectedTopic === 'all' || contact.topic === selectedTopic;

            return matchesSearch && matchesStatus && matchesTopic;
        });
    }, [contacts, searchQuery, selectedStatus, selectedTopic]);

    // Handle status change
    const handleStatusChange = async (contactId, newStatus, currentAdminNotes = '') => {
        const isReply = newStatus === 'responded';
        const { value: adminNotes } = await Swal.fire({
            title: isReply ? 'Gửi phản hồi tới khách hàng' : 'Cập nhật trạng thái',
            input: 'textarea',
            inputLabel: isReply
                ? 'Nội dung phản hồi (sẽ gửi thông báo tới khách hàng)'
                : 'Ghi chú của admin (tùy chọn)',
            inputValue: currentAdminNotes,
            inputPlaceholder: isReply ? 'Nhập nội dung phản hồi cho khách hàng...' : 'Nhập ghi chú...',
            showCancelButton: true,
            confirmButtonText: isReply ? 'Gửi phản hồi' : 'Cập nhật',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#8B5CF6',
            ...(isReply && {
                icon: 'info',
                footer: '<span style="color:#6B7280;font-size:12px">📧 Khách hàng sẽ nhận được thông báo ngay sau khi bạn gửi</span>',
            }),
        });

        if (adminNotes !== undefined) {
            try {
                await updateContact({ id: contactId, status: newStatus, adminNotes }).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Cập nhật trạng thái thành công!',
                    confirmButtonColor: '#8B5CF6',
                });
                refetch();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Cập nhật trạng thái thất bại. Vui lòng thử lại.',
                    confirmButtonColor: '#8B5CF6',
                });
            }
        }
    };

    // Handle delete
    const handleDelete = async (contactId, contactName) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc muốn xóa yêu cầu của ${contactName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await deleteContact(contactId).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'Đã xóa!',
                    text: 'Xóa yêu cầu thành công.',
                    confirmButtonColor: '#8B5CF6',
                });
                refetch();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Xóa yêu cầu thất bại. Vui lòng thử lại.',
                    confirmButtonColor: '#8B5CF6',
                });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-xl">Đang tải...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-xl text-red-500">Lỗi: {error?.message || 'Không thể tải dữ liệu'}</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <MdEmail className="text-secondary" />
                    Quản lý yêu cầu liên hệ
                </h1>
                <p className="text-gray-600 mt-2">Quản lý các yêu cầu liên hệ và yêu cầu sách từ khách hàng</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-gray-400">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Tổng yêu cầu</p>
                            <p className="text-3xl font-bold text-gray-700">{stats.total}</p>
                        </div>
                        <MdEmail className="text-4xl text-gray-400" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-yellow-400">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Chờ xử lý</p>
                            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <FiClock className="text-4xl text-yellow-400" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-blue-400">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Đã phản hồi</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.responded}</p>
                        </div>
                        <FiMessageCircle className="text-4xl text-blue-400" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-green-400">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Đã giải quyết</p>
                            <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                        </div>
                        <FiCheckCircle className="text-4xl text-green-400" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-purple-400">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Yêu cầu sách</p>
                            <p className="text-3xl font-bold text-purple-600">{stats.bookRequests}</p>
                        </div>
                        <MdBook className="text-4xl text-purple-400" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, email, chủ đề, sách..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent appearance-none cursor-pointer min-w-[180px]"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="responded">Đã phản hồi</option>
                            <option value="resolved">Đã giải quyết</option>
                        </select>
                    </div>

                    {/* Topic Filter */}
                    <div className="relative">
                        <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                        <select
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent appearance-none cursor-pointer min-w-[200px]"
                        >
                            <option value="all">Tất cả chủ đề</option>
                            {CONTACT_TOPICS.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    Hiển thị {filteredContacts.length} / {contacts.length} yêu cầu
                </div>
            </div>

            {/* Contacts Table */}
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                {filteredContacts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Không tìm thấy yêu cầu nào
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Chủ đề
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tiêu đề
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Yêu cầu sách
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày tạo
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredContacts.map((contact) => (
                                    <React.Fragment key={contact._id}>
                                        <tr 
                                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => setExpandedContact(expandedContact === contact._id ? null : contact._id)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                                        <div className="text-sm text-gray-500">{contact.email}</div>
                                                        {contact.phone && (
                                                            <div className="text-sm text-gray-500">📞 {contact.phone}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {contact.topic && topicMap[contact.topic] ? (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${topicMap[contact.topic].color}`}>
                                                        {topicMap[contact.topic].label}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs truncate">{contact.subject}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {contact.bookRequestTitle ? (
                                                    <div className="flex items-center gap-1 text-sm text-purple-600">
                                                        <MdBook className="text-lg" />
                                                        <span className="max-w-xs truncate">{contact.bookRequestTitle}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[contact.status].color}`}>
                                                    {statusConfig[contact.status].icon}
                                                    {statusConfig[contact.status].label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(contact.createdAt).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <select
                                                    value={contact.status}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusChange(contact._id, e.target.value, contact.adminNotes);
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="mr-2 px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-secondary"
                                                >
                                                    <option value="pending">Chờ xử lý</option>
                                                    <option value="responded">Đã phản hồi</option>
                                                    <option value="resolved">Đã giải quyết</option>
                                                </select>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(contact._id, contact.name);
                                                    }}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                >
                                                    <FiTrash2 className="inline h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedContact === contact._id && (
                                            <tr className="bg-gray-50">
                                                <td colSpan="7" className="px-6 py-4">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-gray-700 mb-1">Tin nhắn:</h4>
                                                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{contact.message}</p>
                                                        </div>
                                                        {contact.adminNotes && (
                                                            <div>
                                                                <h4 className="text-sm font-semibold text-gray-700 mb-1">Ghi chú của admin:</h4>
                                                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{contact.adminNotes}</p>
                                                            </div>
                                                        )}
                                                        <div className="text-xs text-gray-500">
                                                            Cập nhật lần cuối: {new Date(contact.updatedAt).toLocaleDateString('vi-VN', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageForms;
