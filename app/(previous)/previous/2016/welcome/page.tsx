/* eslint-disable @next/next/no-img-element */
import { H1, H2, LI, P } from "@/components/TypoElement";
import BUCT from "@/images/BUCT.jpg";
import ForbiddenCity from "@/images/forbiddencity.jpg";
import GreatWall from "@/images/greatwall.jpg";
import SummerPalace from "@/images/summerpalace.jpg";
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import Head from "next/head";
import Image from "next/image";

export const metadata = {
  title: "Welcome",
};

export default function Page() {
  return (
    <>
      <Head>
        <title>{`${metadata.title} - ICOC2016`}</title>
      </Head>
      <H1>{metadata.title}</H1>
      <P>
        It is our great pleasure to invite you to the International Symposium of
        Computational Organometallic Catalysis (ICOC2016), which will be held in
        Beijing, China, from 20 October to 23 October 2016. This is an
        international conference dedicated to promoting advances in the
        integration of theoretical and computational chemistry with catalysis.
      </P>
      <ul>
        <LI>
          The International Symposium on Computational Organometallic Catalysis
          2016 (ICOC2016) focuses on the application of computational chemistry
          in homogeneous and hetergeneous organometallic catalysis. Advances
          covered range from new catalyzed reactions and processes, to ligand
          and catalyst design, and new mechanistic insights that can change
          implementation into practice.
        </LI>
        <LI>
          Participants include scientists involved in computational chemistry
          related to catalysis, organometallic chemistry, organic synthesis, and
          polymer synthesis, from both academia and industry. The ICOC2016 is
          trying to provide a platform to exchange academic ideas in this field
          with a highly engaged discussion. The single oral session and one
          poster session style for oral presentations and posters promote
          discussion and debate, as does the conference size (typically 100-150
          participants).
        </LI>
      </ul>
      <H2>Important dates:</H2>
      <ul>
        <LI>Abstract Submission Deadline: Sept. 15, 2016</LI>
        <LI>Registration Deadline: Sept. 25, 2016</LI>
        <LI>Conference Date: Oct. 20-23, 2016</LI>
      </ul>
      <ImageList cols={3}>
        {[
          { ...GreatWall, title: "The Great Wall" },
          { ...SummerPalace, title: "Summer Palace" },
          { ...ForbiddenCity, title: "Forbidden City" },
        ].map((item, idx) => (
          <ImageListItem key={idx}>
            <img src={item.src} alt={item.title}></img>
            <ImageListItemBar title={item.title}></ImageListItemBar>
          </ImageListItem>
        ))}
      </ImageList>
      Organizers:
      <Image src={BUCT} alt="BUCT"></Image>
    </>
  );
}
