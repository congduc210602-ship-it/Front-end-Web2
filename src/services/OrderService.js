// Nếu Gateway map order-service qua /api/shop:
const API_BASE_URL = "http://localhost:8900/api/shop";

export const getAllOrders = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách đơn hàng");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getOrderById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`);
        if (!response.ok) throw new Error("Lỗi khi lấy chi tiết đơn hàng");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateOrderStatus = async (id, status) => {
    try {
        // Lưu ý: Backend Java của bạn đang dùng @RequestParam("status")
        const response = await fetch(`${API_BASE_URL}/orders/${id}/status?status=${status}`, {
            method: "POST", // Backend đang dùng PostMapping
        });
        if (!response.ok) throw new Error("Lỗi khi cập nhật trạng thái");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};