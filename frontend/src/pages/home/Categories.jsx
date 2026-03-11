import React from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES_WITH_ICONS } from '../../utils/categories.jsx'

const Categories = () => {
    return (
        <div className='py-12 px-4 max-w-screen-2xl mx-auto'>
            {/* Header */}
            <div className='mb-8'>
                <h2 className='text-4xl font-bold text-gray-800 mb-2'>
                    Danh mục <span className='relative inline-block'>
                        <span className='text-gray-700'>Sách</span>
                        <span className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary'></span>
                    </span>
                </h2>
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
