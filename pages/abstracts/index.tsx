import { useUser } from "@/lib/useUser";
import { Box, Card, CardContent, Modal, Typography } from "@mui/material";
import Head from "next/head";

export default function ActivitesIndex() {
  useUser({ redirectTo: "/abstracts/login", redirectOnLoggedIn: false });
  useUser({ redirectTo: "/abstracts/me", redirectOnLoggedIn: true });
  return (
    <>
      <Head>
        <title>ICCOC2023</title>
      </Head>
      {/* <Typography sx={{textAlign: "center"}} variant="h5">To be updated</Typography>
      <Box sx={{height: 320}}></Box> */}
      <Modal open={true}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6">Loading</Typography>
              <Typography variant="body1">Please wait...</Typography>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </>
  );
}
