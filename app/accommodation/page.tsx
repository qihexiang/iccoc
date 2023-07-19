import { Metadata } from "next";
import AccommodationInfo from "./accommodationInfo";

export const metadata: Metadata = {
  title: "Accommodation information | ICCOC2023",
};

export default function AccommodationPage() {
  return <AccommodationInfo></AccommodationInfo>;
}
