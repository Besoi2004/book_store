import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import getBaseURL from "../utils/baseURL";

const Register = () => {
    const [message, setMessage] = useState("");
    const { registerUser, singInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        console.log(data);
        try {
            // Đăng ký qua Firebase
            const userCredential = await registerUser(data.email, data.password);
            const user = userCredential.user;
            
            // Lưu thông tin user vào MongoDB
            try {
                await axios.put(`${getBaseURL()}/api/auth/${user.email}`, {
                    username: data.email.split('@')[0],
                    email: user.email,
                    avatar: user.photoURL || '',
                    rewardPoints: 0,
                    tier: 'bronze',
                    phone: '',
                    address: '',
                    city: '',
                    country: 'Việt Nam'
                });
                console.log('User data saved to MongoDB');
            } catch (dbError) {
                console.error('Error saving to MongoDB:', dbError);
            }
            
            alert("Đăng ký thành công!");
            navigate("/");
        } catch (error) {
            console.error('Registration error:', error);
            setMessage("Đăng ký thất bại. Vui lòng thử lại.");
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const userCredential = await singInWithGoogle();
            const user = userCredential.user;
            
            // Lưu/cập nhật thông tin user vào MongoDB
            try {
                await axios.put(`${getBaseURL()}/api/auth/${user.email}`, {
                    username: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    avatar: user.photoURL || '',
                    rewardPoints: 0,
                    tier: 'bronze',
                    phone: '',
                    address: '',
                    city: '',
                    country: 'Việt Nam'
                });
                console.log('Google user data saved to MongoDB');
            } catch (dbError) {
                console.error('Error saving to MongoDB:', dbError);
            }
            
            alert("Đăng nhập Google thành công!");
            navigate("/");
        } catch (error) {
            console.error('Google sign-in error:', error);
            setMessage("Đăng nhập Google thất bại. Vui lòng thử lại.");
        }
    };

  return (
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white shadow-2xl rounded-2xl px-8 pt-8 pb-8 border border-gray-100">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-2">
                            Đăng Ký
                        </h2>
                        <p className="text-gray-600 text-sm">Tạo tài khoản mới để bắt đầu</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input {...register("email", { required: "Email là bắt buộc" })}
                                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 leading-tight focus:outline-none focus:border-secondary transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                id="email"
                                type="email"
                                placeholder="example@email.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                                Mật khẩu
                            </label>
                            <input {...register("password", { required: "Mật khẩu là bắt buộc", minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" } })}
                                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 leading-tight focus:outline-none focus:border-secondary transition-all duration-300 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                                id="password"
                                type="password"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
                                Xác nhận mật khẩu
                            </label>
                            <input {...register("confirmPassword", { 
                                required: "Vui lòng xác nhận mật khẩu",
                                validate: (value, formValues) => value === formValues.password || "Mật khẩu không khớp"
                            })}
                                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 leading-tight focus:outline-none focus:border-secondary transition-all duration-300 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        {message && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {message}
                            </div>
                        )}

                        <button
                            className="w-full bg-gradient-to-r from-secondary to-primary text-white font-bold py-3 px-4 rounded-lg hover:shadow-glow hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">Hoặc</span>
                            </div>
                        </div>

                        <button
                            className="mt-4 w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-secondary text-gray-700 font-semibold py-3 px-4 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all duration-300"
                            onClick={handleGoogleSignIn}
                            type="button"
                        >
                            <FaGoogle className="text-red-500 text-lg" />
                            Đăng ký với Google
                        </button>
                    </div>

                    <p className="text-center mt-6 text-sm text-gray-600">
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="text-secondary hover:text-primary font-semibold hover:underline transition-colors">
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>

                <p className="mt-6 text-center text-gray-500 text-xs">
                    © 2025 Tiệm Sách Hư Vô. Bảo lưu mọi quyền.
                </p>
            </div>
        </div>
  )
}

export default Register
