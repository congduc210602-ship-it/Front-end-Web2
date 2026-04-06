// Thay đổi URL này cho khớp với cấu hình API Gateway của bạn
const API_BASE_URL = "http://localhost:8900/api/accounts";

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`);
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
            headers: { "Content-Type": "application/json" },
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
            headers: { "Content-Type": "application/json" },
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
        });
        if (!response.ok) throw new Error("Lỗi khi thay đổi trạng thái");
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};