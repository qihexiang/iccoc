import Foot from "@/components/Foot";
import Head from "@/components/Head";
import "@/styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome | ICCOC2023",
  description:
    "Homepage of International Conference of Computational Organometallic Chemistry",
  keywords: [
    "ICCOC",
    "Catalyst",
    "Chemistry",
    "Computational Chemistry",
    "Organometallic Chemistry",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Head></Head>
        {children}
        <Foot></Foot>
      </body>
    </html>
  );
}
