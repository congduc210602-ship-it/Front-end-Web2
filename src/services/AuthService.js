const API_BASE_URL = "http://localhost:8900/api/accounts";

export const login = async (userName, userPassword) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userName, userPassword }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Tài khoản hoặc mật khẩu không đúng!");
        }

        const data = await response.json();

        // Nếu đăng nhập thành công và là ADMIN
        if (data.token) {
            localStorage.setItem("user", JSON.stringify(data)); // Lưu thông tin user và token
            return data;
        } else {
            throw new Error("Bạn không có quyền truy cập vào trang quản trị!");
        }
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/authentication/sign-in";
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};


export const registerUser = async (userName, email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/registration`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: userName,
                userPassword: password,
                active: 1,
                userDetails: {
                    email: email,
                    // THÊM 2 DÒNG NÀY ĐỂ TRÁNH LỖI NOT NULL Ở DATABASE
                    firstName: "Khách",
                    lastName: "Hàng"
                }
            }),
        });

        if (!response.ok) {
            throw new Error("Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại!");
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        throw error;
    }
};

// API: Gửi yêu cầu khôi phục mật khẩu (nhập email)
export const forgotPassword = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/forgot-password?email=${encodeURIComponent(email)}`, {
            method: "POST",
        });

        const data = await response.text(); // Đọc dạng text vì backend trả về chuỗi
        if (!response.ok) {
            throw new Error(data || "Lỗi khi gửi yêu cầu khôi phục mật khẩu.");
        }
        return data;
    } catch (error) {
        console.error("Lỗi forgotPassword:", error);
        throw error;
    }
};

