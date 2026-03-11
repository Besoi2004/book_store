import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateContactMutation } from '../../redux/features/contacts/contactsApi'
import { useAuth } from '../../context/AuthContext'
import Swal from 'sweetalert2'
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock, FaFacebook, FaTwitter, FaInstagram, FaBook, FaPaperPlane } from 'react-icons/fa'

const Contact = () => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
    const [createContact, { isLoading }] = useCreateContactMutation()
    const [showBookRequest, setShowBookRequest] = useState(false)
    const { currentUser } = useAuth()

    // Auto-fill user info when logged in
    useEffect(() => {
        if (currentUser) {
            setValue('name', currentUser.username || currentUser.displayName || '')
            setValue('email', currentUser.email || '')
            setValue('phone', currentUser.phone || '')
        }
    }, [currentUser, setValue])

    const onSubmit = async (data) => {
        try {
            const contactData = {
                name: data.name,
                email: data.email,
                phone: data.phone || "",
                subject: data.subject,
                message: data.message,
                bookRequestTitle: data.bookRequestTitle || ""
            }

            const response = await createContact(contactData).unwrap()
            
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: response.message || 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.',
                confirmButtonColor: '#8B5CF6',
            })
            
            reset()
            setShowBookRequest(false)
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: error?.data?.message || 'Không thể gửi yêu cầu. Vui lòng thử lại sau.',
                confirmButtonColor: '#8B5CF6',
            })
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-soft-blue via-white to-soft-purple py-16">
            <div className="max-w-7xl mx-auto px-4">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-fadeIn">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-secondary via-deep-purple to-primary bg-clip-text text-transparent">
                        Liên Hệ Với Chúng Tôi
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        📖 Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
                    </p>
                    
                    {/* Book Request Banner */}
                    <div className="relative bg-gradient-to-r from-secondary/20 via-deep-purple/20 to-primary/20 rounded-3xl p-8 max-w-4xl mx-auto border-2 border-secondary/30 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-primary/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="relative z-10">
                            <FaBook className="text-6xl text-secondary mx-auto mb-4 animate-bounce" />
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Chưa Tìm Thấy Sách Phù Hợp? 📚
                            </h2>
                            <p className="text-lg text-gray-700 mb-3 font-semibold">
                                Bạn muốn yêu cầu thêm cuốn sách nào?
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Hãy để lại yêu cầu của bạn! Chúng tôi sẽ tìm kiếm và cập nhật các đầu sách theo nhu cầu của bạn. 
                                Đội nlg:grid-cols-3 gap-8 mb-12">
                    {/* Quick Info Cards */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border-t-4 border-secondary transform hover:-translate-y-2">
                        <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <FaMapMarkerAlt className="text-3xl text-secondary" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Địa Chỉ</h3>
                        <p className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border-t-4 border-deep-purple transform hover:-translate-y-2">
                        <div cla className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        👤 Họ và tên *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('name', { required: 'Vui lòng nhập họ tên' })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
                                        placeholder="Nguyễn Văn A"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        📧 Email *
                                    </label>
                                    <input
                                        type="email"
                                        {...register('email', { 
                                            required: 'Vui lòng nhập email',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Email không hợp lệ'
                                            }
                                        })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
                                        placeholder="email@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        📱 Số điện thoại *
                                    </label>
                                    <input
                                        type="tel"
                                        {...register('phone', { 
                                            required: 'Vui lòng nhập số điện thoại',
                                            pattern: {
                                                value: /^[0-9]{10,11}$/,
                                                message: 'Số điện thoại không hợp lệ (10-11 số)'
                                            }
                                        })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
                                        placeholder="0123456789"
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        📝 Chủ đề *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('subject', { required: 'Vui lòng nhập chủ đề' })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
                                        placeholder="Chủ đề liên hệ"
                                    />
                                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                                </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    {...register('phone', { 
                                        required: 'Vui lòng nhập số điện thoại',
                                        pattern: {
                                            value: /^[0-9]{10,11}$/,
                                            message: 'Số điện thoại không hợp lệ (10-11 số)'
                                        }
                                    })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary focus:outline-none transition-colors"
                                    placeholder="0123456789"
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Chủ đề
                                </label>
                                <input
                                    type="text"
                                    {...register('subject', { required: 'Vui lòng nhập chủ đề' })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary focus:outline-none transition-colors"
                                    placeholder="Chủ đề liên hệ"
                                />
                                {errors.subjbg-gradient-to-r from-secondary/10 to-deep-purple/10 p-4 rounded-xl border-2 border-secondary/30">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="bookRequest"
                                        checked={showBookRequest}
                                        onChange={(e) => setShowBookRequest(e.target.checked)}
                                        className="w-5 h-5 text-secondary border-gray-300 rounded focus:ring-secondary cursor-pointer"
                                    />
                                    <label htmlFor="bookRequest" className="text-sm font-bold text-gray-800 cursor-pointer flex items-center gap-2">
                                        <FaBook className="text-secondary" />
                                        Tôi muốn yêu cầu thêm sách mới
                                    </label>
                                </div>

                                {/* Book Request Title Field */}
                                {showBookRequest && (
                                    <div className="mt-3 animate-fadeIn">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            📚 Tên sách bạn muốn tìm
                                        </label>
                                        <input
                                            type="text"
                                            {...register('bookRequestTitle')}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-secondary/30 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
                                            placeholder="Ví dụ: Đắc Nhân Tâm, Nhà Giả Kim, Harry Potter..."
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    💬 Tin nhắn *
                                </label>
                                <textarea
                                    {...register('message', { required: 'Vui lòng nhập tin nhắn' })}
                                    rows="6"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all resize-none"
                                    placeholder="Nhập nội dung chi tiết mà bạn muốn trao đổi với chúng tôi..."
                                ></textarea>
                                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-secondary via-deep-purple to-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                                {isLoading ? 'Đang gửi...' : 'Gửi Tin N
                        Info Sidebar */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Working Hours */}
                        <div className="bg-gradient-to-br from-secondary to-deep-purple rounded-3xl shadow-2xl p-8 text-white">
                            <div className="flex items-center gap-3 mb-6">
                                <FaClock className="text-4xl" />
                                <h3 className="text-2xl font-bold">Giờ Làm Việc</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <span className="font-semibold">Thứ 2 - Thứ 6</span>
                                    <span className="font-bold">8:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <span className="font-semibold">Thứ 7</span>
                                    <span className="font-bold">8:00 - 17:00</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <span className="font-semibold">Chủ Nhật</span>
                                    <span className="font-bold">9:00 - 16:00</span>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                                <p className="text-sm text-center">
                                    🎯 Hỗ trợ khách hàng 24/7 qua email và form liên hệ
                                </p>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                Kết Nối Với Chúng Tôi
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <a href="#" className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-4 rounded-2xl transition-all transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
                                    <FaFacebook className="w-full h-12 text-white" />
                                    <p className="text-white text-xs text-center mt-2 font-semibold">Facebook</p>
                                </a>
                                <a href="#" className="group bg-gradient-to-br from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 p-4 rounded-2xl transition-all transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
                                    <FaTwitter className="w-full h-12 text-white" />
                                    <p className="text-white text-xs text-center mt-2 font-semibold">Twitter</p>
                                </a>
                                <a href="#" className="group bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 p-4 rounded-2xl transition-all transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
                                    <FaInstagram className="w-full h-12 text-white" />
                                    <p className="text-white text-xs text-center mt-2 font-semibold">Instagram</p>
                                </a>
                            </div>
                        </div>

                        {/* Quick Response */}
                        <div className="bg-gradient-to-br from-soft-yellow to-soft-pink rounded-3xl shadow-xl p-6 border-2 border-yellow-200">
                            <div className="text-center">
                                <div className="text-4xl mb-3">⚡</div>
                                <h4 className="font-bold text-gray-800 mb-2">Phản Hồi Nhanh!</h4>
                                <p className="text-sm text-gray-700">
                                    Thời gian phản hồi trung bình: <span className="font-bold text-secondary">2-4 giờ</span>
                                </p <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                                <a href="#" className="bg-gray-100 hover:bg-secondary hover:text-white p-3 rounded-lg transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
