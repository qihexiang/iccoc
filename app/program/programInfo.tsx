"use client";

import { Button, Container } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import LectureTimetable from "@/images/LecturesTimetable.png";
import NextLink from "next/link";

export default function ProgramInfo() {
  return (
    <Container
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box sx={{padding: 1}}>
        <Image
          style={{ height: "100%", width: "100%", border: "1px solid rgba(0,0,0,1)", boxShadow: "0 0 8px 8px rgba(0,0,0,0.1)" }}
          src={LectureTimetable}
          alt="program table"
        ></Image>
      </Box>
    </Container>
  );
}
