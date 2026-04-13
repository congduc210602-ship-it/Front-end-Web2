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

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, sidenavColor, transparentSidenav, whiteSidenav, darkMode } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem("user");

  // Kiểm tra xem có đang ở trang admin hay không
  const isAdminPath = pathname.startsWith("/admin");

  useEffect(() => {
    // Nếu vào /admin khơi khơi thì đẩy vào dashboard
    if (pathname === "/admin") {
      navigate("/admin/dashboard");
    }

    // Bảo vệ các trang Admin: Chưa login mà vào /admin/* thì đá về Sign-in
    if (isAdminPath && !isAuthenticated) {
      navigate("/authentication/sign-in");
    }
  }, [pathname, isAuthenticated, isAdminPath, navigate]);

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

      {/* CHỈ HIỂN THỊ SIDENAV KHI LÀ ADMIN PATH */}
      {isAdminPath && (
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
        {/* 1. TRANG KHÁCH HÀNG (MẶC ĐỊNH) */}
        <Route path="/" element={<Home />} />

        {/* 2. TRANG CHI TIẾT SẢN PHẨM */}
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* 3. TRANG GIỎ HÀNG */}
        <Route path="/cart" element={<Cart />} />

        {/* 4. CÁC ROUTE ADMIN TỪ FILE ROUTES.JS */}
        {getRoutes(routes)}

        {/* 5. ĐIỀU HƯỚNG SAI SẼ VỀ TRANG CHỦ KHÁCH HÀNG */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}