import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Rating from "@mui/material/Rating"; // Thư viện hiển thị Ngôi sao

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Import API
import { getAllReviews, deleteReview } from "../../services/ReviewService";

function ReviewsUnified() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const data = await getAllReviews();
        // Sắp xếp đánh giá mới nhất (ID lớn nhất) lên đầu
        data.sort((a, b) => b.id - a.id);
        setReviews(data);
    };

    // Xử lý Xóa đánh giá
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
            try {
                await deleteReview(id);
                alert("Đã xóa đánh giá thành công!");
                fetchReviews(); // Load lại bảng
            } catch (error) {
                alert("Lỗi khi xóa đánh giá!");
            }
        }
    };

    // Cấu hình các cột cho Bảng
    const columns = [
        { Header: "ID", accessor: "id", width: "5%", align: "center" },
        { Header: "Khách Hàng", accessor: "user", width: "15%", align: "left" },
        { Header: "Sản Phẩm", accessor: "product", width: "20%", align: "left" },
        { Header: "Đánh Giá", accessor: "rating", width: "15%", align: "center" },
        { Header: "Bình Luận", accessor: "comment", align: "left" },
        { Header: "Hành Động", accessor: "action", width: "10%", align: "center" },
    ];

    // Đổ dữ liệu vào hàng
    const rows = reviews.map((item) => ({
        id: (
            <MDTypography variant="caption" fontWeight="bold">
                #{item.id}
            </MDTypography>
        ),
        user: (
            <MDTypography variant="subtitle2" fontWeight="medium">
                {item.user?.userName || "Ẩn danh"}
            </MDTypography>
        ),
        product: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {item.product?.productName || "Sản phẩm đã xóa"}
            </MDTypography>
        ),
        rating: (
            <MDBox display="flex" justifyContent="center" mt={0.5}>
                <Rating value={item.rating} readOnly size="small" precision={0.5} />
            </MDBox>
        ),
        comment: (
            <MDTypography variant="caption" color="text" fontStyle="italic">
                &quot;{item.comment || "Không có lời bình luận..."}&quot;
            </MDTypography>
        ),
        action: (
            <MDButton variant="text" color="error" onClick={() => handleDelete(item.id)}>
                <Icon>delete</Icon>&nbsp;Xóa
            </MDButton>
        ),
    }));

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="success"
                                borderRadius="lg"
                                coloredShadow="success"
                            >
                                <MDTypography variant="h6" color="white">
                                    Quản Lý Đánh Giá & Bình Luận
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={true}
                                    entriesPerPage={true}
                                    showTotalEntries={true}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default ReviewsUnified;