import React from 'react';

const ProductCard = ({ product }) => {
  // Đường dẫn ảnh từ Backend (ví dụ cổng 8810 hoặc qua Gateway)
  const imageUrl = `http://localhost:8900/api/catalog/products/images/${product.imageName}`;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border p-4 group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
        <img 
          src={imageUrl} 
          alt={product.productName} 
          className="h-64 w-full object-cover object-center group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-sm text-gray-700 font-semibold truncate">{product.productName}</h3>
        <p className="mt-1 text-lg font-bold text-red-600">{product.price.toLocaleString()}đ</p>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;