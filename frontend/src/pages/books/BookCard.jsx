import React, { useState, useEffect } from 'react'
import { FiShoppingCart, FiHeart, FiZap } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { getImgUrl } from '../../utils/getImgUrl'
import { formatVND } from '../../utils/formatVND'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlide'
import { useToggleFavoriteMutation } from '../../redux/features/books/booksApi'
import { useAuth } from '../../context/AuthContext'
import Swal from 'sweetalert2'
import axios from 'axios'
import getBaseURL from '../../utils/baseURL'

const BookCard = ({ book }) => {
    const dispatch = useDispatch();
    const { currentUser } = useAuth();
    const [toggleFavorite] = useToggleFavoriteMutation();
    const [isFavorited, setIsFavorited] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(book?.favorites || 0);

    // Check if book is in user's favorites
    useEffect(() => {
        const checkFavorite = async () => {
            if (currentUser?.email) {
                try {
                    const response = await axios.get(`${getBaseURL()}/api/users/${currentUser.email}/favorites`);
                    const favoriteBooks = response.data.favoriteBooks || [];
                    setIsFavorited(favoriteBooks.some(favBook => favBook._id === book._id));
                } catch (error) {
                    console.error("Error checking favorite:", error);
                }
            }
        };
        checkFavorite();
    }, [currentUser, book._id]);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
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

    const isLowStock = book?.stock < 10 && book?.stock > 0;
    const isOutOfStock = book?.stock === 0;
    const stockPercentage = Math.min((book?.stock / 100) * 100, 100);
    return (
        <div className="group bg-white rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-stretch gap-4 p-4 flex-1">
                {/* Image Section */}
                <div className="sm:h-64 sm:w-44 sm:flex-shrink-0 relative overflow-hidden rounded-xl bg-gradient-to-br from-soft-blue to-soft-pink">
                    <Link to={`/books/${book._id}`} className="block h-full">
                        {/* Status badges */}
                        {isOutOfStock ? (
                            <div className='absolute top-2 left-2 z-10'>
                                <div className='bg-gradient-to-r from-gray-600 to-gray-800 text-white px-2.5 py-1 rounded-full shadow-lg'>
                                    <span className='text-xs font-bold'>HẾT HÀNG</span>
                                </div>
                            </div>
                        ) : book.status === 'flash-sale' ? (
                            <div className='absolute top-2 left-2 z-10'>
                                <div className='bg-gradient-to-r from-red-500 to-orange-500 text-white px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1'>
                                    <FiZap className='w-3 h-3' />
                                    <span className='text-xs font-bold'>FLASH SALE</span>
                                </div>
                            </div>
                        ) : null}
                        
                        {/* Favorite Button */}
                        <div className='absolute top-2 right-2 z-10 flex flex-col items-end gap-1.5'>
                            <button 
                                onClick={handleToggleFavorite}
                                className={`backdrop-blur-sm p-2 rounded-full shadow-soft hover:scale-110 transition-all duration-300 ${
                                    isFavorited 
                                        ? 'bg-Favorite text-white' 
                                        : 'bg-white/90 text-gray-600 hover:bg-Favorite hover:text-white'
                                }`}
                            >
                                <FiHeart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                            </button>
                            {favoritesCount > 0 && (
                                <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <FiHeart className="w-3 h-3" />
                                    {favoritesCount}
                                </span>
                            )}
                        </div>
                        
                        <img
                            src={getImgUrl(book.coverImage)}
                            alt={book?.title}
                            className={`w-full h-full object-cover p-3 cursor-pointer group-hover:scale-105 transition-transform duration-500 ${
                                isOutOfStock ? 'grayscale opacity-50' : ''
                            }`}
                        />
                    </Link>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between min-h-0">
                    <div className="space-y-2">
                        <Link to={`/books/${book._id}`}>
                            <h3 className="text-lg font-bold text-gray-800 hover:text-secondary line-clamp-2 transition-colors duration-300">
                                {book?.title}
                            </h3>
                        </Link>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                            {book?.description}
                        </p>
                    </div>
                    
                    <div className="space-y-3 mt-3">
                        {/* Price */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xl font-bold text-secondary">
                                {formatVND(book?.newPrice)}
                            </span>
                            {book?.oldPrice && (
                                <>
                                    <span className="text-sm line-through text-gray-400">
                                        {formatVND(book?.oldPrice)}
                                    </span>
                                    <span className="bg-gradient-to-r from-Favorite to-bright-orange text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                        -{Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100)}%
                                    </span>
                                </>
                            )}
                        </div>
                        
                        {/* Add to Cart Button */}
                        <button 
                            onClick={() => !isOutOfStock && handleAddToCart(book)} 
                            disabled={isOutOfStock}
                            className={`gooey-button w-full relative px-4 py-2.5 font-semibold border-4 transition-all duration-700 flex items-center justify-center gap-2 rounded-lg overflow-visible z-10 ${
                                isOutOfStock 
                                    ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50' 
                                    : 'border-purple-500 text-purple-600 hover:text-white'
                            }`}
                        >
                            {!isOutOfStock && (
                                <div className="button-blobs" style={{
                                    height: '100%',
                                    filter: 'url(#goo)',
                                    overflow: 'hidden',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    bottom: '-3px',
                                    right: '-1px',
                                    zIndex: -1
                                }}>
                                    <div style={{
                                        backgroundColor: 'rgb(139, 92, 246)',
                                        width: '34%',
                                        height: '100%',
                                        borderRadius: '100%',
                                        position: 'absolute',
                                        transform: 'scale(1.4) translateY(125%) translateZ(0)',
                                        transition: 'all 700ms ease',
                                        left: '-5%'
                                    }}></div>
                                    <div style={{
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
                                    <div style={{
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
                            )}
                            <FiShoppingCart className="w-4 h-4 relative z-10" />
                            <span className="text-sm relative z-10">{isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}</span>
                        </button>
                        
                        <style>{`
                            .gooey-button:hover .button-blobs > div {
                                transform: scale(1.4) translateY(0) translateZ(0) !important;
                            }
                        `}</style>
                    </div>
                </div>
            </div>
            
            {/* Stock Bar */}
            {isOutOfStock ? (
                <div className="relative h-7 bg-gradient-to-r from-gray-600 to-gray-800 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex items-center gap-1.5 text-white font-semibold text-xs">
                            <span className="text-sm">❌</span>
                            <span>Sản phẩm hết hàng</span>
                        </span>
                    </div>
                </div>
            ) : isLowStock ? (
                <div className="relative h-7 bg-gradient-to-r from-red-500 to-orange-500 overflow-hidden">
                    <div 
                        className="h-full bg-white/20 transition-all duration-500"
                        style={{ width: `${100 - Math.max(stockPercentage, 5)}%`, marginLeft: 'auto' }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex items-center gap-1.5 text-white font-semibold text-xs">
                            <span className="text-sm">🔥</span>
                            <span>Sắp hết - Còn {book?.stock} cuốn</span>
                        </span>
                    </div>
                </div>
            ) : null}
            
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
        </div>
    )
}

export default BookCard
