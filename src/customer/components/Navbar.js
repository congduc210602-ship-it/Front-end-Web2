import React from 'react';
import { ShoppingCart, Search, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">RAINBOW STORE</h1>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                className="w-full border rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tìm kiếm sản phẩm nước hoa..."
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex flex-col items-center cursor-pointer hover:text-blue-600">
              <User size={24} />
              <span className="text-xs">Tài khoản</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer hover:text-blue-600 relative">
              <ShoppingCart size={24} />
              <span className="text-xs">Giỏ hàng</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;