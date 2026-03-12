import React, { useState, useMemo, useEffect } from 'react'
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi'
import BookCard from '../books/BookCard'
import Loading from '../../components/Loading'
import Categories from './Categories'
import { FiSearch, FiGrid, FiList, FiBook } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'
import { getCategoryLabel } from '../../utils/categories.jsx'

const Shop = () => {
    const { data: books = [], isLoading, isError } = useFetchAllBooksQuery()
    const [searchParams, setSearchParams] = useSearchParams()
    const categoryParam = searchParams.get('category')
    
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [filterCategory, setFilterCategory] = useState(categoryParam || 'all')
    const [viewMode, setViewMode] = useState('grid')
    const [currentPage, setCurrentPage] = useState(1)
    const BOOKS_PER_PAGE = 20

    // Sync filterCategory with URL param when it changes
    useEffect(() => {
        if (categoryParam) {
            setFilterCategory(categoryParam)
            // Scroll to top when category changes
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            setFilterCategory('all')
        }
    }, [categoryParam])

    // Filter and sort books
    const filteredBooks = useMemo(() => {
        let result = [...books]

        // Search filter
        if (searchTerm) {
            const lower = searchTerm.toLowerCase()
            result = result.filter(book =>
                book.title.toLowerCase().includes(lower) ||
                book.author?.toLowerCase().includes(lower) ||
                book.publisher?.toLowerCase().includes(lower) ||
                book.description?.toLowerCase().includes(lower)
            )
        }

        // Category filter
        if (filterCategory && filterCategory !== 'all') {
            result = result.filter(book => 
                book.category?.toLowerCase() === filterCategory.toLowerCase()
            )
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
            case 'price-low':
                result.sort((a, b) => a.newPrice - b.newPrice)
                break
            case 'price-high':
                result.sort((a, b) => b.newPrice - a.newPrice)
                break
            case 'name-az':
                result.sort((a, b) => a.title.localeCompare(b.title))
                break
            case 'most-liked':
                result.sort((a, b) => (b.favorites || 0) - (a.favorites || 0))
                break
            default:
                break
        }

        return result
    }, [books, searchTerm, filterCategory, sortBy])

    // Reset to page 1 whenever filters/sort change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, filterCategory, sortBy])

    const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE)
    const paginatedBooks = filteredBooks.slice(
        (currentPage - 1) * BOOKS_PER_PAGE,
        currentPage * BOOKS_PER_PAGE
    )

    if (isLoading) return <Loading />
    if (isError) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4">😕</div>
                <p className="text-xl font-semibold text-gray-700">Không thể tải sách</p>
                <p className="text-gray-500 mt-2">Vui lòng thử lại sau</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Categories */}
            <div className="pt-8">
                <Categories />
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filters Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sách, tác giả, NXB..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Sort + View mode */}
                        <div className="flex gap-3 flex-wrap">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all cursor-pointer bg-white"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="most-liked">Yêu thích nhất</option>
                                <option value="price-low">Giá thấp đến cao</option>
                                <option value="price-high">Giá cao đến thấp</option>
                                <option value="name-az">Tên A-Z</option>
                            </select>

                            {/* View Mode Toggle */}
                            <div className="hidden md:flex gap-2 bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${
                                        viewMode === 'grid' 
                                            ? 'bg-white shadow-md text-purple-600' 
                                            : 'text-gray-600 hover:text-purple-600'
                                    }`}
                                >
                                    <FiGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${
                                        viewMode === 'list' 
                                            ? 'bg-white shadow-md text-purple-600' 
                                            : 'text-gray-600 hover:text-purple-600'
                                    }`}
                                >
                                    <FiList className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tags */}
                    {(searchTerm || filterCategory !== 'all') && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                            {searchTerm && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
                                    Tìm kiếm: "{searchTerm}"
                                    <button onClick={() => setSearchTerm('')} className="hover:text-purple-900 font-bold">×</button>
                                </span>
                            )}
                            {filterCategory !== 'all' && (
                                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm flex items-center gap-2">
                                    {getCategoryLabel(filterCategory)}
                                    <button onClick={() => {
                                        setFilterCategory('all')
                                        setSearchParams({})
                                    }} className="hover:text-pink-900 font-bold">×</button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Hiển thị <span className="font-semibold text-gray-900">
                            {Math.min((currentPage - 1) * BOOKS_PER_PAGE + 1, filteredBooks.length)}–{Math.min(currentPage * BOOKS_PER_PAGE, filteredBooks.length)}
                        </span> / <span className="font-semibold text-gray-900">{filteredBooks.length}</span> kết quả
                        {filterCategory !== 'all' && ` trong danh mục "${getCategoryLabel(filterCategory)}"`}
                        {searchTerm && ` cho "${searchTerm}"`}
                    </p>
                </div>

                {/* Books Grid */}
                {filteredBooks.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                            <FiBook className="w-16 h-16 text-purple-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy sách</h3>
                        <p className="text-gray-500 mb-6">
                            Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setFilterCategory('all')
                                setSearchParams({})
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={`grid gap-6 ${
                            viewMode === 'grid' 
                                ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
                                : 'grid-cols-1'
                        }`}>
                            {paginatedBooks.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-10">
                                <button
                                    onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    ‹ Trước
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                                    .reduce((acc, p, idx, arr) => {
                                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                                        acc.push(p)
                                        return acc
                                    }, [])
                                    .map((item, idx) =>
                                        item === '...' ? (
                                            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">…</span>
                                        ) : (
                                            <button
                                                key={item}
                                                onClick={() => { setCurrentPage(item); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                                                className={`w-10 h-10 rounded-xl border-2 font-semibold transition-all ${
                                                    currentPage === item
                                                        ? 'border-purple-500 bg-purple-500 text-white shadow-md'
                                                        : 'border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600'
                                                }`}
                                            >
                                                {item}
                                            </button>
                                        )
                                    )
                                }

                                <button
                                    onClick={() => { setCurrentPage(p => Math.min(p + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Sau ›
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Shop
