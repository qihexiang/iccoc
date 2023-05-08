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
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Category noCategory={false} vertical noHeader />
        </Box>
        <Box sx={{
          backgroundImage: `url(${ICOC2016Photo.src})`,
          aspectRatio: `${ICOC2016Photo.width} / ${ICOC2016Photo.height}`,
          maxWidth: "80vw",
          width: 640,
          backgroundPosition: "center center",
          backgroundSize: "cover"
        }}></Box>
      </Box>
    </>
  );
}
