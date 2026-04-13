import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // 1. Import thêm PropTypes

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Khi có thay đổi user, lưu lại vào LocalStorage
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
            setCurrentUser(data); // Lưu thông tin người dùng (gồm cả token và role)
            return data; // Trả về data để component gọi biết kết quả
        } catch (error) {
            throw error;
        }
    };

    const logoutUser = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ currentUser, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// 2. Thêm đoạn này để dập tắt lỗi ESLint
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);