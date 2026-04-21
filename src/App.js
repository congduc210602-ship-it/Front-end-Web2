import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "examples/Sidenav";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import routes from "routes";
import { useMaterialUIController, setMiniSidenav } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

// Trang khách hàng
import Home from "customer/pages/Home";
import ProductDetail from "customer/pages/ProductDetail";
import Cart from "customer/pages/Cart";
import Checkout from "customer/pages/Checkout";
import CustomerProfile from "customer/pages/Profile";
import ForgotPassword from "layouts/authentication/forgot-password";



export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, sidenavColor, transparentSidenav, whiteSidenav, darkMode } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // 1. LẤY VÀ PARSE THÔNG TIN USER TỪ LOCALSTORAGE
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const isAdminPath = pathname.startsWith("/admin") || routes.some(r => r.route === pathname);
  const isAuthPath = pathname.includes("/authentication"); // Xác định trang đăng nhập/đăng ký

  useEffect(() => {
    // Nếu vào /admin khơi khơi thì đẩy vào dashboard
    if (pathname === "/admin") {
      navigate("/admin/dashboard");
    }

    // 2. LOGIC BẢO VỆ TRANG ADMIN:
    if (isAdminPath && !isAuthPath) {
      if (!user) {
        // Chưa đăng nhập -> Đá về Sign-in
        navigate("/authentication/sign-in");
      } else if (user.role !== "ADMIN") {
        // Đã đăng nhập nhưng KHÔNG PHẢI ADMIN -> Đá về trang chủ khách
        alert("Bạn không có quyền truy cập vào khu vực Admin!");
        navigate("/");
      }
    }
  }, [pathname, user, isAdminPath, isAuthPath, navigate]);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) return getRoutes(route.collapse);
      if (route.route) return <Route exact path={route.route} element={route.component} key={route.key} />;
      return null;
    });

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />

      {/* CHỈ HIỂN THỊ SIDENAV KHI LÀ ADMIN PATH VÀ LÀ ADMIN THẬT */}
      {isAdminPath && user?.role === "ADMIN" && !isAuthPath && (
        <Sidenav
          color={sidenavColor}
          brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
          brandName="Perfume Admin"
          routes={routes}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        />
      )}

      <Routes>
        {/* TRANG KHÁCH HÀNG */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/authentication/forgot-password" element={<ForgotPassword />} />
        {/* ĐƯỜNG DẪN MỚI DÀNH CHO PROFILE KHÁCH HÀNG */}
        <Route path="/my-profile" element={<CustomerProfile />} />

        {/* CÁC ROUTE ADMIN TỪ FILE ROUTES.JS */}
        {getRoutes(routes)}

        {/* ĐIỀU HƯỚNG SAI SẼ VỀ TRANG CHỦ KHÁCH HÀNG */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}