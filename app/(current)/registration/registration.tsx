"use client";

import PaymentQrCode from "@/images/QRCode.png";
import ClipableArea from "@/components/ClipableArea";
import {
  H1,
  H2,
  H3,
  LI,
  P,
  SPAN,
  TABLE,
  TBODY,
  TD,
  THEAD,
  TR,
} from "@/components/TypoElement";
import {
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import Image from "next/image";
import NextLink from "next/link";

export default function Registration() {
  return (
    <Container>
      <H1>Registration</H1>
      <Box>
        <Button
          variant="contained"
          LinkComponent={NextLink}
          href={"/abstracts/registration"}
        >
          Registration
        </Button>
      </Box>
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
      <H2>Insurance:</H2>
      <P>
        Neither travel insurance nor medical, accident or liability insurance is
        included in the registration fees. The ICCOC participants should make
        sure that they are fully insured from their home institution.
      </P>
      <H2>Method of payment:</H2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{textAlign: "center"}}>Wechat Pay(微信支付)</TableCell>
            <TableCell sx={{textAlign: "center"}}>Money Transfer(转账)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                <Image
                  src={PaymentQrCode}
                  alt="payment qrcode"
                  width={128}
                ></Image>
                <P>
                  <center>ICCOC2023@Beijing</center>
                </P>
              </Box>
            </TableCell>
            <TableCell>
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
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Container>
  );
}
