import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

// API
import { registerUser } from "../../../services/AuthService"; // Import hàm vừa tạo

function Cover() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate cơ bản
    if (!formData.userName || !formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(formData.userName, formData.email, formData.password);
      setSuccess("Đăng ký thành công! Đang chuyển hướng...");

      // Đăng ký xong thì delay 2s rồi đẩy về trang Đăng nhập
      setTimeout(() => {
        navigate("/authentication/sign-in");
      }, 2000);

    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi đăng ký.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Đăng Ký Tài Khoản
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Tạo tài khoản để mua sắm tại Perfume
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleRegister}>

            {/* Hiển thị lỗi hoặc thành công */}
            {error && <MDTypography variant="caption" color="error" fontWeight="bold">{error}</MDTypography>}
            {success && <MDTypography variant="caption" color="success" fontWeight="bold">{success}</MDTypography>}

            <MDBox mb={2} mt={2}>
              <MDInput
                type="text"
                label="Tên đăng nhập"
                variant="standard"
                fullWidth
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Mật khẩu"
                variant="standard"
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Xác nhận mật khẩu"
                variant="standard"
                fullWidth
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Đăng Ký"}
              </MDButton>
            </MDBox>

            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Bạn đã có tài khoản?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Đăng nhập
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;