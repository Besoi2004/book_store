import React, { useState } from 'react'
import footerLogo from "../assets/footer-logo.png"
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md"
import { FiArrowRight } from "react-icons/fi"

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-gray-950 text-white mt-20">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-yellow-400 to-primary"></div>

      <div className="container mx-auto px-6 py-14">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1 - Brand */}
          <div className="lg:col-span-1">
            <img src={footerLogo} alt="Tiệm Sách Hư Vô" className="w-36 mb-5 drop-shadow-lg" />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Nơi mỗi cuốn sách là một hành trình. Khám phá hàng nghìn đầu sách chất lượng, mở rộng tầm nhìn và nuôi dưỡng tri thức.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-blue-600 transition-all duration-300 hover:scale-110">
                <FaFacebook size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-pink-600 transition-all duration-300 hover:scale-110">
                <FaInstagram size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-sky-500 transition-all duration-300 hover:scale-110">
                <FaTwitter size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-red-600 transition-all duration-300 hover:scale-110">
                <FaYoutube size={16} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-primary inline-block"></span>
              Liên kết nhanh
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Trang chủ' },
                { to: '/shop', label: 'Cửa hàng' },
                { to: '/points', label: 'Tích điểm' },
                { to: '/contact', label: 'Liên hệ' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}
                    className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <FiArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact */}

          {/* Column 4 - Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-primary inline-block"></span>
              Đăng ký nhận tin
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Nhận ngay thông báo sách mới, ưu đãi độc quyền và sự kiện đặc biệt.
            </p>
            {subscribed ? (
              <div className="bg-green-500/20 border border-green-500/40 rounded-xl px-4 py-3 text-green-400 text-sm text-center">
                ✓ Đăng ký thành công!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button type="submit"
                  className="w-full bg-gradient-to-r from-primary to-yellow-500 text-gray-900 font-semibold text-sm py-2.5 rounded-xl hover:opacity-90 hover:shadow-lg transition-all duration-300">
                  Đăng ký ngay
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} <span className="text-gray-400">Tiệm Sách Hư Vô</span>. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/contact" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Chính sách bảo mật</Link>
            <span className="text-gray-700">|</span>
            <Link to="/contact" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Điều khoản sử dụng</Link>
            <span className="text-gray-700">|</span>
            <Link to="/contact" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Hỗ trợ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer