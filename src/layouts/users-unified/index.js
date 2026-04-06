import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// API
import { getAllUsers, addUser, updateUser, toggleUserStatus } from "../../services/UserService";

function UsersUnified() {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        userName: "",
        userPassword: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        active: 1, // 1 là Hoạt động, 0 là Khóa
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = await getAllUsers();
        setUsers(data);
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setCurrentUserId(null);
        setFormData({ userName: "", userPassword: "", firstName: "", lastName: "", email: "", phoneNumber: "", active: 1 });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setIsEditing(true);
        setCurrentUserId(user.id);
        setFormData({
            userName: user.userName,
            userPassword: "", // Không hiển thị pass cũ
            firstName: user.userDetails?.firstName || "",
            lastName: user.userDetails?.lastName || "",
            email: user.userDetails?.email || "",
            phoneNumber: user.userDetails?.phoneNumber || "",
            active: user.active,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    // === HÀM XỬ LÝ KHI GÕ PHÍM (CHẶN NHẬP CHỮ VÀO SĐT) ===
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Nếu đang gõ vào ô Số điện thoại
        if (name === "phoneNumber") {
            // Dùng Regex xóa bỏ mọi ký tự không phải là số (chặn chữ)
            const onlyNums = value.replace(/[^0-9]/g, "");

            // Khóa độ dài tối đa là 10 số
            if (onlyNums.length <= 10) {
                setFormData({ ...formData, [name]: onlyNums });
            }
            return; // Xong việc của số điện thoại thì dừng lại
        }

        // Các ô khác (Tên, Email...) thì cho nhập bình thường
        setFormData({ ...formData, [name]: value });
    };

    // === HÀM XỬ LÝ KHI BẤM NÚT "TẠO TÀI KHOẢN" (RÀNG BUỘC DỮ LIỆU) ===
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ràng buộc 1: Kiểm tra Số điện thoại phải đúng 10 số (nếu có nhập)
        if (formData.phoneNumber && formData.phoneNumber.length < 10) {
            alert("Lỗi: Số điện thoại phải có đủ 10 chữ số!");
            return; // Chặn không cho gọi API
        }

        // Ràng buộc 2: Kiểm tra trùng Tên đăng nhập (Chỉ kiểm tra khi Thêm mới)
        if (!isEditing) {
            const isDuplicate = users.some(
                (user) => user.userName.toLowerCase() === formData.userName.toLowerCase()
            );
            if (isDuplicate) {
                alert("Lỗi: Tên đăng nhập này đã tồn tại! Vui lòng chọn tên khác.");
                return; // Chặn không cho gọi API (để tránh lỗi 500 của Backend)
            }
        }

        setIsSubmitting(true);

        // Format lại data để gửi xuống Backend (lồng UserDetails vào trong User)
        const payload = {
            userName: formData.userName,
            userPassword: formData.userPassword,
            active: formData.active,
            userDetails: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
            }
        };

        try {
            if (isEditing) {
                await updateUser(currentUserId, payload);
                alert("Cập nhật thành công!");
            } else {
                await addUser(payload);
                alert("Thêm người dùng thành công!");
            }
            handleCloseModal();
            fetchUsers();
        } catch (error) {
            alert("Có lỗi xảy ra, vui lòng kiểm tra lại log!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        const confirmMsg = newStatus === 0 ? "Bạn muốn KHÓA tài khoản này?" : "Bạn muốn MỞ KHÓA tài khoản này?";
        if (window.confirm(confirmMsg)) {
            try {
                await toggleUserStatus(id, newStatus);
                fetchUsers();
            } catch (error) {
                alert("Lỗi khi đổi trạng thái!");
            }
        }
    };

    // Cấu hình DataTable
    const columns = [
        { Header: "ID", accessor: "id", width: "10%", align: "center" },
        { Header: "Tài khoản", accessor: "username", width: "20%", align: "left" },
        { Header: "Họ Tên", accessor: "fullname", align: "left" },
        { Header: "Email", accessor: "email", align: "left" },
        { Header: "Phân quyền", accessor: "role", align: "center" },
        { Header: "Trạng thái", accessor: "status", align: "center" },
        { Header: "Hành động", accessor: "action", align: "center" },
    ];

    const rows = users.map((user) => ({
        id: <MDTypography variant="caption" color="text" fontWeight="medium">#{user.id}</MDTypography>,
        username: <MDTypography variant="button" fontWeight="medium">{user.userName}</MDTypography>,
        fullname: <MDTypography variant="caption" color="text" fontWeight="medium">
            {user.userDetails ? `${user.userDetails.lastName} ${user.userDetails.firstName}` : "Chưa cập nhật"}
        </MDTypography>,
        email: <MDTypography variant="caption" color="text" fontWeight="medium">
            {user.userDetails?.email || "N/A"}
        </MDTypography>,

        role: (
            <MDBox ml={-1}>
                <Chip
                    label={user.role ? user.role.roleName : "USER"} // Nếu null thì mặc định hiện là USER
                    color={user.role && user.role.roleName === "ADMIN" ? "info" : "secondary"} // Admin màu xanh dương, User màu xám
                    size="small"
                />
            </MDBox>
        ),

        status: (
            <MDBox ml={-1}>
                <Chip
                    label={user.active === 1 ? "Hoạt động" : "Đã Khóa"}
                    color={user.active === 1 ? "success" : "error"}
                    size="small"
                />
            </MDBox>
        ),
        action: (
            <MDBox display="flex" alignItems="center">
                <MDButton variant="text" color="info" onClick={() => handleOpenEditModal(user)}>
                    <Icon>edit</Icon>&nbsp;Sửa
                </MDButton>
                <MDButton
                    variant="text"
                    color={user.active === 1 ? "warning" : "success"}
                    onClick={() => handleToggleStatus(user.id, user.active)}
                >
                    <Icon>{user.active === 1 ? "lock" : "lock_open"}</Icon>&nbsp;
                    {user.active === 1 ? "Khóa" : "Mở Khóa"}
                </MDButton>
            </MDBox>
        ),
    }));

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" display="flex" justifyContent="space-between" alignItems="center">
                                <MDTypography variant="h6" color="white">
                                    Quản Lý Người Dùng
                                </MDTypography>
                                <MDButton variant="gradient" color="success" onClick={handleOpenAddModal}>
                                    <Icon fontSize="small">person_add</Icon>&nbsp;Thêm Tài Khoản
                                </MDButton>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={true} noEndBorder />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>

            {/* POPUP THÊM / SỬA */}
            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? "Cập Nhật Tài Khoản" : "Tạo Tài Khoản Mới"}</DialogTitle>
                <MDBox component="form" role="form" onSubmit={handleSubmit}>
                    <DialogContent dividers>
                        <MDTypography variant="h6" fontWeight="medium" mb={2}>Thông tin đăng nhập</MDTypography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <MDInput type="text" label="Tên đăng nhập" name="userName" value={formData.userName} onChange={handleChange} fullWidth required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MDInput type="password" label={isEditing ? "Mật khẩu mới (Để trống nếu ko đổi)" : "Mật khẩu"} name="userPassword" value={formData.userPassword} onChange={handleChange} fullWidth required={!isEditing} />
                            </Grid>
                        </Grid>

                        <MDTypography variant="h6" fontWeight="medium" mt={3} mb={2}>Thông tin cá nhân</MDTypography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <MDInput type="text" label="Họ (Last Name)" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MDInput type="text" label="Tên (First Name)" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth required />
                            </Grid>
                            <Grid item xs={12}>
                                <MDInput type="email" label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth required />
                            </Grid>
                            <Grid item xs={12}>
                                <MDInput type="text" label="Số điện thoại" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} fullWidth />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <MDButton onClick={handleCloseModal} color="secondary">Hủy</MDButton>
                        <MDButton variant="gradient" color="info" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Đang xử lý..." : isEditing ? "Cập Nhật" : "Tạo Tài Khoản"}
                        </MDButton>
                    </DialogActions>
                </MDBox>
            </Dialog>
        </DashboardLayout>
    );
}

export default UsersUnified;