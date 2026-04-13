import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // 1. Import PropTypes để fix lỗi

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Khởi tạo giỏ hàng từ localStorage nếu có
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Mỗi khi giỏ hàng thay đổi, tự động lưu vào localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Hàm thêm sản phẩm
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const isExist = prevItems.find(item => item.id === product.id);
            if (isExist) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });
        alert(`Đã thêm ${product.productName} vào giỏ hàng!`);
    };

    // Hàm xóa sản phẩm
    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    // Hàm cập nhật số lượng
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
        );
    };

    // Tính tổng số lượng hiển thị trên Badge
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

// 2. Khai báo PropTypes cho children để dập tắt lỗi của ESLint
CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useCart = () => useContext(CartContext);