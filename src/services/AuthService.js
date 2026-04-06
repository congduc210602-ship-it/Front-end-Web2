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