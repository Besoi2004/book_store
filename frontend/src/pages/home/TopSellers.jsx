import React, { useState, useEffect } from 'react'
import BookCard from '../books/BookCard'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

const category = ["Chọn thể loại", "Kinh doanh", "Marketing", "Kinh dị", "Tiểu thuyết", "Phiêu lưu"];

const TopSellers = () => {
    const [books, setBooks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Chọn thể loại");

    useEffect(() => {
        fetch('book.json')
            .then(res => res.json())
            .then(data => setBooks(data))
    }, []);

    // Map Vietnamese categories to English
    const categoryMap = {
        "Kinh doanh": "business",
        "Sách": "books",
        "Marketing": "marketing",
        "Kinh dị": "horror",
        "Tiểu thuyết": "fiction",
        "Phiêu lưu": "adventure"
    };

    const filterBooks = selectedCategory === "Chọn thể loại"
        ? books
        : books.filter(book => book.category === categoryMap[selectedCategory]);

    return (
        <div className="py-10">
            <h2 className="text-3xl font-semibold mb-6">Bán chạy</h2>
            {/*cateory filtering*/}
            <div className="mb-8 flex items-center">
                <select
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    name="category" id="category" className="border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none">
                    {
                        category.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
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
