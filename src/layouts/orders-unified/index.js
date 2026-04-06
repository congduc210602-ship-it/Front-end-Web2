import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// API
import { getAllOrders, updateOrderStatus } from "../../services/OrderService";

function OrdersUnified() {
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const data = await getAllOrders();
        // Sắp xếp đơn mới nhất lên đầu
        data.sort((a, b) => b.id - a.id);
        setOrders(data);
    };

    const handleOpenModal = (order) => {
        setCurrentOrder(order);
        setNewStatus(order.status);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleStatusChange = async () => {
        setIsUpdating(true);
        try {
            await updateOrderStatus(currentOrder.id, newStatus);
            alert("Cập nhật trạng thái thành công!");
            fetchOrders();
            handleCloseModal();
        } catch (error) {
            alert("Lỗi khi cập nhật trạng thái!");
        } finally {
            setIsUpdating(false);
        }
    };

    // Hàm chuyển đổi màu Chip theo Status
    const getStatusColor = (status) => {
        switch (status) {
            case "PAID": return "success";
            case "PAYMENT_EXPECTED": return "warning";
            case "PAYMENT_FAILED": return "error";
            case "SHIPPING": return "info";
            case "COMPLETED": return "dark";
            default: return "secondary";
        }
    };

    // Cấu hình bảng
    const columns = [
        { Header: "Mã Đơn", accessor: "id", width: "10%", align: "center" },
        { Header: "Khách Hàng", accessor: "customer", align: "left" },
        { Header: "Ngày Đặt", accessor: "date", align: "center" },
        { Header: "Tổng Tiền", accessor: "total", align: "right" },
        { Header: "Trạng Thái", accessor: "status", align: "center" },
        { Header: "Hành Động", accessor: "action", align: "center" },
    ];

    const rows = orders.map((order) => ({
        id: <MDTypography variant="caption" fontWeight="bold">#{order.id}</MDTypography>,
        customer: <MDTypography variant="caption" fontWeight="medium">{order.user?.userName || "Khách vãng lai"}</MDTypography>,
        date: <MDTypography variant="caption">{order.orderedDate}</MDTypography>,
        total: <MDTypography variant="button" fontWeight="medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</MDTypography>,
        status: (
            <MDBox ml={-1}>
                <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
            </MDBox>
        ),
        action: (
            <MDButton variant="text" color="info" onClick={() => handleOpenModal(order)}>
                <Icon>visibility</Icon>&nbsp;Chi Tiết
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
                            <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="warning" borderRadius="lg" coloredShadow="warning" display="flex" justifyContent="space-between" alignItems="center">
                                <MDTypography variant="h6" color="white">Quản Lý Đơn Hàng</MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={true} noEndBorder />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>

            {/* POPUP CHI TIẾT ĐƠN HÀNG */}
            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>Chi Tiết Đơn Hàng #{currentOrder?.id}</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        {/* Cột trái: Thông tin khách & trạng thái */}
                        <Grid item xs={12} md={5}>
                            <MDTypography variant="h6" fontWeight="medium">Thông tin khách hàng</MDTypography>
                            <MDTypography variant="caption" display="block">Tài khoản: {currentOrder?.user?.userName}</MDTypography>
                            <MDTypography variant="caption" display="block">Ngày đặt: {currentOrder?.orderedDate}</MDTypography>

                            <Divider sx={{ my: 2 }} />

                            <MDTypography variant="h6" fontWeight="medium" mb={1}>Cập nhật trạng thái</MDTypography>
                            <Select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                fullWidth
                                sx={{ height: 40 }}
                            >
                                <MenuItem value="PAYMENT_EXPECTED">Chờ thanh toán (PAYMENT_EXPECTED)</MenuItem>
                                <MenuItem value="PAYMENT_FAILED">Thanh toán lỗi (PAYMENT_FAILED)</MenuItem>
                                <MenuItem value="PAID">Đã thanh toán (PAID)</MenuItem>
                                <MenuItem value="SHIPPING">Đang giao hàng (SHIPPING)</MenuItem>
                                <MenuItem value="COMPLETED">Hoàn thành (COMPLETED)</MenuItem>
                                <MenuItem value="CANCELED">Đã hủy (CANCELED)</MenuItem>
                            </Select>
                        </Grid>

                        {/* Cột phải: Danh sách sản phẩm */}
                        <Grid item xs={12} md={7}>
                            <MDTypography variant="h6" fontWeight="medium" mb={1}>Sản phẩm đã mua</MDTypography>
                            <Card sx={{ p: 2, bgcolor: "#f8f9fa" }}>
                                {currentOrder?.items?.map((item, index) => (
                                    <MDBox key={index} display="flex" justifyContent="space-between" mb={1}>
                                        <MDTypography variant="caption">
                                            {item.quantity} x {item.product?.productName || "Sản phẩm ẩn"}
                                        </MDTypography>
                                        <MDTypography variant="caption" fontWeight="bold">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.subTotal)}
                                        </MDTypography>
                                    </MDBox>
                                ))}
                                <Divider />
                                <MDBox display="flex" justifyContent="space-between">
                                    <MDTypography variant="button" fontWeight="bold">TỔNG CỘNG:</MDTypography>
                                    <MDTypography variant="button" color="error" fontWeight="bold">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentOrder?.total)}
                                    </MDTypography>
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <MDButton onClick={handleCloseModal} color="secondary">Đóng</MDButton>
                    <MDButton variant="gradient" color="info" onClick={handleStatusChange} disabled={isUpdating}>
                        {isUpdating ? "Đang lưu..." : "Lưu Trạng Thái"}
                    </MDButton>
                </DialogActions>
            </Dialog>
        </DashboardLayout>
    );
}

export default OrdersUnified;