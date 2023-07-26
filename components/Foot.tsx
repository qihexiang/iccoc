"use client";

import api from "@/lib/apiRequest";
import { Container, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export default function Foot() {
  const [count, setCount] = useState<number>();
  useEffect(() => {
    api.get("/counter").then((res) => {
      setCount(res.data.count);
    });
  }, []);
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
      <Typography sx={{ textAlign: "center" }} variant="body2">
        Recently visited: {count}
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
