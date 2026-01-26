import React from 'react'
import bannerImg from '../../assets/banner.png'
const Banner = () => {
    return (
        <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12'>
            <div className='md:w-1/2 w-full flex items-center md:justify-end '>
                <img src={bannerImg} alt="" />
            </div>
            <div className='md:w-1/2 w-full'>
                <h1 className='md:text-5xl text-2xl font-medium mb-7'>Mới ra mắt</h1>
                <p className=' mb-10'>Khám phá bộ sưu tập sách mới nhất của chúng tôi</p>
                <button className='btn-primary'>Mua ngay</button>
            </div>

        </div>
    )
}

export default Banner