"use client";

import { H2, LI, P } from "@/components/TypoElement";
import { Container, Typography } from "@mui/material";

export default function VisaInfo() {
  return (
    <Container>
      <P>Please contact with us by email iccoc@mail.buct.edu.cn.</P>
      <H2>
        Please supply the following information with your request for an
        invitation letter:
      </H2>
      <ol>
        <LI>Citizenship;</LI>
        <LI>Full name as in the passport;</LI>
        <LI>Passport number;</LI>
        <LI>Passport expiry date (with day and month).</LI>
      </ol>
    </Container>
  );
}
