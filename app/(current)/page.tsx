"use client";

import { H1, H2, LI, P } from "@/components/TypoElement";
import GroupPhoto from "@/images/GroupPhoto.jpg"
import CloseCeremony from "@/images/CloseCeremony.jpg";
import BUCT from "@/images/BUCT.jpg";
import CRE from "@/images/CRE.png";
import ForbiddenCity from "@/images/forbiddencity.jpg";
import GreatWall from "@/images/greatwall.jpg";
import SummerPalace from "@/images/summerpalace.jpg";
import {
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import Image from "next/image";

export default function Homepage() {
  return (
    <Container>
      <div style={{ textAlign: "center" }}>
        <Image style={{ maxWidth: "80%", height: "auto", objectFit: "contain" }} src={GroupPhoto} alt="group_photo" width={1280}></Image>
      </div>
      <div style={{ textAlign: "center" }}>
        <a href={GroupPhoto.src} download={"ICCOC2023.jpg"}>Download original picture (JPG) </a>
      </div>
      <div style={{ textAlign: "center" }}>
        <Image style={{ maxWidth: "80%", height: "auto", objectFit: "contain" }} src={CloseCeremony} alt="group_photo" width={1280}></Image>
      </div>
      <div style={{ textAlign: "center" }}>
        <a href={CloseCeremony.src} download={"CloseCeremony.jpg"}>Download original picture (JPG) </a>
      </div>
      <H1>Welcome</H1>
      <P>
        It is our great pleasure to invite you to the International Conference
        of Computational Organometallic Catalysis (ICCOC2023), which will be
        held in Beijing, China, from October 20<sup>th</sup> to 23<sup>rd</sup>,
        2023. This is an international conference dedicated to promoting
        advances in the integration of theoretical and computational chemistry
        with homogeneous and heterogeneous catalysis involving transition
        metals.
      </P>

      <ul>
        <LI>
          The International Conference of Computational Organometallic Catalysis
          2023 (ICCOC2023) focuses on the application of theoretical and
          computational chemistry in homogeneous and hetergeneous organometallic
          catalysis. Advances covered range from new catalyzed reactions and
          processes, to ligand and catalyst design, and new mechanistic insights
          that could change implementation into practice.
        </LI>
        <LI>
          Participants include scientists involved in theoretical and
          computational chemistry related to catalysis, organometallic
          chemistry, organic synthesis, polymers etc., from both academia and
          industry. The ICCOC2023 is trying to provide a platform to exchange
          academic ideas in this field with a highly engaged discussion. The
          single oral session and one poster session style for oral
          presentations and posters promote discussion and debate, as does the
          conference size (typically 100-150 participants).
        </LI>
      </ul>

      <H2>Important dates:</H2>

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

      <ImageList cols={3}>
        {[
          { ...GreatWall, title: "The Great Wall" },
          { ...SummerPalace, title: "Summer Palace" },
          { ...ForbiddenCity, title: "Forbidden City" },
        ].map((item, idx) => (
          <ImageListItem key={idx}>
            {/* <img src={item.src}></img> */}
            <Image
              src={item}
              alt={item.title}
              style={{
                maxWidth: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                height: 256,
              }}
            ></Image>
            <ImageListItemBar title={item.title}></ImageListItemBar>
          </ImageListItem>
        ))}
      </ImageList>

      <Typography variant="body1">Organizers:</Typography>

      <Image
        alt="Beijing University of Chemical Technology"
        src={BUCT}
        height={128}
      ></Image>

      <Image alt="CRE" src={CRE} height={128}></Image>
    </Container>
  );
}
