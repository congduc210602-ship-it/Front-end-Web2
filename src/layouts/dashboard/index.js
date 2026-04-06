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
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

// Import API đếm sản phẩm
import { getTotalProductsCount } from "../../services/ProductService";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  // State lưu tổng số sản phẩm lấy từ DB
  const [productCount, setProductCount] = useState(0);

  // Gọi API kéo dữ liệu khi trang load
  useEffect(() => {
    const fetchCount = async () => {
      const count = await getTotalProductsCount();
      setProductCount(count);
    };
    fetchCount();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* === HÀNG 1: 4 Ô THỐNG KÊ (ĐÃ CÓ DATA THẬT Ở Ô ĐẦU TIÊN) === */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Tổng Sản Phẩm"
                count={productCount} // Kéo data thật từ SQL Server vào đây
                percentage={{
                  color: "success",
                  amount: "+1",
                  label: "vừa cập nhật",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Người Dùng"
                count="2,300"
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "so với tháng trước",
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
                count="34"
                percentage={{
                  color: "error",
                  amount: "",
                  label: "Đang chờ xử lý",
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
                count="$91,000"
                percentage={{
                  color: "success",
                  amount: "+5%",
                  label: "so với hôm qua",
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

        {/* === HÀNG 3: BẢNG DỰ ÁN VÀ TỔNG QUAN ĐƠN HÀNG === */}
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