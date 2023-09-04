import { Box, Link, Typography } from "@mui/material";
import Head from "next/head";
import Category from "./Category";
import ICOC2016Photo from "./ICOC2016.png";

export const metadata = {
  title: "ICOC 2016"
}

export default function Index2016() {
  return (
    <>
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
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={1}
          alignItems={"center"}
        >
          <Box
            sx={{
              backgroundImage: `url(${ICOC2016Photo.src})`,
              aspectRatio: `${ICOC2016Photo.width} / ${ICOC2016Photo.height}`,
              maxWidth: "80vw",
              width: 640,
              backgroundPosition: "center center",
              backgroundSize: "cover",
            }}
          ></Box>
          <Link href="/ICOC2016_Photo.jpg" download={"ICOC2016_Photo.jpg"}>
            Download Origin Picture
          </Link>
        </Box>
      </Box>
    </>
  );
}
