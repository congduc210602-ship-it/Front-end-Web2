import React, { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data (Sử dụng data mẫu của template cho các biểu đồ)
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
//import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  // === STATE LƯU TRỮ DỮ LIỆU THẬT ===
  const [stats, setStats] = useState({
    productsCount: 0,
    usersCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
  });

  // === GỌI API LẤY THỐNG KÊ KHI VÀO TRANG ===
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // 1. Lấy tổng Sản Phẩm
      const prodRes = await fetch("http://localhost:8900/api/catalog/admin/products/count");
      const prodData = prodRes.ok ? await prodRes.json() : 0;

      // 2. Lấy tổng Người Dùng (Đã dùng API tránh đụng độ)
      const userRes = await fetch("http://localhost:8900/api/accounts/users/dashboard/count");
      const userData = userRes.ok ? await userRes.json() : 0;

      // 3. Lấy tổng Đơn Hàng (Đã dùng API tránh đụng độ)
      const orderRes = await fetch("http://localhost:8900/api/shop/orders/dashboard/count");
      const orderData = orderRes.ok ? await orderRes.json() : 0;

      // 4. Lấy tổng Doanh Thu (Đã dùng API tránh đụng độ)
      const revenueRes = await fetch("http://localhost:8900/api/shop/orders/dashboard/revenue");
      const revenueData = revenueRes.ok ? await revenueRes.json() : 0;

      // Cập nhật State một lần
      setStats({
        productsCount: prodData,
        usersCount: userData,
        ordersCount: orderData,
        totalRevenue: revenueData,
      });
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Dashboard:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* === HÀNG 1: 4 Ô THỐNG KÊ (DỮ LIỆU THẬT TỪ SQL) === */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Tổng Sản Phẩm"
                count={stats.productsCount}
                percentage={{
                  color: "success",
                  amount: "Cập nhật",
                  label: " real-time",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Người Dùng"
                count={stats.usersCount}
                percentage={{
                  color: "success",
                  amount: "Cập nhật",
                  label: " real-time",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="shopping_cart"
                title="Đơn Hàng"
                count={stats.ordersCount}
                percentage={{
                  color: "error",
                  amount: "Cập nhật",
                  label: " real-time",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="attach_money"
                title="Doanh Thu"
                count={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)}
                percentage={{
                  color: "success",
                  amount: "Cập nhật",
                  label: " real-time",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* === HÀNG 2: 3 BIỂU ĐỒ (SỬ DỤNG DATA MẪU) === */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Lượt truy cập"
                  description="Hiệu suất chiến dịch gần nhất"
                  date="cập nhật 2 ngày trước"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Doanh số hằng ngày"
                  description={
                    <>
                      (<strong>+15%</strong>) tăng trưởng doanh số hôm nay.
                    </>
                  }
                  date="cập nhật 4 phút trước"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Đơn hàng hoàn thành"
                  description="Hiệu suất chiến dịch gần nhất"
                  date="vừa cập nhật"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* === HÀNG 3: BẢNG DỰ ÁN VÀ TỔNG QUAN ĐƠN HÀNG (GIỮ NGUYÊN NHƯ CŨ CỦA BẠN) === */}
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>

      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;