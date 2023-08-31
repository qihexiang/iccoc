import Navibar from "@/components/Navibar";
import HeaderImage from "@/config/headerImage";
import { getCount } from "@/lib/redis";
import { Metadata } from "next";
import Image from "next/image";
import "./global.css";
import "./layout.css";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const count = await getCount().catch(_ => 0);
  return (
    <html lang="en">
      <body>
        <Head></Head>
        <div className="container">{children}</div>
        <Foot count={count}></Foot>
      </body>
    </html>
  );
}

function Head() {
  return <header className="container">
    <Image src={HeaderImage} alt={"header image"} width={1920} height={1600}></Image>
    <Navibar></Navibar>
  </header>
}

function Foot(props: { count: number }) {
  return <footer className="container mt-2">
    <div className="text-center">ICCOC2023, International Conference of Computational Organometallic Catalysis</div>
    <div className="text-center">Recently visited: {props.count}</div>
  </footer>
}

