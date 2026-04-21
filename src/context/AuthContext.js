import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('user');
        }
    }, [currentUser]);

    // Hàm thực hiện gọi API đăng nhập
    const loginUser = async (userName, password) => {
        try {
            const response = await fetch("http://localhost:8900/api/accounts/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName, userPassword: password })
            });

            if (!response.ok) throw new Error("Sai tài khoản hoặc mật khẩu!");

            const data = await response.json();

            // --- FIX LỖI ĐĂNG NHẬP 2 LẦN Ở ĐÂY ---
            // Lưu ngay lập tức vào localStorage để App.js kịp đọc được khi bị redirect
            localStorage.setItem('user', JSON.stringify(data));
            // ------------------------------------

            setCurrentUser(data); // Cập nhật state
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logoutUser = () => {
        // --- FIX LỖI Ở ĐÂY LUÔN CHO CHẮC ---
        localStorage.removeItem('user'); // Xóa ngay lập tức khi đăng xuất
        // -----------------------------------
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};


AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);