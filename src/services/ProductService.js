// src/services/ProductService.js

// Đảm bảo URL này khớp với cấu hình Gateway của bạn
const API_BASE_URL = "http://localhost:8900/api/catalog";
// 1. Hàm lấy danh sách
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, { method: "GET" });
    if (!response.ok) throw new Error(`Lỗi gọi API: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi:", error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error("Lỗi khi lấy chi tiết sản phẩm");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 2. Hàm upload ảnh
export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch(`${API_BASE_URL}/admin/products/upload-image`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error(`Lỗi upload: ${response.status}`);
    const imageUrl = await response.text();
    return imageUrl;
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    throw error;
  }
};

// 3. Hàm thêm sản phẩm (JSON)
export const addProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error(`Lỗi API: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi thêm sản phẩm:", error);
    throw error;
  }
};

// Hàm xóa sản phẩm
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Lỗi gọi API xóa: ${response.status}`);
    }

    return true; // Trả về true nếu xóa thành công
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    throw error;
  }
};

// Hàm cập nhật sản phẩm
export const updateProduct = async (id, productData) => {
  try {
    // Thông thường API sửa sẽ dùng method PUT và truyền id lên đường dẫn
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Lỗi gọi API sửa: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi sửa sản phẩm:", error);
    throw error;
  }
};

// Hàm lấy tổng số lượng sản phẩm cho Dashboard
export const getTotalProductsCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/products/count`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Lỗi gọi API count: ${response.status}`);
    }
    const count = await response.json();
    return count;
  } catch (error) {
    console.error("Lỗi khi đếm sản phẩm:", error);
    return 0;
  }
};
