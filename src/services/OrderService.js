// Nếu Gateway map order-service qua /api/shop:
const API_BASE_URL = "http://localhost:8900/api/shop";
const PAYMENT_API_URL = "http://localhost:8900/api/pay/payment";

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

// === THÊM HÀM MỚI: TẠO ĐƠN HÀNG ===
export const createOrder = async (userId, orderData) => {
    try {
        // Gọi vào API mới: /order/checkout/{userId}
        const response = await fetch(`${API_BASE_URL}/order/checkout/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // Ép orderData thành JSON để Java nhận qua @RequestBody
            body: JSON.stringify(orderData),
        });

        if (!response.ok) throw new Error("Lỗi khi tạo đơn hàng");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createVNPayPayment = async (amount, orderId) => {
    try {
        // Gọi API create-vnpay của PaymentController
        const response = await fetch(`${PAYMENT_API_URL}/create-vnpay?amount=${amount}&orderId=${orderId}`, {
            method: "POST"
        });
        if (!response.ok) throw new Error("Không thể tạo link VNPay");

        // Trả về text dạng URL (vì Backend đang trả về ResponseEntity.ok(url_string))
        return await response.text();
    } catch (error) {
        console.error("Lỗi VNPay:", error);
        throw error;
    }
};