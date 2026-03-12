import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import getBaseURL from "../utils/baseURL";




const Login = () => {
    const [message, setMessage] = useState("");
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const { loginUser, singInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm();

    const onSubmitUser = async (data) => {
        console.log(data);
        try {
            const userCredential = await loginUser(data.email, data.password);
            const user = userCredential.user;
            
            // Đảm bảo user tồn tại trong MongoDB (tạo nếu chưa có)
            try {
                await axios.put(`${getBaseURL()}/api/auth/${user.email}`, {
                    username: user.displayName || data.email.split('@')[0],
                    email: user.email,
                    avatar: user.photoURL || ''
                });
                console.log('User data ensured in MongoDB');
            } catch (dbError) {
                console.error('Error ensuring user in MongoDB:', dbError);
            }
            
            alert("Đăng nhập thành công!");
            navigate("/");
        } catch (error) {
            console.error('Login error:', error);
            setMessage("Đăng nhập thất bại. Vui lòng kiểm tra thông tin.");
        }
    };

    const onSubmitAdmin = async (data) => {
        try {
            const response = await axios.post(`${getBaseURL()}/api/auth/admin`, {
                username: data.username,
                password: data.password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const auth = response.data;
            
            if(auth.token) {
                localStorage.setItem('token', auth.token);
                setTimeout(() => {
                    localStorage.removeItem('token')
                    alert('Token đã hết hạn! Vui lòng đăng nhập lại.');
                    navigate("/")
                }, 3600 * 1000)
            }

            alert("Đăng nhập Admin thành công!")
            navigate("/dashboard")

        } catch (error) {
            setMessage("Tên đăng nhập hoặc mật khẩu không đúng") 
            console.error(error)
        }
    };

    const onSubmit = isAdminLogin ? onSubmitAdmin : onSubmitUser;

    const handleGoogleSignIn = async () => {
        try {
            const userCredential = await singInWithGoogle();
            const user = userCredential.user;
            
            // Lưu/cập nhật thông tin user vào MongoDB
            try {
                await axios.put(`${getBaseURL()}/api/auth/${user.email}`, {
                    username: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    avatar: user.photoURL || ''
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

    const handleToggleLoginType = (isAdmin) => {
        setIsAdminLogin(isAdmin);
        setMessage("");
        reset();
    };

    return (
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white shadow-2xl rounded-2xl px-8 pt-8 pb-8 border border-gray-100">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-2">
                            Đăng Nhập
                        </h2>
                        <p className="text-gray-600 text-sm">Chào mừng bạn quay trở lại</p>
                    </div>

                    {/* Toggle User/Admin Login */}
                    <div className="flex gap-2 mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => handleToggleLoginType(false)}
                            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
                                !isAdminLogin 
                                    ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-md' 
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Người dùng
                        </button>
                        <button
                            type="button"
                            onClick={() => handleToggleLoginType(true)}
                            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
                                isAdminLogin 
                                    ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-md' 
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Quản trị viên
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {isAdminLogin ? (
                            // Admin Login Form
                            <>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
                                        Tên đăng nhập hoặc Email
                                    </label>
                                    <input {...register("username", { required: "Tên đăng nhập là bắt buộc" })}
                                        className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 leading-tight focus:outline-none focus:border-secondary transition-all duration-300 ${errors.username ? 'border-red-500' : 'border-gray-200'}`}
                                        id="username"
                                        type="text"
                                        placeholder="Tên đăng nhập hoặc email"
                                    />
                                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                                        Mật khẩu
                                    </label>
                                    <input {...register("password", { required: "Mật khẩu là bắt buộc" })}
                                        className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 leading-tight focus:outline-none focus:border-secondary transition-all duration-300 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                                </div>
                            </>
                        ) : (
                            // User Login Form
                            <>
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
                                    <input {...register("password", { required: "Mật khẩu là bắt buộc" })}
                                        className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 leading-tight focus:outline-none focus:border-secondary transition-all duration-300 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                                </div>
                            </>
                        )}

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
                            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </form>

                    {!isAdminLogin && (
                        <>
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
                                    Đăng nhập với Google
                                </button>
                            </div>

                            <p className="text-center mt-6 text-sm text-gray-600">
                                Chưa có tài khoản?{" "}
                                <Link to="/register" className="text-secondary hover:text-primary font-semibold hover:underline transition-colors">
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </>
                    )}

                    {message && (
                        <p className="text-red-500 text-xs italic mt-4 text-center">{message}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
