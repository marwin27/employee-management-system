import { Card, CardContent, Stack, Box, Typography } from "@mui/material";

const StatCard = ({ title, value, icon, bgColor }) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: bgColor,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography color="text.secondary">{title}</Typography>

            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StatCard;
