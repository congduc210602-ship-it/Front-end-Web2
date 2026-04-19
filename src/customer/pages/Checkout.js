import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder, createVNPayPayment } from '../../services/OrderService'; // Import hàm gọi API
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, CheckCircle, MapPin, CreditCard, ShoppingBag } from 'lucide-react';

const Checkout = () => {
    const { cartItems, clearCartState } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Form thông tin nhận hàng
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const [paymentMethod, setPaymentMethod] = useState('COD');

    useEffect(() => {
        window.scrollTo(0, 0);
        // Nếu chưa đăng nhập hoặc giỏ hàng trống thì đuổi về
        if (!currentUser) navigate('/authentication/sign-in');
        if (cartItems.length === 0 && !orderSuccess) navigate('/cart');
    }, [currentUser, cartItems.length, navigate, orderSuccess]);

    // Xử lý khi bấm nút "Xác Nhận Đặt Hàng"
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!address.trim()) return alert('Vui lòng nhập địa chỉ giao hàng!');

        setIsSubmitting(true);
        try {
            const actualUserId = currentUser?.id || currentUser?.userId;

            const orderItems = cartItems.map(item => ({
                quantity: item.quantity,
                subTotal: item.price * item.quantity,
                product: {
                    id: item.id,
                    productName: item.productName,
                    price: item.price
                }
            }));

            const newOrder = {
                paymentMethod: paymentMethod, // Truyền phương thức thanh toán lên
                address: `${address} (Ghi chú: ${note})`,
                total: totalPrice,
                items: orderItems
            };

            // 1. LƯU ĐƠN HÀNG VÀO DATABASE TRƯỚC
            const savedOrder = await createOrder(actualUserId, newOrder);
            clearCartState();

            // 2. XỬ LÝ THEO PHƯƠNG THỨC THANH TOÁN
            if (paymentMethod === 'VNPAY') {
                // Gọi API lấy Link VNPay (truyền ID đơn hàng vừa tạo)
                const paymentUrl = await createVNPayPayment(totalPrice, savedOrder.id);
                // Chuyển hướng người dùng sang trang của VNPay
                window.location.href = paymentUrl;
            } else {
                // Nếu là COD, hiện màn hình thành công luôn
                setOrderSuccess(true);
            }

        } catch (error) {
            alert('Có lỗi xảy ra khi đặt hàng, vui lòng thử lại!');
            setIsSubmitting(false); // Chỉ tắt loading nếu lỗi
        }
    };

    // Giao diện khi đặt hàng xong
    if (orderSuccess) {
        return (
            <div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans">
                <Navbar />
                <div className="flex-grow flex items-center justify-center p-4">
                    <div className="bg-white p-12 rounded-3xl shadow-lg max-w-lg w-full text-center border border-gray-100">
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Đặt Hàng Thành Công!</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Cảm ơn bạn đã mua sắm tại Perfume. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
                        </p>
                        <button onClick={() => navigate('/')} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 mx-auto">
                            <ShoppingBag size={20} /> Tiếp Tục Mua Sắm
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Giao diện Form Thanh Toán
    return (
        <div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
                <button onClick={() => navigate('/cart')} className="flex items-center text-gray-500 hover:text-gray-900 font-medium mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Quay lại giỏ hàng
                </button>

                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-10">Thanh Toán</h1>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Cột trái: Form địa chỉ */}
                    <div className="w-full lg:w-2/3">
                        <form onSubmit={handlePlaceOrder} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <MapPin size={24} className="text-blue-600" /> Thông tin giao hàng
                            </h3>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Người nhận</label>
                                <input
                                    type="text"
                                    value={currentUser?.userName || 'Khách hàng'}
                                    disabled
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ nhận hàng (*)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ví dụ: 123 Đường ABC, Phường X, Quận Y..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-4">Phương thức thanh toán</label>

                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer mb-3 transition-all ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={() => setPaymentMethod('COD')}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <span className="ml-3 font-medium text-gray-900">Thanh toán tiền mặt khi nhận hàng (COD)</span>
                                </label>

                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'VNPAY' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="VNPAY"
                                        checked={paymentMethod === 'VNPAY'}
                                        onChange={() => setPaymentMethod('VNPAY')}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <span className="ml-3 font-medium text-gray-900">Thanh toán qua VNPAY</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <CreditCard size={20} /> {isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}
                            </button>
                        </form>
                    </div>

                    {/* Cột phải: Hóa đơn mini */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Đơn hàng của bạn ({cartItems.length})</h3>

                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 border-b border-gray-50 pb-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center p-1">
                                            <img src={item.imageUrl || 'https://placehold.co/100'} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.productName}</h4>
                                            <p className="text-xs text-gray-500">SL: x{item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-bold text-red-600 flex-shrink-0">
                                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Tạm tính</span>
                                    <span className="font-bold">{totalPrice.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Phí giao hàng</span>
                                    <span className="font-bold text-emerald-600">Miễn phí</span>
                                </div>
                                <div className="flex justify-between items-end pt-4 mt-2 border-t border-gray-100">
                                    <span className="text-base font-bold text-gray-900">Tổng tiền thanh toán</span>
                                    <span className="text-2xl font-black text-red-600">{totalPrice.toLocaleString('vi-VN')} đ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Checkout;