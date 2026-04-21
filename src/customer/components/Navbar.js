import React from 'react';
import { ShoppingCart, Search, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {

    const { totalItems, clearCartState } = useCart();
    const { currentUser, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        clearCartState();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                            <span className="text-white font-black text-xl">P</span>
                        </div>
                        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800 tracking-tight">
                            Perfume
                        </h1>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 mx-12">
                        <div className="relative w-full max-w-xl group">
                            <input
                                type="text"
                                className="w-full bg-gray-100/50 border border-transparent rounded-full py-2.5 px-5 pl-12 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm font-medium"
                                placeholder="Tìm kiếm mùi hương của bạn..."
                            />
                            <Search className="absolute left-4 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-6 md:space-x-8">

                        {/* KIỂM TRA ĐĂNG NHẬP Ở ĐÂY */}
                        {currentUser ? (
                            // Đã đăng nhập: Hiện tên và nút Đăng xuất
                            <div className="flex items-center space-x-4">

                                {/* BỌC LINK VÀO ĐÂY ĐỂ CLICK ĐƯỢC CHUYỂN ĐẾN TRANG PROFILE */}
                                <Link to="/my-profile" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors group cursor-pointer title='Xem thông tin cá nhân'">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <User size={20} />
                                    </div>
                                    <span className="text-sm font-bold hidden sm:block truncate max-w-[100px]">
                                        Chào, {currentUser.userName}
                                    </span>
                                </Link>

                                <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 transition-colors" title="Đăng xuất">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            // Chưa đăng nhập: Hiện nút bọc Link sang trang Sign-in
                            <Link to="/authentication/sign-in">
                                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                                    <div className="p-2 bg-gray-50 rounded-full"><User size={20} /></div>
                                    <span className="text-sm font-bold hidden sm:block">Đăng nhập</span>
                                </button>
                            </Link>
                        )}

                        <Link to="/cart">
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors relative group">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <ShoppingCart size={20} />
                                </div>
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 border-2 border-white flex items-center justify-center shadow-sm">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;