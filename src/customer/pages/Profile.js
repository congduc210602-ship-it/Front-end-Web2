import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// NHỚ IMPORT THÊM changePassword VÀO ĐÂY
import { getUserById, updateCustomerProfile, changePassword } from '../../services/UserService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User as UserIcon, Mail, Phone, MapPin, Save, Lock, Key } from 'lucide-react'; // Import thêm icon Lock, Key

const Profile = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    // --- STATES CHO ĐỔI MẬT KHẨU ---
    const [isChangingPwd, setIsChangingPwd] = useState(false);
    const [pwdMessage, setPwdMessage] = useState('');
    const [pwdError, setPwdError] = useState('');
    const [pwdData, setPwdData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phoneNumber: '',
        street: '', locality: '', country: '', zipCode: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!currentUser) {
            navigate('/authentication/sign-in');
            return;
        }

        const fetchUserData = async () => {
            try {
                const actualUserId = currentUser.id || currentUser.userId;
                const data = await getUserById(actualUserId);

                if (data.userDetails) {
                    setFormData({
                        firstName: data.userDetails.firstName || '',
                        lastName: data.userDetails.lastName || '',
                        email: data.userDetails.email || '',
                        phoneNumber: data.userDetails.phoneNumber || '',
                        street: data.userDetails.street || '',
                        locality: data.userDetails.locality || '',
                        country: data.userDetails.country || '',
                        zipCode: data.userDetails.zipCode || ''
                    });
                }
            } catch (error) {
                console.error("Lỗi fetch user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePwdChange = (e) => {
        const { name, value } = e.target;
        setPwdData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();

        const phoneRegex = /^0\d{9}$/;
        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
            setMessage('Số điện thoại không hợp lệ! Vui lòng nhập 10 số và bắt đầu bằng số 0.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSaving(true);
        setMessage('');

        try {
            const actualUserId = currentUser.id || currentUser.userId;
            await updateCustomerProfile(actualUserId, formData);
            setMessage('Cập nhật thông tin cá nhân thành công!');
        } catch (error) {
            setMessage('Có lỗi xảy ra khi cập nhật!');
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setPwdMessage('');
        setPwdError('');

        if (pwdData.newPassword !== pwdData.confirmPassword) {
            setPwdError("Mật khẩu xác nhận không khớp!");
            return;
        }

        setIsChangingPwd(true);
        try {
            const actualUserId = currentUser.id || currentUser.userId;
            const res = await changePassword(actualUserId, pwdData.oldPassword, pwdData.newPassword);
            setPwdMessage(res || "Đổi mật khẩu thành công!");
            setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Xóa form
        } catch (error) {
            setPwdError(error.message || "Mật khẩu hiện tại không đúng!");
        } finally {
            setIsChangingPwd(false);
            setTimeout(() => setPwdMessage(''), 3000);
        }
    };

    if (isLoading) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">Đang tải...</div>;

    return (
        <div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-12 flex-grow w-full space-y-8">

                {/* === KHỐI 1: THÔNG TIN CÁ NHÂN === */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-900 px-8 py-10 text-white flex items-center gap-6">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-700">
                            <UserIcon size={40} className="text-gray-300" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">{currentUser?.userName}</h1>
                            <p className="text-gray-400 mt-1">Quản lý thông tin cá nhân của bạn</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitProfile} className="p-8">
                        {message && (
                            <div className={`p-4 rounded-xl mb-6 font-medium ${message.includes('thành công') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {message}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Họ</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tên</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Mail size={16} /> Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Phone size={16} /> Số điện thoại</label>
                                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><MapPin size={16} /> Địa chỉ (Số nhà, Đường)</label>
                                <input type="text" name="street" value={formData.street} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Phường / Xã / Quận</label>
                                <input type="text" name="locality" value={formData.locality} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Thành phố / Tỉnh</label>
                                <input type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                            <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm disabled:bg-gray-400">
                                <Save size={18} /> {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* === KHỐI 2: ĐỔI MẬT KHẨU === */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center gap-3">
                        <Lock className="text-gray-500" size={24} />
                        <h2 className="text-xl font-bold text-gray-900">Đổi Mật Khẩu</h2>
                    </div>

                    <form onSubmit={handleSubmitPassword} className="p-8">
                        {pwdMessage && <div className="p-4 rounded-xl mb-6 font-medium bg-emerald-50 text-emerald-600">{pwdMessage}</div>}
                        {pwdError && <div className="p-4 rounded-xl mb-6 font-medium bg-red-50 text-red-600">{pwdError}</div>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu hiện tại (hoặc mật khẩu tạm từ email)</label>
                                <input type="password" name="oldPassword" value={pwdData.oldPassword} onChange={handlePwdChange} required className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu mới</label>
                                <input type="password" name="newPassword" value={pwdData.newPassword} onChange={handlePwdChange} required className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                                <input type="password" name="confirmPassword" value={pwdData.confirmPassword} onChange={handlePwdChange} required className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                            <button type="submit" disabled={isChangingPwd} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-sm disabled:bg-gray-400">
                                <Key size={18} /> {isChangingPwd ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default Profile;