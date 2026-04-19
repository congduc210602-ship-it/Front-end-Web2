import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // THÊM useLocation

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

// API Service và Context
import { useAuth } from "context/AuthContext"; // SỬ DỤNG AuthContext

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation(); // LẤY ĐƯỜNG DẪN TRƯỚC ĐÓ
  const { loginUser } = useAuth(); // LẤY HÀM LOGIN TỪ CONTEXT

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // 1. Gọi hàm login từ AuthContext thay vì gọi trực tiếp AuthService
      const user = await loginUser(userName, userPassword);

      // 2. Xử lý chuyển hướng dựa trên Role
      if (user && user.role === "ADMIN") {
        alert("Chào mừng Admin quay trở lại!");
        navigate("/dashboard");
      } else if (user && user.role === "USER") {
        alert("Đăng nhập thành công!");
        // Nếu người dùng bị bắt đăng nhập từ trang giỏ hàng, trả họ về giỏ hàng. Nếu không thì về trang chủ.
        const origin = location.state?.from?.pathname || "/";
        navigate(origin);
      } else {
        setError("Tài khoản không hợp lệ!");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Đăng Nhập
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleLogin}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Tên đăng nhập"
                fullWidth
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Mật khẩu"
                fullWidth
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
              />
            </MDBox>
            {error && (
              <MDBox mb={2}>
                <MDTypography variant="caption" color="error" fontWeight="bold">
                  {error}
                </MDTypography>
              </MDBox>
            )}
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Ghi nhớ đăng nhập
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Đăng Nhập
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;