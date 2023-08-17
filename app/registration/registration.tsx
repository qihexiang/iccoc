"use client";

import ClipableArea from "@/components/ClipableArea";
import {
  H1,
  H2,
  LI,
  P,
  SPAN,
  TABLE,
  TBODY,
  TD,
  THEAD,
  TR,
} from "@/components/TypoElement";
import { Button, Link } from "@mui/material";
import { Box, Container } from "@mui/system";
import NextLink from "next/link"

export default function Registration() {
  return (
    <Container>
      <H1>Registration</H1>
      <H2>Registration fees:</H2>
      <TABLE>
        <THEAD>
          <TR>
            <TD>Regular registrations*</TD>
            <TD>Fee</TD>
          </TR>
        </THEAD>
        <TBODY>
          <TR>
            <TD>Regular</TD>
            <TD>1600 RMB (230 US Dollar)</TD>
          </TR>
          <TR>
            <TD>Student</TD>
            <TD>1200 RMB (170 US Dollar)</TD>
          </TR>
          <TR>
            <TD>On site</TD>
            <TD>2000 RMB (285 US Dollar)</TD>
          </TR>
        </TBODY>
      </TABLE>
      <SPAN>
        *Graduate and undergraduate students with validated student IDs; Please
        provide the scanned file of the student ID and the letter from the
        advisor (both in pdf format) for the special rate for students.
      </SPAN>
      <Box>
        <Button variant="contained" LinkComponent={NextLink} href={"/abstracts/registration"}>Registration</Button>
      </Box>
      
      <H2>Insurance:</H2>
      <P>
        Neither travel insurance nor medical, accident or liability insurance is
        included in the registration fees. The ICCOC participants should make
        sure that they are fully insured from their home institution.
      </P>
      <H2>Method of payment:</H2>
      <ClipableArea
        content={`Beijing Univ. of Chem. Tech.
Beneficiary Address: BeiSanHuan East Rd. 15th, ChaoYang District, Beijing, 100029 P. R. China
Bank Name: Bank of Beijing, Yinghua Branch
Bank Account: 0109 0504 3001 2010 5029 689
Swift Code:
Bank Address: BeiSanHuan East Rd. 15th, ChaoYang District, Beijing, 100029 P. R. China

北京化工大学
北京市朝阳区北三环东路 15 号
银行：北京银行樱花支行
银行账号： 0109 0504 3001 2010 5029 689
`}
      ></ClipableArea>
      <H2>Abstract Submission and Deadlines:</H2>
      <ul>
        <LI>
          Abstract Submission Deadline: Sept. 30<sup>th</sup>, 2023
        </LI>
        <LI>
          Registration Deadline: Sept. 30<sup>th</sup>, 2023
        </LI>
        <LI>
          Conference Date: Oct. 20<sup>th</sup>-23<sup>rd</sup>, 2023
        </LI>
      </ul>
      <H2>Please observe the following guidelines:</H2>
      <ul>
        <LI>We accept abstracts in PDF format only.</LI>
        <LI>The language of the abstracts is English.</LI>
        <LI>
          The abstract has two parts: 1. Graphic summary and 2. Full abstract.
        </LI>
        <LI>The full abstract should fit on one A4 page (210 x 297 mm).</LI>
        <LI>Please use Times New Roman 12 point font.</LI>
        <LI>Please follow the layout and instructions below.</LI>
      </ul>
      <P>
        Abstracts can be prepared according to the provided templates and submit
        it on line which will be available soon.
      </P>
      <Link href="./Template.docx">Abstract_doc Template</Link>
      <H2>Information for Poster Presenters:</H2>
      <P>
        The poster (A0 size) should be designed to fit the space of 85 cm width
        x 120 cm height. Pushpins or other related materials will be provided on
        site for your convenience. Poster space will be allocated by the number
        on the poster board in the conference hall.
      </P>
      <P>
        Taking photograph of his/her poster without permission is strictlly
        prohibited!
      </P>
    </Container>
  );
}
