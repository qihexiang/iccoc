"use client";

import { Container, Typography } from "@mui/material";

export default function VisaInfo() {
  return (
    <Container>
      <Typography variant="body1">
        Please contact with us by email iccoc@mail.buct.edu.cn.
      </Typography>
      <Typography variant="h5">
        Please supply the following information with your request for an
        invitation letter:
      </Typography>
      <ol>
        <Typography variant="body1" component={"li"}>
          Citizenship;
        </Typography>
        <Typography variant="body1" component={"li"}>
          Full name as in the passport;
        </Typography>
        <Typography variant="body1" component={"li"}>
          Passport number;
        </Typography>
        <Typography variant="body1" component={"li"}>
          Passport expiry date (with day and month).
        </Typography>
      </ol>
    </Container>
  );
}
