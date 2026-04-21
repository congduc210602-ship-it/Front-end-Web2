import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-reset-cover.jpeg"; // Dùng ảnh nền có sẵn
import { forgotPassword } from "../../../services/AuthService";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email) {
            setError("Vui lòng nhập địa chỉ email của bạn!");
            return;
        }

        setIsLoading(true);
        try {
            const res = await forgotPassword(email);
            // Đổi câu thông báo
            setMessage(res || "Mật khẩu mới đã được gửi. Vui lòng kiểm tra hộp thư!");

            // Cho user đọc thông báo 3 giây rồi chuyển về trang Sign In
            setTimeout(() => {
                navigate("/authentication/sign-in");
            }, 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CoverLayout coverHeight="50vh" image={bgImage}>
            <Card>
                <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="success" mx={2} mt={-3} py={2} mb={1} textAlign="center">
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>Khôi Phục Mật Khẩu</MDTypography>
                    <MDTypography display="block" variant="button" color="white" my={1}>
                        Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form" onSubmit={handleSubmit}>
                        {message && <MDTypography variant="caption" color="success" fontWeight="bold" mb={2} display="block">{message}</MDTypography>}
                        {error && <MDTypography variant="caption" color="error" fontWeight="bold" mb={2} display="block">{error}</MDTypography>}

                        <MDBox mb={4}>
                            <MDInput type="email" label="Email của bạn" variant="standard" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </MDBox>
                        <MDBox mt={6} mb={1}>
                            <MDButton variant="gradient" color="info" fullWidth type="submit" disabled={isLoading}>
                                {isLoading ? "Đang gửi..." : "Gửi Liên Kết Khôi Phục"}
                            </MDButton>
                        </MDBox>
                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                Nhớ mật khẩu rồi?{" "}
                                <MDTypography component={Link} to="/authentication/sign-in" variant="button" color="info" fontWeight="medium" textGradient>
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

export default ForgotPassword;