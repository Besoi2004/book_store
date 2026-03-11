import React, { useState, useEffect } from 'react'
import { FiShoppingCart, FiHeart, FiZap, FiPackage, FiBook, FiUser, FiCalendar, FiTag, FiTruck, FiShield, FiMinus, FiPlus, FiGift, FiStar } from "react-icons/fi"
import { useParams, Link, useNavigate } from "react-router-dom"

import { getImgUrl } from '../../utils/getImgUrl';
import { formatVND } from '../../utils/formatVND';
import { getCategoryLabel } from '../../utils/categories.jsx';
import { useDispatch } from 'react-redux';

import { useFetchBookByIdQuery, useFetchAllBooksQuery, useToggleFavoriteMutation } from '../../redux/features/books/booksApi';
import { addToCart } from '../../redux/features/cart/cartSlide';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import getBaseURL from '../../utils/baseURL';

const SingleBook = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {data: book, isLoading, isError} = useFetchBookByIdQuery(id);
    const {data: allBooks} = useFetchAllBooksQuery();
    const [quantity, setQuantity] = useState(1);
    const { currentUser } = useAuth();
    const [toggleFavorite] = useToggleFavoriteMutation();
    const [isFavorited, setIsFavorited] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(0);

    const dispatch =  useDispatch();

    // Check if book is in user's favorites
    useEffect(() => {
        const checkFavorite = async () => {
            if (currentUser?.email && book) {
                try {
                    const response = await axios.get(`${getBaseURL()}/api/users/${currentUser.email}/favorites`);
                    const favoriteBooks = response.data.favoriteBooks || [];
                    setIsFavorited(favoriteBooks.some(favBook => favBook._id === book._id));
                    setFavoritesCount(book?.favorites || 0);
                } catch (error) {
                    console.error("Error checking favorite:", error);
                }
            } else if (book) {
                setFavoritesCount(book?.favorites || 0);
            }
        };
        checkFavorite();
    }, [currentUser, book]);

    const handleAddToCart = (product) => {
        // Add product with selected quantity
        for (let i = 0; i < quantity; i++) {
            dispatch(addToCart(product));
        }
        
        // Show success message with quantity
        if (quantity > 1) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Đã thêm ${quantity} sản phẩm vào giỏ hàng`,
                showConfirmButton: false,
                timer: 1500
            });
        }
    }

    const handleBuyNow = (product) => {
        // Add product with selected quantity
        for (let i = 0; i < quantity; i++) {
            dispatch(addToCart(product));
        }
        
        // Navigate to cart
        navigate('/cart');
    }

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!currentUser) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng đăng nhập',
                text: 'Bạn cần đăng nhập để thêm sách vào yêu thích',
                confirmButtonColor: '#8b5cf6',
            });
            return;
        }

        try {
            const result = await toggleFavorite({ 
                bookId: book._id, 
                email: currentUser.email 
            }).unwrap();
            
            setIsFavorited(result.isFavorited);
            setFavoritesCount(result.bookFavorites);
            
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: result.isFavorited ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích',
                showConfirmButton: false,
                timer: 1000
            });
        } catch (error) {
            console.error("Error toggling favorite:", error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể cập nhật yêu thích',
            });
        }
    }

    const incrementQuantity = () => {
        if (quantity < book?.stock) {
            setQuantity(quantity + 1);
        }
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    if(isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
                <p className="text-xl font-semibold text-gray-700">Đang tải thông tin sách...</p>
            </div>
        </div>
    )
    
    if(isError) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4">😕</div>
                <p className="text-xl font-semibold text-gray-700">Không thể tải thông tin sách</p>
                <p className="text-gray-500 mt-2">Vui lòng thử lại sau</p>
            </div>
        </div>
    )

    const isLowStock = book?.stock < 10;
    const stockPercentage = Math.min((book?.stock / 100) * 100, 100);
    
    // Calculate reward points (5% of price)
    const rewardPoints = book?.rewardPoints || 0;
    
    // Filter related books by same category, excluding current book
    const relatedBooks = allBooks?.filter(b => b.category === book?.category && b._id !== book?._id).slice(0, 4) || [];
    
    // Generate star rating
    const StarRating = ({ rating = 5 }) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                    <svg
                        key={index}
                        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`}
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };
    
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
                <span>Trang chủ</span>
                <span>›</span>
                <span className="capitalize">{getCategoryLabel(book?.category)}</span>
                <span>›</span>
                <span className="text-gray-900 font-semibold truncate">{book?.title}</span>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-5 lg:p-7">
                    {/* Left - Image Section (2/5) */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-24">
                            {/* Status badges */}
                            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                {book.status === 'flash-sale' && (
                                    <div className='bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse'>
                                        <FiZap className='w-4 h-4' />
                                        <span className='text-xs font-bold'>FLASH SALE</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Favorite button */}
                            <button 
                                onClick={handleToggleFavorite}
                                className={`absolute top-3 right-3 z-10 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:scale-110 transition-all duration-300 border ${
                                    isFavorited 
                                        ? 'bg-red-500 text-white border-red-600' 
                                        : 'bg-white/95 text-gray-600 hover:bg-red-500 hover:text-white border-gray-100'
                                }`}
                            >
                                <FiHeart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                            </button>

                            {/* Book Image */}
                            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-xl p-8 shadow-md relative">
                                <img
                                    src={`${getImgUrl(book.coverImage)}`}
                                    alt={book.title}
                                    className={`w-full h-auto object-contain rounded-lg shadow-xl hover:scale-105 transition-transform duration-500 ${
                                        book?.stock === 0 ? 'grayscale opacity-60' : ''
                                    }`}
                                />
                                {book?.stock === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
                                        <div className="bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-2xl shadow-2xl">
                                            HẾT HÀNG
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Stock indicator */}
                            {book?.stock === 0 ? (
                                <div className="mt-4">
                                    <div className="relative h-8 bg-gradient-to-r from-gray-600 to-gray-800 overflow-hidden rounded-lg shadow-md">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="flex items-center gap-2 text-white font-bold text-sm">
                                                <span className="text-lg">❌</span>
                                                <span>Sản phẩm đã hết hàng</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : book?.stock > 0 ? (
                                <div className="mt-4">
                                    <div className={`relative h-8 ${isLowStock ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'} overflow-hidden rounded-lg shadow-md`}>
                                        <div 
                                            className="h-full bg-white/20 transition-all duration-500"
                                            style={{ width: `${100 - Math.max(stockPercentage, 5)}%`, marginLeft: 'auto' }}
                                        ></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="flex items-center gap-2 text-white font-bold text-sm">
                                                {isLowStock ? (
                                                    <>
                                                        <span className="text-lg animate-bounce">🔥</span>
                                                        <span>Sắp hết - Còn {book?.stock} cuốn!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiPackage className="w-4 h-4" />
                                                        <span>Còn {book?.stock} cuốn</span>
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {/* Shipping info */}
                            <div className="mt-4 space-y-2.5">
                                <div className="flex items-center gap-2.5 bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    <div className="bg-blue-500 p-2 rounded-lg">
                                        <FiTruck className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Giao hàng tiêu chuẩn</p>
                                        <p className="text-xs text-gray-600">Miễn phí từ 2-5 ngày</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 bg-green-50 p-3 rounded-lg border border-green-200">
                                    <div className="bg-green-500 p-2 rounded-lg">
                                        <FiShield className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Đổi trả miễn phí</p>
                                        <p className="text-xs text-gray-600">Trong vòng 7 ngày</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Info Section (3/5) */}
                    <div className="lg:col-span-3 flex flex-col">
                        {/* Title */}
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                            {book.title}
                        </h1>

                        {/* Rating, Favorites, and Sold */}
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <StarRating rating={5} />
                            </div>
                            <span className="text-gray-400">|</span>
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <FiHeart className="w-4 h-4 text-red-500" />
                                <span className="text-sm">{favoritesCount} yêu thích</span>
                            </div>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-600 text-sm">Đã bán 500+</span>
                        </div>

                        {/* Price Section */}
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 mb-4 border-2 border-orange-200">
                            <div className="flex flex-wrap items-end gap-3 mb-2">
                                <span className="text-3xl sm:text-4xl font-bold text-red-600">
                                    {formatVND(book?.newPrice)}
                                </span>
                                {book?.oldPrice && (
                                    <>
                                        <span className="text-lg sm:text-xl line-through text-gray-500 mb-1">
                                            {formatVND(book?.oldPrice)}
                                        </span>
                                        <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-lg font-bold shadow-md mb-1">
                                            -{Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100)}%
                                        </span>
                                    </>
                                )}
                            </div>
                            {/* Reward Points Badge */}
                            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg w-fit">
                                <FiGift className="w-4 h-4" />
                                <span className="text-sm font-bold">+{rewardPoints} điểm thưởng khi mua</span>
                            </div>
                        </div>

                        {/* Information Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-1.5 rounded-lg">
                                        <FiUser className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="font-semibold text-gray-700 text-sm">Tác giả</p>
                                </div>
                                <p className="text-base font-bold text-gray-900">{book.author || 'Đang cập nhật'}</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-1.5 rounded-lg">
                                        <FiTag className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="font-semibold text-gray-700 text-sm">Thể loại</p>
                                </div>
                                <p className="text-base font-bold text-gray-900">{getCategoryLabel(book?.category)}</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-1.5 rounded-lg">
                                        <FiCalendar className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="font-semibold text-gray-700 text-sm">Ngày xuất bản</p>
                                </div>
                                <p className="text-base font-bold text-gray-900">
                                    {book?.publishedDate ? new Date(book.publishedDate).toLocaleDateString('vi-VN', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    }) : 'Đang cập nhật'}
                                </p>
                            </div>

                            <div className={`bg-gradient-to-br ${isLowStock ? 'from-red-50 to-orange-50' : 'from-green-50 to-emerald-50'} rounded-lg p-3 border ${isLowStock ? 'border-red-200' : 'border-green-200'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`bg-gradient-to-br ${isLowStock ? 'from-red-500 to-orange-500' : 'from-green-500 to-emerald-500'} p-1.5 rounded-lg`}>
                                        <FiPackage className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="font-semibold text-gray-700 text-sm">Tình trạng</p>
                                </div>
                                <p className={`text-base font-bold ${isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
                                    {book?.stock > 0 ? (isLowStock ? `Sắp hết - ${book?.stock} cuốn` : `Còn hàng - ${book?.stock} cuốn`) : 'Hết hàng'}
                                </p>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2 text-base">Số lượng:</label>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                        onClick={decrementQuantity}
                                        disabled={quantity <= 1}
                                        className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed p-3 transition-colors"
                                    >
                                        <FiMinus className="w-4 h-4 text-gray-700" />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 1;
                                            if (val >= 1 && val <= book?.stock) {
                                                setQuantity(val);
                                            }
                                        }}
                                        className="w-16 text-center text-lg font-bold text-gray-900 border-none focus:outline-none"
                                    />
                                    <button
                                        onClick={incrementQuantity}
                                        disabled={quantity >= book?.stock}
                                        className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed p-3 transition-colors"
                                    >
                                        <FiPlus className="w-4 h-4 text-gray-700" />
                                    </button>
                                </div>
                                <span className="text-gray-600 text-sm">
                                    {book?.stock} sản phẩm có sẵn
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-6">
                            {/* Add to Cart Button with Gooey Effect */}
                            <button 
                                onClick={() => handleAddToCart(book)} 
                                className="gooey-button flex-1 relative z-10 px-5 py-3 font-semibold cursor-pointer border-4 border-purple-500 text-purple-600 hover:text-white transition-all duration-700 flex items-center justify-center gap-2 rounded-xl overflow-visible"
                                disabled={book?.stock === 0}
                            >
                                <div className="button-blobs absolute top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden" style={{ filter: 'url(#goo)' }}>
                                    <div className="blob blob-1" style={{
                                        backgroundColor: 'rgb(139, 92, 246)',
                                        width: '34%',
                                        height: '100%',
                                        borderRadius: '100%',
                                        position: 'absolute',
                                        transform: 'scale(1.4) translateY(125%) translateZ(0)',
                                        transition: 'all 700ms ease',
                                        left: '-5%'
                                    }}></div>
                                    <div className="blob blob-2" style={{
                                        backgroundColor: 'rgb(139, 92, 246)',
                                        width: '34%',
                                        height: '100%',
                                        borderRadius: '100%',
                                        position: 'absolute',
                                        transform: 'scale(1.4) translateY(125%) translateZ(0)',
                                        transition: 'all 700ms ease',
                                        transitionDelay: '60ms',
                                        left: '30%'
                                    }}></div>
                                    <div className="blob blob-3" style={{
                                        backgroundColor: 'rgb(139, 92, 246)',
                                        width: '34%',
                                        height: '100%',
                                        borderRadius: '100%',
                                        position: 'absolute',
                                        transform: 'scale(1.4) translateY(125%) translateZ(0)',
                                        transition: 'all 700ms ease',
                                        transitionDelay: '25ms',
                                        left: '66%'
                                    }}></div>
                                </div>
                                <FiShoppingCart className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">
                                    {book?.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                                </span>
                            </button>

                            {/* Buy Now Button with Gooey Effect */}
                            <button
                                onClick={() => handleBuyNow(book)}
                                className="gooey-button-buy flex-1 relative z-10 px-5 py-3 font-semibold cursor-pointer border-4 border-red-500 text-red-600 hover:text-white transition-all duration-700 flex items-center justify-center gap-2 rounded-xl overflow-visible"
                                disabled={book?.stock === 0}
                            >
                                <div className="button-blobs absolute top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden" style={{ filter: 'url(#goo)' }}>
                                    <div className="blob blob-1" style={{
                                        backgroundColor: 'rgb(239, 68, 68)',
                                        width: '34%',
                                        height: '100%',
                                        borderRadius: '100%',
                                        position: 'absolute',
                                        transform: 'scale(1.4) translateY(125%) translateZ(0)',
                                        transition: 'all 700ms ease',
                                        left: '-5%'
                                    }}></div>
                                    <div className="blob blob-2" style={{
                                        backgroundColor: 'rgb(239, 68, 68)',
                                        width: '34%',
                                        height: '100%',
                                        borderRadius: '100%',
                                        position: 'absolute',
                                        transform: 'scale(1.4) translateY(125%) translateZ(0)',
                                        transition: 'all 700ms ease',
                                        transitionDelay: '60ms',
                                        left: '30%'
                                    }}></div>
                                    <div className="blob blob-3" style={{
                                        backgroundColor: 'rgb(239, 68, 68)',
                                        width: '34%',
                                        height: '100%',
                                        borderRadius: '100%',
                                        position: 'absolute',
                                        transform: 'scale(1.4) translateY(125%) translateZ(0)',
                                        transition: 'all 700ms ease',
                                        transitionDelay: '25ms',
                                        left: '66%'
                                    }}></div>
                                </div>
                                <span className="relative z-10">Mua ngay</span>
                            </button>
                        </div>
                        
                        <style>{`
                            .gooey-button:hover .blob {
                                transform: scale(1.4) translateY(0) translateZ(0) !important;
                            }
                            .gooey-button:disabled {
                                opacity: 0.5;
                                cursor: not-allowed;
                            }
                            .gooey-button:disabled:hover .blob {
                                transform: scale(1.4) translateY(125%) translateZ(0) !important;
                            }
                            .gooey-button:disabled:hover {
                                color: rgb(139, 92, 246);
                            }

                            .gooey-button-buy:hover .blob {
                                transform: scale(1.4) translateY(0) translateZ(0) !important;
                            }
                            .gooey-button-buy:disabled {
                                opacity: 0.5;
                                cursor: not-allowed;
                            }
                            .gooey-button-buy:disabled:hover .blob {
                                transform: scale(1.4) translateY(125%) translateZ(0) !important;
                            }
                            .gooey-button-buy:disabled:hover {
                                color: rgb(239, 68, 68);
                            }

                            input[type="number"]::-webkit-inner-spin-button,
                            input[type="number"]::-webkit-outer-spin-button {
                                -webkit-appearance: none;
                                margin: 0;
                            }
                            input[type="number"] {
                                -moz-appearance: textfield;
                            }
                        `}</style>
                        
                        {/* SVG Filter for Gooey Effect */}
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{display: 'block', height: 0, width: 0, position: 'absolute'}}>
                            <defs>
                                <filter id="goo">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation={10} result="blur" />
                                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                                    <feBlend in="SourceGraphic" in2="goo" />
                                </filter>
                            </defs>
                        </svg>

                        {/* Description */}
                        <div className="mt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 rounded-lg">
                                    <FiBook className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Mô tả sách</h2>
                            </div>
                            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                                <p className="text-gray-700 leading-relaxed text-sm">
                                    {book.description || 'Chưa có mô tả chi tiết cho cuốn sách này.'}
                                </p>
                            </div>
                        </div>

                        {/* Detailed Information Table */}
                        <div className="mt-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">Thông tin chi tiết</h2>
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <tbody>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50 w-1/3 text-sm">Mã sản phẩm</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">{book._id}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50 text-sm">Tên nhà cung cấp</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">Tiệm Sách Hư Vô</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50 text-sm">Tác giả</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">{book.author || 'Đang cập nhật'}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50 text-sm">Nhà xuất bản</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">{book.publisher || 'Đang cập nhật'}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50 text-sm">Ngày xuất bản</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">
                                                {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString('vi-VN', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                }) : 'Đang cập nhật'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50 text-sm">Thể loại</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">{getCategoryLabel(book?.category)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Books Section */}
            {relatedBooks.length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center gap-3 mb-5">
                        <FiBook className="w-6 h-6 text-purple-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Sách cùng thể loại</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedBooks.map((relatedBook) => (
                            <Link 
                                key={relatedBook._id} 
                                to={`/books/${relatedBook._id}`}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:scale-105"
                            >
                                <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                                    {relatedBook.status === 'flash-sale' && (
                                        <div className='absolute top-2 left-2 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full shadow-md flex items-center gap-1'>
                                            <FiZap className='w-3 h-3' />
                                            <span className='text-xs font-bold'>SALE</span>
                                        </div>
                                    )}
                                    <img
                                        src={`${getImgUrl(relatedBook.coverImage)}`}
                                        alt={relatedBook.title}
                                        className="w-full h-48 object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-gray-800 mb-1 text-sm line-clamp-2 group-hover:text-purple-600 transition-colors">
                                        {relatedBook.title}
                                    </h3>
                                    <p className="text-xs text-gray-600 mb-2">{relatedBook.author || 'Tác giả không rõ'}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-red-600 font-bold text-lg">{formatVND(relatedBook.newPrice)}</span>
                                        {relatedBook.oldPrice && (
                                            <span className="text-gray-400 line-through text-sm">{formatVND(relatedBook.oldPrice)}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SingleBook