import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProductById } from 'services/ProductService';
import { ShoppingBag, Heart, ShieldCheck, Truck, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Import hook giỏ hàng

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    // Lấy hàm addToCart từ Context
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            const data = await getProductById(id);
            setProduct(data);
            setLoading(false);
        };
        fetchProductDetails();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy sản phẩm!</h2>
                <Link to="/" className="text-blue-600 font-medium hover:underline flex items-center">
                    <ArrowLeft size={16} className="mr-2" /> Quay lại cửa hàng
                </Link>
            </div>
        );
    }

    const imageUrl = product.imageUrl || 'https://placehold.co/600x800?text=No+Image';

    const handleDecrease = () => setQuantity(q => q > 1 ? q - 1 : 1);
    const handleIncrease = () => setQuantity(q => q < product.availability ? q + 1 : q);

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-blue-200">
            <Navbar />

            {/* Đường dẫn Breadcrumb */}
            <div className="bg-gray-50 py-4 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500 font-medium flex items-center space-x-2">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors">{product.category || 'Nước hoa'}</span>
                    <span>/</span>
                    <span className="text-gray-900">{product.productName}</span>
                </div>
            </div>

            {/* Chi tiết Sản Phẩm */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row gap-12 lg:gap-20">

                    {/* Cột Trái: Hình ảnh */}
                    <div className="w-full md:w-1/2">
                        <div className="bg-gray-50 rounded-3xl p-8 flex items-center justify-center aspect-[4/5] relative">
                            <img
                                src={imageUrl}
                                alt={product.productName}
                                className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl"
                                onError={(e) => { e.target.src = 'https://placehold.co/600x800?text=No+Image'; }}
                            />
                        </div>
                    </div>

                    {/* Cột Phải: Thông tin chi tiết */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <p className="text-sm text-blue-600 font-bold uppercase tracking-[0.2em] mb-3">
                            {product.category || 'Nước hoa cao cấp'}
                        </p>
                        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
                            {product.productName}
                        </h1>

                        <div className="flex items-end gap-4 mb-6">
                            <span className="text-3xl font-black text-red-600">
                                {product.price?.toLocaleString('vi-VN')} <span className="text-xl text-gray-500 underline">đ</span>
                            </span>
                            {product.availability > 0 ? (
                                <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-3 py-1 rounded-full mb-1">
                                    Kho: {product.availability}
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-700 text-sm font-bold px-3 py-1 rounded-full mb-1">
                                    Hết hàng
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            {product.description || "Một tuyệt tác mùi hương giúp bạn khẳng định phong cách cá nhân và thu hút mọi ánh nhìn. Phù hợp cho cả ngày thường và những dịp đặc biệt."}
                        </p>

                        <Divider />

                        {/* Chọn số lượng */}
                        <div className="mb-8 mt-6">
                            <span className="block text-sm font-bold text-gray-700 mb-3">Số lượng</span>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
                                    <button onClick={handleDecrease} className="w-10 h-10 flex justify-center items-center rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-600">
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                    <button onClick={handleIncrease} className="w-10 h-10 flex justify-center items-center rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-600">
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Nút Hành Động */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <button
                                onClick={() => addToCart(product, quantity)} // Kích hoạt sự kiện mua hàng
                                disabled={product.availability === 0}
                                className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag size={20} />
                                Thêm Vào Giỏ
                            </button>
                            <button className="p-4 bg-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm">
                                <Heart size={24} />
                            </button>
                        </div>

                        {/* Cam kết cửa hàng */}
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><ShieldCheck size={20} /></div>
                                <span className="text-sm font-semibold">100% Chính hãng</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><Truck size={20} /></div>
                                <span className="text-sm font-semibold">Giao hàng toàn quốc</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

// Component chia vạch ngang tiện ích
const Divider = () => <div className="h-px bg-gray-100 w-full"></div>;

export default ProductDetail;