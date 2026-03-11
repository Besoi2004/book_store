import React, { useState, useEffect } from 'react'
import BookCard from '../books/BookCard'
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import { CATEGORIES } from '../../utils/categories.jsx';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

const TopSellers = () => {
    
    const [selectedCategory, setSelectedCategory] = useState("all");

    const { data: books = [] } = useFetchAllBooksQuery();
    
    const filterBooks = selectedCategory === "all"
        ? books
        : books.filter(book => book.category === selectedCategory);

    return (
        <div className="py-16">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-secondary to-deep-purple rounded-full"></div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-secondary to-deep-purple bg-clip-text text-transparent">
                        Bán chạy
                    </h2>
                </div>
                <p className="text-gray-600 ml-4">Các đầu sách được yêu thích nhất</p>
            </div>
            
            {/*category filtering*/}
            <div className="mb-10 flex items-center gap-4">
                <span className="text-gray-700 font-semibold">Lọc theo thể loại:</span>
                <select
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    name="category" 
                    id="category" 
                    className="bg-white border-2 border-gray-200 rounded-xl px-6 py-3 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-300 cursor-pointer shadow-soft hover:shadow-hover font-medium"
                >
                    <option value="all">Chọn thể loại</option>
                    {
                        CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))
                    }
                </select>
            </div>

            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                navigation={true}
                grabCursor={true}
                breakpoints={{
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 40,
                    },
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 50,
                    },
                    1180: {
                        slidesPerView: 3,
                        spaceBetween: 50,
                    }
                }}
                modules={[Pagination, Navigation]}
                className="mySwiper"
            >
                {
                    filterBooks.length > 0 && filterBooks.map((book, index) => (
                        <SwiperSlide key={index}>
                            <BookCard book={book} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}

export default TopSellers
