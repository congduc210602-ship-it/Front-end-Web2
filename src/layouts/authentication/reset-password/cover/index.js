import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { resetPassword } from "../../../../services/AuthService";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  // Lấy token từ URL (ví dụ: ?token=abc-xyz)
  const searchParams = new URLSearchParams(useLocation().search);
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Đường dẫn không hợp lệ. Không tìm thấy mã xác thực!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword(token, newPassword);
      setMessage(res || "Đổi mật khẩu thành công!");
      setTimeout(() => {
        navigate("/authentication/sign-in");
      }, 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" mx={2} mt={-3} p={2} mb={1} textAlign="center">
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>Tạo Mật Khẩu Mới</MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {message && <MDTypography variant="caption" color="success" fontWeight="bold" mb={2} display="block">{message}</MDTypography>}
            {error && <MDTypography variant="caption" color="error" fontWeight="bold" mb={2} display="block">{error}</MDTypography>}

            <MDBox mb={2}>
              <MDInput type="password" label="Mật khẩu mới" fullWidth value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Xác nhận mật khẩu" fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit" disabled={isLoading || !token}>
                {isLoading ? "Đang xử lý..." : "Cập Nhật Mật Khẩu"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default ResetPassword;