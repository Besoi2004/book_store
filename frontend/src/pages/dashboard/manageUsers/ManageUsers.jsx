import React, { useState, useMemo } from 'react'
import { useDeleteUserMutation, useFetchAllUsersQuery, useCreateAdminMutation } from '../../../redux/features/users/usersApi';
import { FaUsers, FaSearch, FaUserShield, FaUser, FaCrown, FaTrash, FaUserPlus } from 'react-icons/fa';
import { MdFilterList } from 'react-icons/md';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const { data: users, refetch } = useFetchAllUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [createAdmin] = useCreateAdminMutation();

    // Create admin modal state
    const [showCreateAdmin, setShowCreateAdmin] = useState(false);
    const [adminForm, setAdminForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [adminFormError, setAdminFormError] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedTier, setSelectedTier] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter users based on all filter criteria
    const filteredUsers = useMemo(() => {
        if (!users) return [];

        return users.filter(user => {
            // Search filter (username or email)
            const matchesSearch = searchQuery === '' || 
                user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());

            // Role filter
            const matchesRole = selectedRole === 'all' || user.role === selectedRole;

            // Tier filter
            const matchesTier = selectedTier === 'all' || user.tier === selectedTier;

            return matchesSearch && matchesRole && matchesTier;
        });
    }, [users, searchQuery, selectedRole, selectedTier]);

    React.useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedRole, selectedTier]);

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(start, start + itemsPerPage);
    }, [filteredUsers, currentPage, itemsPerPage]);
    const totalPages = Math.ceil((filteredUsers?.length || 0) / itemsPerPage);

    // Reset all filters
    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedRole('all');
        setSelectedTier('all');
    };

    // Handle creating admin account
    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setAdminFormError('');
        if (adminForm.password !== adminForm.confirmPassword) {
            setAdminFormError('Mật khẩu xác nhận không khớp!');
            return;
        }
        if (adminForm.password.length < 6) {
            setAdminFormError('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }
        setIsCreating(true);
        try {
            await createAdmin({
                username: adminForm.username,
                email: adminForm.email,
                password: adminForm.password,
            }).unwrap();
            setShowCreateAdmin(false);
            setAdminForm({ username: '', email: '', password: '', confirmPassword: '' });
            Swal.fire({
                icon: 'success',
                title: 'Tạo thành công!',
                html: `Tài khoản admin <strong>${adminForm.username}</strong> đã được tạo.`,
                timer: 2000,
                showConfirmButton: false,
            });
            refetch();
        } catch (err) {
            setAdminFormError(err?.data?.message || 'Tạo thất bại. Vui lòng thử lại.');
        } finally {
            setIsCreating(false);
        }
    };

    // Handle deleting a user
    const handleDeleteUser = async (id, username) => {        const result = await Swal.fire({
            title: 'Xóa người dùng?',
            html: `Bạn có chắc chắn muốn xóa <strong>${username}</strong>? Hành động này không thể hoàn tác.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });
        if (!result.isConfirmed) return;

        try {
            await deleteUser(id).unwrap();
            Swal.fire({ icon: 'success', title: 'Xóa thành công!', text: `Người dùng “${username}” đã bị xóa.`, timer: 1500, showConfirmButton: false });
            refetch();
        } catch (error) {
            console.error('Failed to delete user:', error);
            Swal.fire({ icon: 'error', title: 'Xóa thất bại!', text: error?.data?.message || 'Vui lòng thử lại.' });
        }
    };

    // Get tier badge color
    const getTierBadgeColor = (tier) => {
        switch (tier) {
            case 'diamond':
                return 'bg-purple-100 text-purple-800';
            case 'gold':
                return 'bg-yellow-100 text-yellow-800';
            case 'silver':
                return 'bg-gray-100 text-gray-800';
            case 'bronze':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get tier icon
    const getTierIcon = (tier) => {
        switch (tier) {
            case 'diamond':
            case 'gold':
                return <FaCrown className="inline mr-1" />;
            default:
                return null;
        }
    };

    return (
        <>
            {/* Create Admin Modal */}
            {showCreateAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <FaUserShield className="text-purple-600 h-5 w-5" />
                                <h2 className="text-lg font-bold text-gray-800">Tạo tài khoản Admin</h2>
                            </div>
                            <button onClick={() => { setShowCreateAdmin(false); setAdminFormError(''); }}
                                className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold">&times;</button>
                        </div>
                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                                <input
                                    type="text" required
                                    value={adminForm.username}
                                    onChange={e => setAdminForm(f => ({ ...f, username: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none text-sm"
                                    placeholder="admin2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email" required
                                    value={adminForm.email}
                                    onChange={e => setAdminForm(f => ({ ...f, email: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none text-sm"
                                    placeholder="admin2@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                                <input
                                    type="password" required
                                    value={adminForm.password}
                                    onChange={e => setAdminForm(f => ({ ...f, password: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none text-sm"
                                    placeholder="ít nhất 6 ký tự"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                                <input
                                    type="password" required
                                    value={adminForm.confirmPassword}
                                    onChange={e => setAdminForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none text-sm"
                                    placeholder="nhập lại mật khẩu"
                                />
                            </div>
                            {adminFormError && (
                                <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{adminFormError}</p>
                            )}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { setShowCreateAdmin(false); setAdminFormError(''); }}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all">
                                    Hủy
                                </button>
                                <button type="submit" disabled={isCreating}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition-all inline-flex items-center justify-center gap-2">
                                    <FaUserPlus className="h-4 w-4" />
                                    {isCreating ? 'Đang tạo...' : 'Tạo Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Page Header */}
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý người dùng</h1>
                    <p className="text-gray-600">
                        Danh sách tất cả người dùng trong hệ thống
                        ({filteredUsers?.length || 0} / {users?.length || 0} người dùng)
                    </p>
                </div>
                <button
                    onClick={() => { setAdminForm({ username: '', email: '', password: '', confirmPassword: '' }); setAdminFormError(''); setShowCreateAdmin(true); }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow transition-all"
                >
                    <FaUserPlus className="h-4 w-4" />
                    Tạo tài khoản Admin
                </button>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                <div className="flex items-center mb-4">
                    <MdFilterList className="h-5 w-5 text-purple-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Search by username/email */}
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
                                placeholder="Tên người dùng hoặc email..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Role filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vai trò
                        </label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                            <option value="all">Tất cả vai trò</option>
                            <option value="user">Người dùng</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                    </div>

                    {/* Tier filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hạng thành viên
                        </label>
                        <select
                            value={selectedTier}
                            onChange={(e) => setSelectedTier(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                            <option value="all">Tất cả hạng</option>
                            <option value="bronze">Đồng</option>
                            <option value="silver">Bạc</option>
                            <option value="gold">Vàng</option>
                            <option value="diamond">Kim cương</option>
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
                    
                    {(searchQuery || selectedRole !== 'all' || selectedTier !== 'all') && (
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold text-purple-600">{filteredUsers?.length}</span> kết quả được tìm thấy
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
                                        <FaUsers className="h-6 w-6 text-purple-600 mr-2" />
                                        <h3 className="font-bold text-lg text-gray-800">Danh sách người dùng</h3>
                                    </div>
                                </div>
                                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                                    <span className="text-sm text-gray-600">
                                        Tổng: <span className="font-bold text-purple-600">{filteredUsers?.length || 0}</span> người dùng
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
                                            Tên người dùng
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                                            Email
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap">
                                            Vai trò
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap">
                                            Hạng thành viên
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap">
                                            Điểm thưởng
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                                            Số điện thoại
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                                            Thành phố
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                                            Ngày tạo
                                        </th>
                                        <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap sticky right-0 bg-gray-100">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredUsers && filteredUsers.length > 0 ? (
                                        paginatedUsers.map((user, index) => (
                                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                                <th className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-left text-gray-700 font-medium whitespace-nowrap">
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </th>
                                                <td className="border-t px-4 align-middle border-gray-200 text-xs p-3">
                                                    <div className="flex items-center">
                                                        {user.avatar ? (
                                                            <img 
                                                                src={user.avatar} 
                                                                alt={user.username}
                                                                className="h-10 w-10 rounded-full object-cover mr-3"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                                                <FaUser className="text-purple-600" />
                                                            </div>
                                                        )}
                                                        <span className="font-medium text-gray-800">{user.username}</span>
                                                    </div>
                                                </td>
                                                <td className="border-t px-4 align-middle border-gray-200 text-xs p-3">
                                                    <span className="text-gray-700">{user.email}</span>
                                                </td>
                                                <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center">
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center ${
                                                        user.role === 'admin' 
                                                            ? 'bg-red-100 text-red-800' 
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {user.role === 'admin' ? (
                                                            <>
                                                                <FaUserShield className="mr-1" />
                                                                Quản trị viên
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaUser className="mr-1" />
                                                                Người dùng
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center">
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTierBadgeColor(user.tier)}`}>
                                                        {getTierIcon(user.tier)}
                                                        {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center">
                                                    <span className="font-bold text-amber-600">{user.rewardPoints || 0}</span>
                                                </td>
                                                <td className="border-t px-4 align-middle border-gray-200 text-xs p-3">
                                                    <span className="text-gray-700">{user.phone || '-'}</span>
                                                </td>
                                                <td className="border-t px-4 align-middle border-gray-200 text-xs p-3">
                                                    <span className="text-gray-700">{user.city || '-'}</span>
                                                </td>
                                                <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 whitespace-nowrap">
                                                    <span className="text-gray-700">
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-'}
                                                    </span>
                                                </td>
                                                <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center whitespace-nowrap sticky right-0 bg-white">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        {user.role !== 'admin' && (
                                                            <button 
                                                                onClick={() => handleDeleteUser(user._id, user.username)}
                                                                className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-300 inline-flex items-center"
                                                            >
                                                                <FaTrash className="mr-1" />
                                                                Xóa
                                                            </button>
                                                        )}
                                                        {user.role === 'admin' && (
                                                            <span className="text-xs text-gray-400 italic">Quản trị viên</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr> 
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="border-t px-4 align-middle border-gray-200 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <FaUsers className="h-16 w-16 text-gray-300 mb-3" />
                                                    <p className="text-lg font-semibold mb-1">Không tìm thấy người dùng</p>
                                                    <p className="text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        {filteredUsers.length > 0 && (
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
                                    <span className="text-gray-500 ml-1">/ trang &nbsp;·&nbsp; {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredUsers.length)} / {filteredUsers.length} người dùng</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">‹</button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).reduce((acc, p, i, arr) => { if (i > 0 && arr[i - 1] !== p - 1) acc.push('...'); acc.push(p); return acc; }, []).map((item, i) => item === '...' ? (<span key={`e-${i}`} className="px-2 text-gray-400">…</span>) : (<button key={item} onClick={() => setCurrentPage(item)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${currentPage === item ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>{item}</button>))}
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">›</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default ManageUsers
