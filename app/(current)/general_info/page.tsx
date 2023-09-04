import { Metadata } from "next";
import GeneralInfo from "./generalInfo";

export const metadata: Metadata = {
  title: "General Information | ICCOC2023",
};

export default function GeneralInfoPage() {
  return <GeneralInfo></GeneralInfo>;
}
