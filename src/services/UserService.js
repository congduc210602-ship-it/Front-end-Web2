// Thay đổi URL này cho khớp với cấu hình API Gateway của bạn
const API_BASE_URL = "http://localhost:8900/api/accounts";

// HÀM TIỆN ÍCH: Lấy Header có chứa Token xác thực
const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}` // Gửi token lên server
        };
    }
    return {
        "Content-Type": "application/json"
    };
};

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: getAuthHeaders() // Thêm headers vào đây (nếu API này cần bảo mật)
        });
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách người dùng");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const addUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            method: "POST",
            headers: getAuthHeaders(), // Thêm headers
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error("Lỗi khi thêm người dùng");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(), // Thêm headers
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error("Lỗi khi cập nhật người dùng");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const toggleUserStatus = async (id, activeStatus) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${id}/status?active=${activeStatus}`, {
            method: "PATCH",
            headers: getAuthHeaders() // Thêm headers
        });
        if (!response.ok) throw new Error("Lỗi khi thay đổi trạng thái");
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Lấy thông tin chi tiết của 1 user (dùng cho trang cá nhân)
export const getUserById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            headers: getAuthHeaders() // Thêm headers
        });
        if (!response.ok) throw new Error("Lỗi khi lấy thông tin người dùng");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Cập nhật thông tin cá nhân của khách hàng
export const updateCustomerProfile = async (id, userDetails) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}/details`, {
            method: "PUT",
            headers: getAuthHeaders(), // QUAN TRỌNG: Gửi Token lên đây
            body: JSON.stringify(userDetails),
        });

        if (!response.ok) {
            // Log thêm thông tin để dễ debug nếu vẫn lỗi
            const errData = await response.text();
            console.error("Lỗi từ server:", errData);
            throw new Error("Lỗi khi cập nhật thông tin");
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi network hoặc throw từ trên xuống:", error);
        throw error;
    }
};

// Cập nhật mật khẩu khách hàng
export const changePassword = async (id, oldPassword, newPassword) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}/password?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`, {
            method: "PUT",
            headers: getAuthHeaders(), // Nhớ gửi kèm Token
        });

        const data = await response.text();
        if (!response.ok) {
            throw new Error(data || "Lỗi khi đổi mật khẩu");
        }
        return data;
    } catch (error) {
        console.error("Lỗi network hoặc throw từ trên xuống:", error);
        throw error;
    }
};