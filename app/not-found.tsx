"use client";

import Foot from "@/components/Foot";
import Head from "@/components/Head";
import { Box, Button, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <>
      <Head></Head>
      <Container>
        <Typography>Page Not Found.</Typography>
        <Box style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Button onClick={() => router.push("/")} variant="contained">
            Go Home
          </Button>
          <Button onClick={() => router.back()} variant="contained">
            Back to previous page
          </Button>
        </Box>
      </Container>
      <Foot></Foot>
    </>
  );
}
