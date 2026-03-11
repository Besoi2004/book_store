import React, { useState, useMemo } from 'react'
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/books/booksApi';
import { formatVND } from '../../../utils/formatVND';
import { getImgUrl } from '../../../utils/getImgUrl';
import { getCategoryLabel } from '../../../utils/categories.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { HiViewGridAdd } from 'react-icons/hi';
import { MdBook, MdSearch, MdFilterList } from 'react-icons/md';
import Swal from 'sweetalert2';

const ManageBooks = () => {
    const navigate = useNavigate();

    const {data: books, refetch} = useFetchAllBooksQuery()

    const [deleteBook] = useDeleteBookMutation()

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedStockLevel, setSelectedStockLevel] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Get unique categories from books
    const categories = useMemo(() => {
        if (!books) return [];
        const uniqueCategories = [...new Set(books.map(book => book.category))];
        return uniqueCategories.sort();
    }, [books]);

    // Filter books based on all filter criteria
    const filteredBooks = useMemo(() => {
        if (!books) return [];

        return books.filter(book => {
            // Search filter (title, author or publisher)
            const matchesSearch = searchQuery === '' || 
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (book.publisher && book.publisher.toLowerCase().includes(searchQuery.toLowerCase()));

            // Category filter
            const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;

            // Status filter
            const matchesStatus = selectedStatus === 'all' || 
                (selectedStatus === 'flash-sale' && book.status === 'flash-sale') ||
                (selectedStatus === 'normal' && !book.status);

            // Stock level filter
            const matchesStockLevel = selectedStockLevel === 'all' ||
                (selectedStockLevel === 'out-of-stock' && book.stock === 0) ||
                (selectedStockLevel === 'low-stock' && book.stock > 0 && book.stock < 10) ||
                (selectedStockLevel === 'in-stock' && book.stock >= 10);

            return matchesSearch && matchesCategory && matchesStatus && matchesStockLevel;
        });
    }, [books, searchQuery, selectedCategory, selectedStatus, selectedStockLevel]);

    React.useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategory, selectedStatus, selectedStockLevel]);

    const paginatedBooks = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBooks.slice(start, start + itemsPerPage);
    }, [filteredBooks, currentPage, itemsPerPage]);
    const totalPages = Math.ceil((filteredBooks?.length || 0) / itemsPerPage);

    // Reset all filters
    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedStatus('all');
        setSelectedStockLevel('all');
    };

    // Handle deleting a book
    const handleDeleteBook = async (id, title) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa sách',
            html: `Bạn có chắc muốn xóa sách <strong>"${title}"</strong>?<br/><span class="text-sm text-gray-500">Hành động này không thể hoàn tác.</span>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (!result.isConfirmed) return;

        try {
            await deleteBook(id).unwrap();
            Swal.fire({
                title: 'Đã xóa!',
                text: `Sách "${title}" đã được xóa thành công.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            refetch();
        } catch (error) {
            console.error('Failed to delete book:', error.message);
            Swal.fire('Lỗi!', 'Xóa sách thất bại. Vui lòng thử lại.', 'error');
        }
    };

    // Handle navigating to Edit Book page
    const handleEditClick = (id) => {
        navigate(`/dashboard/edit-book/${id}`);
    };

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý sách</h1>
          <p className="text-gray-600">
            Danh sách tất cả sách trong hệ thống 
            ({filteredBooks?.length || 0} / {books?.length || 0} sách)
          </p>
        </div>
        <Link 
          to="/dashboard/add-new-book" 
          className="inline-flex items-center px-5 py-3 text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <HiViewGridAdd className="h-5 w-5 mr-2" />
          Thêm sách mới
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-4">
          <MdFilterList className="h-5 w-5 text-purple-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search by title/author */}
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
                placeholder="Tên sách, tác giả hoặc NXB..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category} value={category}>{getCategoryLabel(category)}</option>
              ))}
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
              <option value="flash-sale">Flash Sale</option>
              <option value="normal">Bình thường</option>
            </select>
          </div>

          {/* Stock level filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tồn kho
            </label>
            <select
              value={selectedStockLevel}
              onChange={(e) => setSelectedStockLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="all">Tất cả mức kho</option>
              <option value="in-stock">Còn hàng (≥10)</option>
              <option value="low-stock">Sắp hết (1-9)</option>
              <option value="out-of-stock">Hết hàng (0)</option>
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
          
          {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedStockLevel !== 'all') && (
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-purple-600">{filteredBooks?.length}</span> kết quả được tìm thấy
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
                    <MdBook className="h-6 w-6 text-purple-600 mr-2" />
                    <h3 className="font-bold text-lg text-gray-800">Danh sách sách</h3>
                  </div>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <span className="text-sm text-gray-600">Tổng: <span className="font-bold text-purple-600">{filteredBooks?.length || 0}</span> sách</span>
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
                      Ảnh bìa
                    </th>
                    <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                      Tên sách
                    </th>
                    <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                      Tác giả
                    </th>
                    <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                      Nhà xuất bản
                    </th>
                    <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                      Danh mục
                    </th>
                    <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                      Giá cũ
                    </th>
                    <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                      Giá bán
                    </th>
                    <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap">
                      Kho
                    </th>
                    <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap">
                      Điểm thưởng
                    </th>
                    <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap">
                      Yêu thích
                    </th>
                    <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap">
                      Trạng thái
                    </th>
                    <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-left whitespace-nowrap">
                      Ngày phát hành
                    </th>
                    <th className="px-4 text-gray-700 align-middle border border-solid border-gray-200 py-3 text-xs font-bold text-center whitespace-nowrap sticky right-0 bg-gray-100">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBooks && filteredBooks.length > 0 ? (
                    paginatedBooks.map((book, index) => (
                      <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                        <th className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-left text-gray-700 font-medium whitespace-nowrap">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </th>
                        <td className="border-t px-4 align-middle border-gray-200 text-xs p-3">
                          <img 
                            src={getImgUrl(book.coverImage)} 
                            alt={book.title}
                            className="h-16 w-12 object-cover rounded shadow-sm"
                          />
                        </td>
                        <td className="border-t px-4 align-middle border-gray-200 text-xs p-3">
                          <div className="max-w-xs">
                            <div className="font-medium text-gray-800 line-clamp-2">{book.title}</div>
                          </div>
                        </td>
                        <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 whitespace-nowrap">
                          <span className="text-gray-700">{book.author || 'Đang cập nhật'}</span>
                        </td>
                        <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 whitespace-nowrap">
                          <span className="text-gray-700">{book.publisher || 'Đang cập nhật'}</span>
                        </td>
                        <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {getCategoryLabel(book.category)}
                          </span>
                        </td>
                        <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 whitespace-nowrap">
                          <span className="text-gray-500 line-through">{formatVND(book.oldPrice)}</span>
                        </td>
                        <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 whitespace-nowrap">
                          <span className="font-bold text-purple-600">{formatVND(book.newPrice)}</span>
                        </td>
                        <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full font-semibold ${
                            book.stock === 0 ? 'bg-red-100 text-red-800' : 
                            book.stock < 10 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {book.stock}
                          </span>
                        </td>
                        <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center whitespace-nowrap">
                          <span className="font-semibold text-amber-600">{book.rewardPoints || 0}</span>
                        </td>
                        <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center whitespace-nowrap">
                          <span className="font-semibold text-pink-600">{book.favorites || 0}</span>
                        </td>
                        <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center whitespace-nowrap">
                          {book.status ? (
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              book.status === 'flash-sale' ? 'bg-red-100 text-red-800' : 
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {book.status === 'flash-sale' ? 'Flash Sale' : book.status}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 whitespace-nowrap">
                          <span className="text-gray-700">
                            {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString('vi-VN') : '-'}
                          </span>
                        </td>
                        <td className="border-t px-4 align-middle border-gray-200 text-xs p-3 text-center whitespace-nowrap sticky right-0 bg-white">
                          <div className="flex items-center justify-center space-x-2">
                            <Link 
                              to={`/dashboard/edit-book/${book._id}`} 
                              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300"
                            >
                              Sửa
                            </Link>
                            <button 
                              onClick={() => handleDeleteBook(book._id, book.title)}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-300"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr> 
                    ))
                  ) : (
                    <tr>
                      <td colSpan="14" className="border-t px-4 align-middle border-gray-200 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <MdBook className="h-16 w-16 text-gray-300 mb-3" />
                          <p className="text-lg font-semibold mb-1">Không tìm thấy sách</p>
                          <p className="text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {filteredBooks.length > 0 && (
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
                  <span className="text-gray-500 ml-1">/ trang &nbsp;·&nbsp; {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredBooks.length)} / {filteredBooks.length} sách</span>
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

export default ManageBooks
