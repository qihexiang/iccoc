import { Box, Typography } from "@mui/material";
import Category from "./_category";
import Head from "next/head";
import ICOC2016Photo from "./ICOC2016.png";
import Image from "next/image";

export default function Index2016() {
  return (
    <>
      <Head>
        <title>ICOC2016</title>
      </Head>
      <Category noCategory vertical={false} noHeader={false} />
      <Typography variant="h4">
        ICOC2016: Oct. 20th - 23rd, 2016 at Beijing, China
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Category noCategory={false} vertical noHeader />
        </Box>
        <img src={ICOC2016Photo.src} width={"60%"}></img>
        <Box></Box>
      </Box>
    </>
  );
}
