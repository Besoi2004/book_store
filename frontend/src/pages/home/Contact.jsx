import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useCreateContactMutation } from '../../redux/features/contacts/contactsApi';
import Swal from 'sweetalert2';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const CONTACT_TOPICS = [
  { value: 'cancel_order', label: 'Hủy đơn hàng' },
  { value: 'not_received', label: 'Chưa nhận được hàng' },
  { value: 'return_exchange', label: 'Đổi/trả hàng' },
  { value: 'payment_issue', label: 'Vấn đề thanh toán' },
  { value: 'product_inquiry', label: 'Hỏi thông tin sản phẩm' },
  { value: 'product_complaint', label: 'Khiếu nại sản phẩm' },
  { value: 'book_request', label: 'Tìm sách' },
  { value: 'other', label: 'Khác' },
];

const Contact = () => {
  const { currentUser } = useAuth();
  const [createContact, { isLoading }] = useCreateContactMutation();
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const [isBookRequest, setIsBookRequest] = useState(false);
  const selectedTopic = watch('topic');

  // Auto-fill user information when logged in
  useEffect(() => {
    if (currentUser) {
      setValue('name', currentUser.displayName || currentUser.username || '');
      setValue('email', currentUser.email || '');
      setValue('phone', currentUser.phone || '');
    }
  }, [currentUser, setValue]);

  const onSubmit = async (data) => {
    try {
      const contactData = {
        ...data,
        bookRequestTitle: isBookRequest ? data.bookRequestTitle : undefined
      };

      await createContact(contactData).unwrap();
      
      Swal.fire({
        title: 'Thành công!',
        text: 'Yêu cầu của bạn đã được gửi. Chúng tôi sẽ liên hệ sớm nhất!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10B981'
      });

      reset();
      setIsBookRequest(false);
    } catch (error) {
      console.error('Failed to send contact:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể gửi yêu cầu. Vui lòng thử lại sau.',
        icon: 'error',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quick Info Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Address Card */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-2xl text-primary mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Địa Chỉ</h3>
                <p className="text-gray-600 text-sm">
                  123 Đường Sách, Quận 1<br />
                  TP. Hồ Chí Minh
                </p>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-start gap-3">
              <FaPhone className="text-2xl text-primary mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Điện Thoại</h3>
                <p className="text-gray-600 text-sm">
                  Hotline: 1900 1234<br />
                  Thứ 2 - 7: 8:00 - 21:00
                </p>
              </div>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-start gap-3">
              <FaEnvelope className="text-2xl text-primary mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                <p className="text-gray-600 text-sm">
                  support@bookstore.vn<br />
                  order@bookstore.vn
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Gửi Tin Nhắn</h2>
                <p className="text-gray-600">Vui lòng điền đầy đủ thông tin</p>
              </div>

              {/* Book Request Toggle */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setIsBookRequest(!isBookRequest)}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                    isBookRequest
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:from-amber-500 hover:to-orange-500 shadow-sm'
                  }`}
                >
                  {isBookRequest ? '✓ Yêu cầu tìm sách đặc biệt' : 'Yêu cầu tìm sách đặc biệt?'}
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Vui lòng nhập họ tên' })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Email and Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="0901234567"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Topic Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ đề *
                  </label>
                  <select
                    {...register('topic', { required: 'Vui lòng chọn chủ đề' })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  >
                    <option value="">-- Chọn chủ đề --</option>
                    {CONTACT_TOPICS.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  {errors.topic && (
                    <p className="mt-1 text-sm text-red-500">{errors.topic.message}</p>
                  )}
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    {...register('subject', { required: 'Vui lòng nhập tiêu đề' })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Vấn đề bạn cần hỗ trợ"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                {/* Book Request Title - Conditional */}
                {isBookRequest && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Tên sách cần tìm *
                    </label>
                    <input
                      type="text"
                      {...register('bookRequestTitle', {
                        required: isBookRequest ? 'Vui lòng nhập tên sách' : false
                      })}
                      className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
                      placeholder="Ví dụ: Harry Potter và Hòn đá Phù thủy"
                    />
                    {errors.bookRequestTitle && (
                      <p className="mt-1 text-sm text-red-600">{errors.bookRequestTitle.message}</p>
                    )}
                  </div>
                )}

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung *
                  </label>
                  <textarea
                    rows="5"
                    {...register('message', { required: 'Vui lòng nhập nội dung' })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu của bạn..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span>Đang gửi...</span>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Gửi Yêu Cầu</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Response Time */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Thời Gian Phản Hồi</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24h</div>
                <p className="text-gray-600 text-sm">
                  Chúng tôi cam kết phản hồi mọi yêu cầu trong vòng 24 giờ làm việc
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
