import React, { useState, useEffect } from 'react'
import Loading from '../../components/Loading';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { getImgUrl } from '../../utils/getImgUrl'
import { formatVND } from '../../utils/formatVND'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlide'
import { useAuth } from '../../context/AuthContext'
import { useToggleFavoriteMutation } from '../../redux/features/books/booksApi'
import axios from 'axios'
import getBaseURL from '../../utils/baseURL'
import Swal from 'sweetalert2'

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { currentUser } = useAuth();
    const [toggleFavorite] = useToggleFavoriteMutation();

    // Fetch user's favorite books
    useEffect(() => {
        const fetchFavorites = async () => {
            if (currentUser?.email) {
                try {
                    setLoading(true);
                    const response = await axios.get(`${getBaseURL()}/api/users/${currentUser.email}/favorites`);
                    setFavorites(response.data.favoriteBooks || []);
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Không thể tải danh sách yêu thích',
                    });
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [currentUser]);

    const handleRemoveFavorite = async (bookId) => {
        if (!currentUser?.email) return;
        
        try {
            await toggleFavorite({ 
                bookId, 
                email: currentUser.email 
            }).unwrap();
            
            setFavorites(favorites.filter(book => book._id !== bookId));
            
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Đã xóa khỏi yêu thích',
                showConfirmButton: false,
                timer: 1000
            });
        } catch (error) {
            console.error('Error removing favorite:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể xóa khỏi yêu thích',
            });
        }
    };

    const handleAddToCart = (book) => {
        dispatch(addToCart(book));
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Đã thêm vào giỏ hàng',
            showConfirmButton: false,
            timer: 1000
        });
    };

    if (loading) return <Loading />;

    if (!currentUser) {
        return (
            <div className="text-center py-16">
                <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <FiHeart className="w-16 h-16 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Vui lòng đăng nhập</h3>
                <p className="text-gray-500 mb-6">
                    Bạn cần đăng nhập để xem danh sách yêu thích
                </p>
                <Link
                    to="/login"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                    Đăng nhập ngay
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-xl">
                        <FiHeart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Sách yêu thích</h2>
                        <p className="text-gray-500">Bạn có {favorites.length} sách yêu thích</p>
                    </div>
                </div>
            </div>

            {favorites.length === 0 ? (
                <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                        <FiHeart className="w-16 h-16 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có sách yêu thích</h3>
                    <p className="text-gray-500 mb-6">
                        Hãy khám phá và thêm những cuốn sách bạn yêu thích vào danh sách
                    </p>
                    <Link
                        to="/shop"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                        Khám phá ngay
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((book) => (
                        <div
                            key={book._id}
                            className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="flex gap-4 p-4">
                                <Link
                                    to={`/books/${book._id}`}
                                    className="flex-shrink-0 w-24 h-32 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden"
                                >
                                    <img
                                        src={getImgUrl(book.coverImage)}
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </Link>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <Link to={`/books/${book._id}`}>
                                            <h3 className="font-bold text-gray-800 hover:text-purple-600 transition-colors line-clamp-2 mb-1">
                                                {book.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-red-600">
                                                {formatVND(book.newPrice)}
                                            </span>
                                            {book.oldPrice && (
                                                <span className="text-sm line-through text-gray-400">
                                                    {formatVND(book.oldPrice)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => handleAddToCart(book)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                                        >
                                            <FiShoppingCart className="w-4 h-4" />
                                            <span>Thêm</span>
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFavorite(book._id)}
                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-300"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Favorites
