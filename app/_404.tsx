import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function NotFound() {
  const router = useRouter();
  return (
    <Box>
      <Typography>Page Not Found.</Typography>
      <Box style={{ display: "flex", flexDirection: "row", gap: 4 }}>
        <Button onClick={() => router.push("/")} variant="contained">
          Go Home
        </Button>
        <Button onClick={() => router.back()} variant="contained">
          Back to previous page
        </Button>
      </Box>
    </Box>
  );
}
