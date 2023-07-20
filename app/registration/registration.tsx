"use client";

import ClipableArea from "@/components/ClipableArea";
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";

export default function Registration() {
  return (
    <Container>
      <Typography variant="h4">Registration</Typography>
      <Typography variant="h5">Registration fees:</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Regular registrations*</TableCell>
            <TableCell>Fee</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>regular</TableCell>
            <TableCell>1600 RMB (230 US Dollar)</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>student</TableCell>
            <TableCell>1200 RMB (170 US Dollar)</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>on site</TableCell>
            <TableCell>2000 RMB (285 US Dollar)</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Typography variant="overline" textAlign={"center"}>
        *Graduate and undergraduate students with validated student IDs; Please
        provide the scanned file of the student ID and the letter from the
        advisor (both in pdf format) for the special rate for students.
      </Typography>
      <Typography variant="h5">Insurance:</Typography>
      <Typography variant="body1">
        Neither travel insurance nor medical, accident or liability insurance is
        included in the registration fees. The ICCOC participants should make
        sure that they are fully insured from their home institution.
      </Typography>
      <Typography variant="h5">Method of payment:</Typography>
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
      <Typography variant="h5">Abstract Submission and Deadlines:</Typography>
      <ul>
        <Typography component={"li"} variant="body1">
          Abstract Submission Deadline: Sept. 30<sup>th</sup>, 2023
        </Typography>
        <Typography component={"li"} variant="body1">
          Registration Deadline: Sept. 30<sup>th</sup>, 2023
        </Typography>
        <Typography component={"li"} variant="body1">
          Conference Date: Oct. 20<sup>th</sup>-23<sup>rd</sup>, 2023
        </Typography>
      </ul>
      <Typography variant="h5">
        Please observe the following guidelines:
      </Typography>
      <ul>
        <Typography component={"li"} variant="body1">
          We accept abstracts in PDF format only.
        </Typography>
        <Typography component={"li"} variant="body1">
          The language of the abstracts is English.
        </Typography>
        <Typography component={"li"} variant="body1">
          The abstract has two parts: 1. Graphic summary and 2. Full abstract.
        </Typography>
        <Typography component={"li"} variant="body1">
          The full abstract should fit on one A4 page (210 x 297 mm).
        </Typography>
        <Typography component={"li"} variant="body1">
          Please use Times New Roman 12 point font.
        </Typography>
        <Typography component={"li"} variant="body1">
          Please follow the layout and instructions below.
        </Typography>
      </ul>
      <Typography variant="body1">
        Abstracts can be prepared according to the provided templates and submit
        it on line which will be available soon.
      </Typography>
      <Link href="./Template.docx">Abstract_doc Template</Link>
      <Typography variant="h5">Information for Poster Presenters:</Typography>
      <Typography variant="body1">
        The poster (A0 size) should be designed to fit the space of 85 cm width
        x 120 cm height. Pushpins or other related materials will be provided on
        site for your convenience. Poster space will be allocated by the number
        on the poster board in the conference hall.
      </Typography>
      <Typography variant="body1">
        Taking photograph of his/her poster without permission is strictlly
        prohibited!
      </Typography>
    </Container>
  );
}
