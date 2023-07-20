import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import { Metadata } from "next";
import VisaInfo from "./visaInfo";

export const metadata: Metadata = {
  title: "Visa information | ICCOC2023",
};

export default function VisaPage() {
  return <VisaInfo></VisaInfo>;
}
