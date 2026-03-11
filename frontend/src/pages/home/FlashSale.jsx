import React, { useState, useEffect, useRef } from 'react'
import BookCard from '../books/BookCard'
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import { FiZap, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

const FlashSale = () => {
    const { data: books = [] } = useFetchAllBooksQuery();
    const swiperRef = useRef(null);
    
    // Filter only flash sale books
    const flashSaleBooks = books.filter(book => book.status === 'flash-sale');

    // Countdown timer state
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        // Set end time to tomorrow 00:00:00
        const calculateTimeLeft = () => {
            const now = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const difference = tomorrow - now;

            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft({ hours, minutes, seconds });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    const TimeBox = ({ value, label }) => (
        <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[70px] shadow-lg">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1 tabular-nums">
                {String(value).padStart(2, '0')}
            </div>
            <div className="text-xs text-white/90 font-medium uppercase tracking-wider">
                {label}
            </div>
        </div>
    );

    if (flashSaleBooks.length === 0) {
        return null; // Don't render if no flash sale books
    }

    return (
        <div className="py-16 relative">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-3xl -mx-4"></div>
            
            <div className="relative z-10">
                {/* Header with countdown */}
                <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl relative overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Title section */}
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                                <FiZap className="w-10 h-10 md:w-12 md:h-12 text-white animate-bounce" />
                            </div>
                            <div>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                                    ⚡ FLASH SALE ⚡
                                </h2>
                                <p className="text-white/90 text-sm md:text-base font-medium">
                                    Giảm giá cực sốc - Số lượng có hạn!
                                </p>
                            </div>
                        </div>

                        {/* Countdown timer */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex items-center gap-2 text-white">
                                <FiClock className="w-5 h-5" />
                                <span className="text-sm font-semibold uppercase tracking-wide">
                                    Kết thúc trong
                                </span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3">
                                <TimeBox value={timeLeft.hours} label="Giờ" />
                                <div className="text-white text-2xl font-bold animate-pulse">:</div>
                                <TimeBox value={timeLeft.minutes} label="Phút" />
                                <div className="text-white text-2xl font-bold animate-pulse">:</div>
                                <TimeBox value={timeLeft.seconds} label="Giây" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Books carousel */}
                <div className="relative">
                    {/* Decorative corner badges */}
                    <div className="absolute -top-4 -left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg z-10 animate-bounce">
                        HOT 🔥
                    </div>
                    
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
                            flashSaleBooks.map((book, index) => (
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

export default FlashSale
