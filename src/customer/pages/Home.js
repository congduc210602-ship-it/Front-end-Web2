import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import ProductCard from '../components/ProductCard';
import { getAllProducts } from 'services/ProductService';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("Tất cả"); // Thêm State lọc danh mục

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi lấy sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Trích xuất các danh mục duy nhất từ danh sách sản phẩm
    const categories = ["Tất cả", ...new Set(products.map(p => p.category).filter(Boolean))];

    // Lọc sản phẩm theo danh mục đang chọn
    const filteredProducts = activeCategory === "Tất cả"
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans selection:bg-blue-200">
            <Navbar />

            {/* Banner Quảng Cáo (Hero Section) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="relative rounded-3xl overflow-hidden bg-gray-900 shadow-2xl">
                    <img
                        src="https://images.unsplash.com/photo-1615486171448-4fedcc8b8f2c?q=80&w=2000&auto=format&fit=crop"
                        alt="Banner"
                        className="w-full h-[400px] object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center">
                        <div className="pl-10 md:pl-20 max-w-2xl text-white">
                            <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Bộ Sưu Tập 2026</span>
                            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-4 drop-shadow-lg">
                                Đánh thức <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">mọi giác quan</span>
                            </h2>
                            <p className="text-lg text-gray-300 mb-8 font-medium">Khám phá những nốt hương tinh tế nhất từ các thương hiệu hàng đầu thế giới.</p>
                            <button className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-xl">
                                Khám Phá Ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phần Danh sách sản phẩm */}
            <div className="max-w-7xl mx-auto px-4 py-16">

                {/* Tiêu đề & Bộ lọc Categories */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Sản phẩm nổi bật</h3>
                    <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto hide-scrollbar">
                        {categories.map((cat, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-900 hover:text-gray-900'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lưới sản phẩm */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Home;