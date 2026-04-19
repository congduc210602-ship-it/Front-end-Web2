import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Rating from "@mui/material/Rating"; // Sử dụng thư viện sao có sẵn trong project
import { getAverageRating } from 'services/ReviewService'; // Import hàm tính trung bình sao

const ProductCard = ({ product }) => {
    const [avgRating, setAvgRating] = useState(0);
    const { addToCart } = useCart();
    const finalImageUrl = product.imageUrl || 'https://placehold.co/300x400?text=No+Image';

    // Lấy điểm đánh giá trung bình khi component hiển thị
    useEffect(() => {
        const fetchRating = async () => {
            if (product.productName) {
                const rating = await getAverageRating(product.productName);
                setAvgRating(Number(rating));
            }
        };
        fetchRating();
    }, [product.productName]);

    // Hàm xử lý thêm vào giỏ hàng
    const handleAddToCart = (e) => {
        e.preventDefault(); // Quan trọng: Ngăn không cho thẻ <Link> chuyển trang khi click nút
        e.stopPropagation(); // Ngăn sự kiện nổi bọt
        addToCart(product, 1);
        // Bạn có thể thêm alert hoặc notification ở đây nếu muốn
    };

    return (
        
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

                    {/* Badge Hot */}
                    <div className="absolute top-4 left-4 bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest z-10">
                        Hot
                    </div>

                    {/* Nút Thêm nhanh vào giỏ (Hiện khi hover) */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex justify-center gap-2">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.availability === 0}
                            className="bg-white text-gray-900 flex-1 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingBag size={18} /> Thêm vào giỏ
                        </button>
                    </div>
                </div>

                {/* Vùng thông tin sản phẩm */}
                <div className="p-5 flex flex-col flex-grow">
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">
                        {product.category || "Nước hoa cao cấp"}
                    </p>

                    {/* HIỂN THỊ SAO ĐÁNH GIÁ */}
                    <div className="flex items-center mb-2">
                        <Rating
                            value={avgRating}
                            readOnly
                            size="small"
                            precision={0.5}
                        />
                        {avgRating > 0 && (
                            <span className="text-[10px] text-gray-400 ml-1">({avgRating})</span>
                        )}
                    </div>

                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                        {product.productName}
                    </h3>

                    <div className="mt-auto flex items-end justify-between">
                        <div>
                            <span className="text-lg font-black text-gray-900">
                                {product.price?.toLocaleString('vi-VN')} <span className="text-sm text-gray-500 font-medium underline">đ</span>
                            </span>
                        </div>

                        {product.availability > 0 ? (
                            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">
                                Còn {product.availability} sp
                            </span>
                        ) : (
                            <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-md">
                                Hết hàng
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