import React from 'react'
import { Link } from 'react-router-dom'
import { FiGift, FiStar, FiTrendingUp, FiAward } from 'react-icons/fi'

const RewardsBanner = () => {
    return (
        <div className="py-16 relative overflow-hidden">
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Gradient decorative shapes */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-tr from-orange-400 to-yellow-400 rounded-full blur-2xl"></div>
                </div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 p-8 lg:p-12">
                    {/* Left content */}
                    <div className="flex-1 text-center lg:text-left">
                        {/* Icon badge */}
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-6 border border-purple-200">
                            <FiGift className="w-5 h-5 text-purple-600 animate-pulse" />
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold text-sm">CHƯƠNG TRÌNH MỚI</span>
                        </div>
                        
                        <h2 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4">
                            🎁 Tích điểm thưởng
                        </h2>
                        <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-6">
                            Nhận quà cực hấp dẫn!
                        </h3>
                        
                        <p className="text-gray-700 text-lg mb-8 max-w-2xl leading-relaxed">
                            Mỗi đơn hàng bạn nhận được điểm thưởng. Tích lũy đủ điểm để đổi quà tặng, voucher giảm giá và nhiều ưu đãi độc quyền khác!
                        </p>
                        
                        {/* Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto lg:mx-0">
                                    <FiStar className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-gray-800 font-semibold">Tích điểm dễ dàng</p>
                            </div>
                            <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-5 border border-pink-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-gradient-to-br from-pink-500 to-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto lg:mx-0">
                                    <FiTrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-gray-800 font-semibold">Ưu đãi tăng dần</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-5 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-gradient-to-br from-orange-500 to-yellow-500 w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto lg:mx-0">
                                    <FiAward className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-gray-800 font-semibold">Quà tặng hấp dẫn</p>
                            </div>
                        </div>
                        
                        {/* Gooey Button */}
                        <Link to="/points">
                            <button className="gooey-button relative z-10 px-8 py-4 font-bold text-lg cursor-pointer border-4 border-purple-500 text-purple-600 hover:text-white transition-all duration-700 flex items-center justify-center gap-3 rounded-2xl overflow-visible mx-auto lg:mx-0 shadow-lg hover:shadow-xl">
                                <div className="button-blobs absolute top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden" style={{ filter: 'url(#goo-rewards)' }}>
                                    <div className="blob blob-1" style={{
                                        backgroundColor: 'rgb(168, 85, 247)',
                                        width: '34%',
                                        height: '100%',
                                        borderRadius: '100%',
                                        position: 'absolute',
                                        transform: 'scale(1.4) translateY(125%) translateZ(0)',
                                        transition: 'all 700ms ease',
                                        left: '-5%'
                                    }}></div>
                                    <div className="blob blob-2" style={{
                                        backgroundColor: 'rgb(168, 85, 247)',
                                        width: '34%',
                                        height: '100%',
                                        borderRadius: '100%',
                                        position: 'absolute',
                                        transform: 'scale(1.4) translateY(125%) translateZ(0)',
                                        transition: 'all 700ms ease',
                                        transitionDelay: '60ms',
                                        left: '30%'
                                    }}></div>
                                    <div className="blob blob-3" style={{
                                        backgroundColor: 'rgb(168, 85, 247)',
                                        width: '34%',
                                        height: '100%',
                                        borderRadius: '100%',
                                        position: 'absolute',
                                        transform: 'scale(1.4) translateY(125%) translateZ(0)',
                                        transition: 'all 700ms ease',
                                        transitionDelay: '25ms',
                                        left: '66%'
                                    }}></div>
                                </div>
                                <FiGift className="w-6 h-6 relative z-10" />
                                <span className="relative z-10">Khám phá ngay</span>
                            </button>
                        </Link>
                        
                        <style>{`
                            .gooey-button:hover .blob {
                                transform: scale(1.4) translateY(0) translateZ(0) !important;
                            }
                        `}</style>
                        
                        {/* SVG Filter for Gooey Effect */}
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{display: 'block', height: 0, width: 0, position: 'absolute'}}>
                            <defs>
                                <filter id="goo-rewards">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation={10} result="blur" />
                                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                                    <feBlend in="SourceGraphic" in2="goo" />
                                </filter>
                            </defs>
                        </svg>
                    </div>
                    
                    {/* Right illustration */}
                    <div className="flex-shrink-0 relative">
                        <div className="relative">
                            {/* Floating gift boxes */}
                            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-9xl animate-bounce" style={{animationDuration: '2s'}}>
                                        🎁
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 text-6xl animate-bounce" style={{animationDelay: '0.3s', animationDuration: '2.5s'}}>
                                    ⭐
                                </div>
                                <div className="absolute bottom-0 left-0 text-6xl animate-bounce" style={{animationDelay: '0.6s', animationDuration: '2.2s'}}>
                                    🏆
                                </div>
                                <div className="absolute top-1/4 left-0 text-5xl animate-bounce" style={{animationDelay: '0.9s', animationDuration: '2.8s'}}>
                                    💎
                                </div>
                                <div className="absolute bottom-1/4 right-0 text-5xl animate-bounce" style={{animationDelay: '1.2s', animationDuration: '2.3s'}}>
                                    🎉
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RewardsBanner
