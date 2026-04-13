import React from 'react';
import PropTypes from 'prop-types';
import { ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom'; // 1. Import thẻ Link

const ProductCard = ({ product }) => {
    const finalImageUrl = product.imageUrl || 'https://placehold.co/300x400?text=No+Image';

    return (
        // 2. Bọc toàn bộ card bằng thẻ Link, trỏ đến đường dẫn /product/{id}
        <Link to={`/product/${product.id}`} className="block h-full">
            <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-gray-100 flex flex-col h-full relative cursor-pointer">

                {/* Vùng hình ảnh */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                    <img
                        src={finalImageUrl}
                        alt={product.productName}
                        className="w-full h-full object-contain mix-blend-multiply transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.target.src = 'https://placehold.co/300x400?text=No+Image'; }}
                    />
                    <div className="absolute top-4 left-4 bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest z-10">
                        Hot
                    </div>
                    {/* Overlay Action Buttons */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex justify-center gap-2">
                        <button
                            onClick={(e) => e.preventDefault()} // Ngăn Link chuyển trang khi bấm nút thêm vào giỏ
                            className="bg-white text-gray-900 flex-1 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={18} /> Thêm vào giỏ
                        </button>
                    </div>
                </div>

                {/* Vùng thông tin */}
                <div className="p-5 flex flex-col flex-grow">
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">
                        {product.category || "Nước hoa cao cấp"}
                    </p>
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                        {product.productName}
                    </h3>
                    <div className="mt-auto flex items-end justify-between">
                        <div>
                            <span className="text-lg font-black text-gray-900">
                                {product.price?.toLocaleString('vi-VN')} <span className="text-sm text-gray-500 font-medium underline">đ</span>
                            </span>
                        </div>
                        {product.availability > 0 && (
                            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">
                                Còn {product.availability} sp
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        productName: PropTypes.string,
        price: PropTypes.number,
        imageUrl: PropTypes.string,
        category: PropTypes.string,
        availability: PropTypes.number
    }).isRequired,
};

export default ProductCard;