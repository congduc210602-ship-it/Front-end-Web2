import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import PropTypes from "prop-types";

import { getAllPromotions } from "services/PromotionService";

const StatusCell = ({ value }) => (
    <MDTypography variant="caption" color={value ? "success" : "error"} fontWeight="medium">
        {value ? "Đang chạy" : "Tạm dừng"}
    </MDTypography>
);

// Khai báo PropTypes để ESLint không báo lỗi nữa
StatusCell.propTypes = {
    value: PropTypes.bool.isRequired,
};

function Promotions() {
    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const data = await getAllPromotions();
        setPromotions(data);
    };

    const columns = [
        { Header: "Mã Code", accessor: "code", align: "left" },
        { Header: "Mô tả", accessor: "description", align: "left" },
        { Header: "Giảm (%)", accessor: "discountPercent", align: "center" },
        { Header: "Đơn tối thiểu", accessor: "minOrderValue", align: "center" },
        { Header: "Ngày bắt đầu", accessor: "startDate", align: "center" },
        { Header: "Ngày kết thúc", accessor: "endDate", align: "center" },
        {
            Header: "Trạng thái",
            accessor: "active",
            align: "center",
            Cell: StatusCell, // Gọi component đã tách
        },
    ];

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <MDTypography variant="h6" color="white">
                                    Danh sách Mã giảm giá
                                </MDTypography>
                                <MDButton variant="gradient" color="dark">
                                    <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                                    &nbsp;Thêm mã mới
                                </MDButton>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns, rows: promotions }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Promotions;