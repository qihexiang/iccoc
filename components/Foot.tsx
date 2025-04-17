"use client";

import { Container, Typography } from "@mui/material";

export default function Foot() {
  return (
    <Container>
      <Typography
        component={"div"}
        variant="body2"
        sx={{ textAlign: "center", marginTop: 2 }}
      >
        ICCOC2023, International Conference of Computational Organometallic
        Catalysis
      </Typography>
      <Typography
        variant="body2"
        component={"a"}
        href="https://beian.miit.gov.cn"
        sx={{ textAlign: "center", display: "block" }}
      >
        京ICP备18022349-3号
      </Typography>
    </Container>
  );
}
