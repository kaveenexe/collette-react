import React from "react";
import FlexBetween from "../../components/Admin/FlexBetween";
import Header from "../../components/Admin/Header";
import { Box, Button } from "@mui/material";
import { DownloadOutlined } from "@mui/icons-material";
import { blue, blueGrey } from "@mui/material/colors";

const DashboardManager = () => {
  return (
    <div>
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: blueGrey,
              color: blue,
              fontSize: "12px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "8px" }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        mr="20px"
      ></Box>
    </div>
  );
};

export default DashboardManager;
