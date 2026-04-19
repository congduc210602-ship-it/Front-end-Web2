import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import ProductCard from '../components/ProductCard';
import { getProductById, getAllProducts } from 'services/ProductService';
import { getReviewsByProductName, saveReview } from 'services/ReviewService'; // IMPORT REVIEW SERVICE
import { ShoppingBag, Heart, ShieldCheck, Truck, ArrowLeft, Minus, Plus, Star, Send } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // ĐỂ KIỂM TRA ĐĂNG NHẬP
import Rating from "@mui/material/Rating"; // DÙNG CHUNG THƯ VIỆN SAO VỚI ADMIN

const ProductDetail = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviews, setReviews] = useState([]); // STATE LƯU ĐÁNH GIÁ
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    // State cho Form Đánh giá
    const [userRating, setUserRating] = useState(5);
    const [userComment, setUserComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const currentProduct = await getProductById(id);
                setProduct(currentProduct);

                if (currentProduct) {
                    // 1. Lấy sản phẩm liên quan
                    const allProducts = await getAllProducts();
                    setRelatedProducts(allProducts.filter(p => p.category === currentProduct.category && String(p.id) !== String(id)).slice(0, 4));

                    // 2. Lấy danh sách đánh giá của sản phẩm này
                    const reviewData = await getReviewsByProductName(currentProduct.productName);
                    setReviews(reviewData.sort((a, b) => b.id - a.id));
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);
        setQuantity(1);
    }, [id]);

    // Hàm gửi đánh giá
    const handleSubmitReview = async (e) => {
        e.preventDefault();

        // Kiểm tra xem user có thực sự tồn tại không
        if (!currentUser) {
            alert("Vui lòng đăng nhập để đánh giá!");
            return;
        }

        // Tự động tìm ID (thử cả .id và .userId)
        const actualUserId = currentUser.id || currentUser.userId;

        if (!actualUserId) {
            console.error("Dữ liệu User hiện tại:", currentUser);
            alert("Lỗi: Không tìm thấy ID người dùng trong hệ thống!");
            return;
        }

        if (!userComment.trim()) return alert("Vui lòng nhập nội dung bình luận!");

        setSubmitting(true);
        try {
            // Sử dụng actualUserId đã tìm được ở trên
            await saveReview(actualUserId, product.id, userRating, userComment);
            alert("Cảm ơn bạn đã đánh giá sản phẩm!");
            setUserComment("");

            const updatedReviews = await getReviewsByProductName(product.productName);
            setReviews(updatedReviews.sort((a, b) => b.id - a.id));
        } catch (error) {
            alert("Gửi đánh giá thất bại!");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div></div>;
    if (!product) return <div className="p-20 text-center"><h2>Không tìm thấy sản phẩm!</h2><Link to="/">Quay lại</Link></div>;

    return (
        <div className="bg-white min-h-screen font-sans">
            <Navbar />

            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 text-sm text-gray-500 font-medium">
                    <Link to="/" className="hover:text-blue-600">Trang chủ</Link> / <span>{product.category}</span> / <span className="text-gray-900">{product.productName}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Thông tin sản phẩm chính */}
                <div className="flex flex-col md:flex-row gap-12 mb-24">
                    {/* Cột ảnh */}
                    <div className="w-full md:w-1/2">
                        <div className="bg-gray-50 rounded-3xl p-8 aspect-[4/5] flex items-center justify-center">
                            <img src={product.imageUrl || 'https://placehold.co/600x800'} className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl" alt={product.productName} />
                        </div>
                    </div>

                    {/* Cột thông tin */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <p className="text-sm text-blue-600 font-bold uppercase tracking-widest mb-3">{product.category}</p>
                        <h1 className="text-4xl font-black text-gray-900 mb-4">{product.productName}</h1>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-black text-red-600">{product.price?.toLocaleString('vi-VN')} đ</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.availability > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {product.availability > 0 ? `Còn hàng: ${product.availability}` : 'Hết hàng'}
                            </span>
                        </div>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description}</p>

                        <div className="flex items-center gap-6 mb-10">
                            <div className="flex items-center bg-gray-100 rounded-full p-1">
                                <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all"><Minus size={16} /></button>
                                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                <button onClick={() => setQuantity(q => q < product.availability ? q + 1 : q)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all"><Plus size={16} /></button>
                            </div>
                            <button onClick={() => addToCart(product, quantity)} disabled={product.availability === 0} className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                                <ShoppingBag size={20} /> Thêm Vào Giỏ
                            </button>
                        </div>
                    </div>
                </div>

                {/* === SECTION ĐÁNH GIÁ VÀ BÌNH LUẬN === */}
                <div className="border-t border-gray-100 pt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                        {/* Cột 1: Form viết đánh giá */}
                        <div className="lg:col-span-1">
                            <h2 className="text-2xl font-black text-gray-900 mb-6">Đánh giá sản phẩm</h2>
                            {currentUser ? (
                                <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                    <p className="text-sm font-bold text-gray-700 mb-2">Số sao bạn chọn:</p>
                                    <Rating
                                        value={userRating}
                                        onChange={(event, newValue) => setUserRating(newValue)}
                                        size="large"
                                        className="mb-4"
                                    />
                                    <textarea
                                        rows="4"
                                        placeholder="Cảm nhận của bạn về sản phẩm..."
                                        className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all mb-4"
                                        value={userComment}
                                        onChange={(e) => setUserComment(e.target.value)}
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:bg-gray-400"
                                    >
                                        <Send size={18} /> {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                                    </button>
                                </form>
                            ) : (
                                <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 text-center">
                                    <p className="text-orange-700 font-medium mb-4">Vui lòng đăng nhập để gửi đánh giá!</p>
                                    <Link to="/authentication/sign-in" className="inline-block bg-orange-600 text-white px-6 py-2 rounded-xl font-bold text-sm">Đăng nhập ngay</Link>
                                </div>
                            )}
                        </div>

                        {/* Cột 2 & 3: Danh sách các bình luận */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-gray-900">Bình luận từ khách hàng ({reviews.length})</h3>
                            </div>

                            {reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map((rev) => (
                                        <div key={rev.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold uppercase">
                                                        {rev.user?.userName?.charAt(0) || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{rev.user?.userName || "Khách hàng"}</p>
                                                        <Rating value={rev.rating} readOnly size="small" />
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md">#{rev.id}</span>
                                            </div>
                                            <p className="text-gray-600 text-sm italic leading-relaxed">
                                                &quot;{rev.comment || "Không có lời bình luận..."}&quot;
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <Star className="mx-auto text-gray-300 mb-4" size={40} />
                                    <p className="text-gray-500 font-medium">Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sản phẩm liên quan */}
                {relatedProducts.length > 0 && (
                    <div className="mt-32">
                        <h2 className="text-2xl font-black text-gray-900 mb-8">Có Thể Bạn Sẽ Thích</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};



export default ProductDetail;