import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

import news1 from "../../assets/news/news-1.png"
import news2 from "../../assets/news/news-2.png"
import news3 from "../../assets/news/news-3.png"
import news4 from "../../assets/news/news-4.png"
import { Link } from 'react-router-dom';

const news = [
    {
        "id": 1,
        "title": "Global Climate Summit Calls for Urgent Action",
        "description": "World leaders gather at the Global Climate Summit to discuss urgent strategies to combat climate change, focusing on reducing carbon emissions and fostering renewable energy solutions.",
        "image": news1
    },
    {
        "id": 2,
        "title": "Breakthrough in AI Technology Announced",
        "description": "A major breakthrough in artificial intelligence has been announced by researchers, with new advancements promising to revolutionize industries from healthcare to finance.",
        "image": news2
    },
    {
        "id": 3,
        "title": "New Space Mission Aims to Explore Distant Galaxies",
        "description": "NASA has unveiled plans for a new space mission that will aim to explore distant galaxies, with hopes of uncovering insights into the origins of the universe.",
        "image": news3
    },
    {
        "id": 4,
        "title": "Stock Markets Reach Record Highs Amid Economic Recovery",
        "description": "Global stock markets have reached record highs as signs of economic recovery continue to emerge following the challenges posed by the global pandemic.",
        "image": news4
    },
    {
        "id": 5,
        "title": "Innovative New Smartphone Released by Leading Tech Company",
        "description": "A leading tech company has released its latest smartphone model, featuring cutting-edge technology, improved battery life, and a sleek new design.",
        "image": news2
    }
]

const News = () => {
  return (
    <div className='py-16'>
        <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-bright-orange to-Favorite rounded-full"></div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-bright-orange to-Favorite bg-clip-text text-transparent">
                    Tin tức & Sự kiện
                </h2>
            </div>
            <p className="text-gray-600 ml-4">Cập nhật những tin tức mới nhất từ thế giới sách</p>
        </div>

        <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
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
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        
        {
            news.map((item, index) => (
                <SwiperSlide key={index}>
                    <div className='group bg-white rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden'>
                        <div className='flex flex-col h-full'>
                            {/* Image */}
                            <div className='relative overflow-hidden h-56'>
                                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10'></div>
                                <img 
                                    src={item.image} 
                                    alt={item.title}  
                                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                                />
                            </div>

                            {/* Content */}
                            <div className='p-6 flex-1 flex flex-col'>
                                <div className='flex-1'>
                                    <h3 className='text-xl font-bold text-gray-800 mb-3 transition-colors duration-300 line-clamp-2'>
                                        {item.title}
                                    </h3>
                                    <p className='text-sm text-gray-600 leading-relaxed line-clamp-3'>
                                        {item.description}
                                    </p>
                                </div>
                                
                                <div className='mt-4 pt-4 border-t border-gray-100'>
                                    <Link to="/shop" className='inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all duration-300 group'>
                                        <span>Đọc thêm</span>
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            ) )
        }
      </Swiper>
    </div>
  )
}

export default News