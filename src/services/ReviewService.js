const API_BASE_URL = "http://localhost:8900/api/review";

// Lấy tất cả đánh giá cho Admin
export const getAllReviews = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/recommendations`);
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách đánh giá");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Xóa một đánh giá
export const deleteReview = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recommendations/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Lỗi khi xóa đánh giá");
    } catch (error) {
        console.error(error);
        throw error;
    }
};
