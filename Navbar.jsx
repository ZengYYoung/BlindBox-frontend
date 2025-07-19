import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            // 从token中解析用户名（这里简化处理，实际应该从后端获取用户信息）
            const userAccount = localStorage.getItem("userAccount");
            setUsername(userAccount || "用户");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userAccount");
        setIsLoggedIn(false);
        setUsername("");
        navigate("/");
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200 w-full sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">🎁</span>
                        </div>
                        <span className="text-xl font-bold from-blue-500 to-purple-600 hidden sm:block">Blind Box</span>
                    </Link>

                    {/* 导航链接 */}
                    <div className="hidden md:flex items-center space-x-8">
                        <pre>            </pre>
                        <Link to="/" className="text-gray-600 hover:text-blue-500 transition-colors">
                            <pre>Draw </pre>
                        </Link>
                        {isLoggedIn && (
                            <>
                                <Link to="/orders" className="text-gray-600 hover:text-blue-500 transition-colors">
                                    <pre>Order </pre>
                                </Link>
                                <Link to="/community" className="text-gray-600 hover:text-blue-500 transition-colors">
                                    <pre>Community </pre>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* 用户区域 */}
                    <div className="flex items-center space-x-4">
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Link to="/account" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {username.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-gray-700 font-medium hidden sm:block">{username}</span>
                                    </Link>
                                </div>
                                <Link
                                    to="/admin"
                                    className="px-3 py-2 text-gray-600 hover:text-purple-500 transition-colors text-sm"
                                >
                                    管理
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-gray-600 hover:text-red-500 transition-colors"
                                >
                                    退出
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-600 hover:text-blue-500 transition-colors"
                                >
                                    登录
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                                >
                                    注册
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}