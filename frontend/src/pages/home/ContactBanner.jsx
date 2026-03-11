import React from 'react'
import { Link } from 'react-router-dom'
import { FiMessageCircle, FiMail, FiPhone, FiSend } from 'react-icons/fi'

const ContactBanner = () => {
    return (
        <div className="py-16 relative overflow-hidden">
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Gradient decorative shapes */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    <div className="absolute top-10 right-10 w-48 h-48 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 left-10 w-56 h-56 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full blur-2xl"></div>
                </div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 p-8 lg:p-12">
                    {/* Left illustration */}
                    <div className="flex-shrink-0 relative order-2 lg:order-1">
                        <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center">
                            {/* Main icon */}
                            <div className="relative">
                                <div className="text-9xl animate-bounce" style={{animationDuration: '2s'}}>
                                    📚
                                </div>
                                {/* Floating icons with gradient backgrounds */}
                                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-2xl shadow-lg animate-bounce" style={{animationDelay: '0.3s', animationDuration: '2.5s'}}>
                                    <FiMessageCircle className="w-8 h-8 text-white" />
                                </div>
                                <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-2xl shadow-lg animate-bounce" style={{animationDelay: '0.6s', animationDuration: '2.2s'}}>
                                    <FiMail className="w-8 h-8 text-white" />
                                </div>
                                <div className="absolute top-1/2 -right-8 bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg animate-bounce" style={{animationDelay: '0.9s', animationDuration: '2.8s'}}>
                                    <FiPhone className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right content */}
                    <div className="flex-1 text-center lg:text-left order-1 lg:order-2">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full mb-6 border border-blue-200">
                            <FiMessageCircle className="w-5 h-5 text-blue-600 animate-pulse" />
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold text-sm">LIÊN HỆ NGAY</span>
                        </div>
                        
                        <h2 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
                            Bạn chưa tìm thấy sách phù hợp với bản thân?
                        </h2>
                        
                        <p className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                            Bạn muốn thêm cuốn sách nào?
                        </p>
                        
                        <p className="text-gray-700 text-base lg:text-lg mb-8 max-w-2xl leading-relaxed">
                            Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ tìm kiếm những đầu sách phù hợp nhất. Chúng tôi luôn sẵn sàng lắng nghe và đáp ứng mọi nhu cầu của bạn!
                        </p>
                        
                        {/* Contact features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto lg:mx-0">
                                    <FiMail className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-gray-800 font-semibold">Hỗ trợ qua Email</p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto lg:mx-0">
                                    <FiPhone className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-gray-800 font-semibold">Tư vấn trực tiếp</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto lg:mx-0">
                                    <FiSend className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-gray-800 font-semibold">Phản hồi nhanh</p>
                            </div>
                        </div>
                        
                        {/* Gooey Button */}
                        <Link to="/contact">
                            <button className="gooey-button-contact relative z-10 px-8 py-4 font-bold text-lg cursor-pointer border-4 border-blue-500 text-blue-600 hover:text-white transition-all duration-700 flex items-center justify-center gap-3 rounded-2xl overflow-visible mx-auto lg:mx-0 shadow-lg hover:shadow-xl">
                                <div className="button-blobs absolute top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden" style={{ filter: 'url(#goo-contact)' }}>
                                    <div className="blob blob-1" style={{
                                        backgroundColor: 'rgb(59, 130, 246)',
                                        width: '34%',
                                        height: '100%',
                                        borderRadius: '100%',
                                        position: 'absolute',
                                        transform: 'scale(1.4) translateY(125%) translateZ(0)',
                                        transition: 'all 700ms ease',
                                        left: '-5%'
                                    }}></div>
                                    <div className="blob blob-2" style={{
                                        backgroundColor: 'rgb(59, 130, 246)',
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
                                        backgroundColor: 'rgb(59, 130, 246)',
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
                                <FiMessageCircle className="w-6 h-6 relative z-10" />
                                <span className="relative z-10">Liên hệ ngay</span>
                            </button>
                        </Link>
                        
                        <style>{`
                            .gooey-button-contact:hover .blob {
                                transform: scale(1.4) translateY(0) translateZ(0) !important;
                            }
                        `}</style>
                        
                        {/* SVG Filter for Gooey Effect */}
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{display: 'block', height: 0, width: 0, position: 'absolute'}}>
                            <defs>
                                <filter id="goo-contact">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation={10} result="blur" />
                                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                                    <feBlend in="SourceGraphic" in2="goo" />
                                </filter>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactBanner
