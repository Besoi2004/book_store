import React from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES_WITH_ICONS } from '../../utils/categories.jsx'

const Categories = () => {
    return (
        <div className='py-12 px-4 max-w-screen-2xl mx-auto'>
            {/* Header */}
            <div className='mb-10 flex flex-col items-center text-center'>
                <span className='inline-block px-4 py-1 mb-3 text-sm font-semibold tracking-widest uppercase bg-purple-100 text-purple-600 rounded-full'>
                    Khám phá
                </span>
                <h2 className='text-4xl md:text-5xl font-extrabold text-gray-800 mb-3'>
                    Danh mục{' '}
                    <span className='bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'>
                        Sách
                    </span>
                </h2>
                <p className='text-gray-500 text-base max-w-md'>
                    Chọn thể loại bạn yêu thích và khám phá hàng nghìn cuốn sách hấp dẫn
                </p>
            </div>

            {/* Categories Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6'>
                {CATEGORIES_WITH_ICONS.map((category) => (
                    <Link
                        key={category.name}
                        to={`/shop?category=${category.nameEn.toLowerCase()}`}
                        className={`group relative bg-gradient-to-br ${category.color} ${category.hoverColor} rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-4 shadow-soft hover:shadow-hover transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden`}
                    >
                        {/* Hover effect overlay */}
                        <div className='absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
                        
                        {/* Icon */}
                        <div className={`relative z-10 ${category.textColor} transform group-hover:scale-110 transition-transform duration-300`}>
                            {category.icon}
                        </div>
                        
                        {/* Name */}
                        <span className='relative z-10 text-gray-800 font-semibold text-sm md:text-base text-center'>
                            {category.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Categories
