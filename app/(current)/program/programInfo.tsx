"use client";

import { Button, Container } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import LectureTimetable from "@/images/LecturesTimetable.png";
import NextLink from "next/link";

export default function ProgramInfo() {
  return (
    <Container>
      <Box sx={{padding: 1, textAlign: "center"}}>
        <Image
          style={{ maxWidth: 768, width: "100%", objectFit: "contain", height: "auto", border: "1px solid rgba(0,0,0,1)", boxShadow: "0 0 8px 8px rgba(0,0,0,0.1)" }}
          src={LectureTimetable}
          alt="program table"
        ></Image>
      </Box>
      <Box sx={{padding: 1}}>
        <object data="/program.pdf" style={{border: "none", width: "100%", minHeight: "100vh"}}></object>
      </Box>
    </Container>
  );
}
