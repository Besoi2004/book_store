import React, { useState, useEffect, useRef } from 'react'
import BookCard from '../books/BookCard'
import { FiStar, FiAward, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import Swal from 'sweetalert2';

const Recommended = () => {
    const { data: books = [] } = useFetchAllBooksQuery();
    const swiperRef = useRef(null);

    return (
        <div className="py-16 relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-3xl -mx-4 opacity-40"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>
            
            <div className="relative z-10">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center gap-3 mb-4">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
                            <FiStar className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            Đề cử cho bạn
                        </h2>
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl shadow-lg">
                            <FiAward className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <p className="text-gray-700 text-lg font-medium max-w-2xl mx-auto">
                        ✨ Những đầu sách xuất sắc được tuyển chọn đặc biệt dành riêng cho bạn
                    </p>
                    
                    {/* Decorative line */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <div className="w-12 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="w-20 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
                    </div>
                </div>

                {/* Books Swiper */}
                <div className="relative">
                    {/* Custom Navigation Buttons */}
                    <button 
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="custom-swiper-button custom-swiper-button-prev"
                        aria-label="Previous"
                    >
                        <FiChevronLeft />
                    </button>
                    <button 
                        onClick={() => swiperRef.current?.slideNext()}
                        className="custom-swiper-button custom-swiper-button-next"
                        aria-label="Next"
                    >
                        <FiChevronRight />
                    </button>

                    <Swiper
                        onSwiper={(swiper) => { swiperRef.current = swiper }}
                        slidesPerView={1}
                        spaceBetween={30}
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
                        modules={[Pagination]}
                        className="mySwiper pb-12"
                    >
                    {
                        books.length > 0 && books.slice(8, 18).map((book, index) => (
                            <SwiperSlide key={index}>
                                <BookCard book={book} />
                            </SwiperSlide>
                        ))
                    }
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default Recommended
