"use client";

import { Container } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import LectureTimetable from "@/images/LectureTimetable.png";

export default function ProgramInfo() {
  return (
    <Container
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box sx={{ maxWidth: "80%" }}>
        <Image
          style={{ height: "100%", width: "100%" }}
          src={LectureTimetable}
          alt="program table"
        ></Image>
      </Box>
    </Container>
  );
}
