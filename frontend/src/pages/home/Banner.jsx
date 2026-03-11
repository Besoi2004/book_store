import React from 'react'
import bannerImg from '../../assets/banner.png'
import { Link } from 'react-router-dom'

const Banner = () => {
    return (
        <div className='relative overflow-hidden rounded-3xl my-8' style={{background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 45%, #24243e 100%)'}}>
            {/* Mesh / glow blobs */}
            <div className='absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full opacity-30'
                 style={{background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)'}}></div>
            <div className='absolute bottom-[-100px] left-[-60px] w-[380px] h-[380px] rounded-full opacity-25'
                 style={{background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)'}}></div>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] opacity-10'
                 style={{background: 'radial-gradient(ellipse, #fbbf24 0%, transparent 70%)'}}></div>

            {/* Floating particles */}
            <div className='absolute inset-0 pointer-events-none'>
                {[
                    {top:'12%', left:'8%', size:'10px', delay:'0s', dur:'4s'},
                    {top:'70%', left:'5%', size:'6px', delay:'1.5s', dur:'5s'},
                    {top:'25%', left:'92%', size:'8px', delay:'0.8s', dur:'6s'},
                    {top:'80%', left:'88%', size:'12px', delay:'2s', dur:'4.5s'},
                    {top:'50%', left:'18%', size:'5px', delay:'3s', dur:'7s'},
                    {top:'15%', left:'55%', size:'7px', delay:'0.3s', dur:'5.5s'},
                ].map((p, i) => (
                    <div key={i} className='absolute rounded-full animate-float-up-down'
                         style={{top: p.top, left: p.left, width: p.size, height: p.size,
                                 background: 'rgba(167,139,250,0.6)', animationDelay: p.delay, animationDuration: p.dur}}/>
                ))}
            </div>

            <div className='relative flex flex-col md:flex-row-reverse py-14 md:py-20 px-8 md:px-16 justify-between items-center gap-10 md:gap-8'>
                {/* Image side */}
                <div className='md:w-5/12 w-full flex items-center justify-center animate-float'>
                    <div className='relative'>
                        {/* Glow ring */}
                        <div className='absolute -inset-6 rounded-full opacity-40 blur-3xl'
                             style={{background: 'radial-gradient(circle, #818cf8, #a78bfa)'}}></div>
                        {/* Card frame */}
                        <div className='relative rounded-2xl p-[3px]'
                             style={{background: 'linear-gradient(135deg, rgba(129,140,248,0.8), rgba(167,139,250,0.4), rgba(251,191,36,0.4))'}}>
                            <div className='rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm p-4'>
                                <img src={bannerImg} alt='Sách nổi bật'
                                     className='w-full max-w-xs mx-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500' />
                            </div>
                        </div>
                        {/* Badge nổi */}
                        <div className='absolute -top-4 -right-4 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-2xl shadow-lg rotate-6'>
                            🔥 Bestseller
                        </div>
                        <div className='absolute -bottom-3 -left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-2 rounded-xl shadow-lg'>
                            <span className='text-amber-400 font-bold'>4.9</span> ★ · 2.4K đánh giá
                        </div>
                    </div>
                </div>

                {/* Text side */}
                <div className='md:w-7/12 w-full space-y-6'>
                    {/* Tag */}
                    <div className='inline-flex items-center gap-2 border border-indigo-400/40 bg-indigo-500/10 text-indigo-300 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm'>
                        <span className='w-2 h-2 bg-indigo-400 rounded-full animate-pulse'></span>
                        Bộ sưu tập mới nhất 2025
                    </div>

                    <h1 className='text-4xl md:text-6xl font-extrabold leading-tight tracking-tight'>
                        <span className='text-white'>Khám phá</span>
                        <br />
                        <span style={{background: 'linear-gradient(90deg, #a78bfa, #818cf8, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                            Thế giới sách
                        </span>
                        <br />
                        <span className='text-white'>vô tận</span>
                    </h1>

                    <p className='text-indigo-200/80 text-base md:text-lg leading-relaxed max-w-md'>
                        Hàng nghìn đầu sách đang chờ bạn khám phá. Tìm kiếm tri thức, 
                        trải nghiệm cảm xúc và mở rộng tầm nhìn của bạn.
                    </p>

                    {/* CTA Buttons */}
                    <div className='flex flex-col sm:flex-row gap-3 pt-2'>
                        <Link to='/shop'
                            className='group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-1'
                            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                            <span className='text-white'>Mua sắm ngay</span>
                            <svg className='w-4 h-4 text-white group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                            </svg>
                        </Link>
                        <Link to='/shop'
                            className='inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1'>
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                            </svg>
                            Xem bộ sưu tập
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className='flex items-center gap-6 pt-4 border-t border-white/10'>

                        {/* Avatar stack */}
                        <div className='hidden sm:flex items-center gap-2'>
                            <div className='flex -space-x-2'>
                                {['bg-pink-400','bg-purple-400','bg-indigo-400','bg-cyan-400'].map((c, i) => (
                                    <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-[#302b63] flex items-center justify-center text-white text-xs font-bold`}>
                                        {['A','B','C','D'][i]}
                                    </div>
                                ))}
                            </div>
                            <div className='text-xs text-indigo-300 leading-tight'>
                                
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Banner