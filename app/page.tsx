"use client";

import BUCT from "@/images/BUCT.jpg";
import CRE from "@/images/CRE.png";
import ForbiddenCity from "@/images/forbiddencity.jpg";
import GreatWall from "@/images/greatwall.jpg";
import SummerPalace from "@/images/summerpalace.jpg";
import {
  Box,
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import Image from "next/image";

export default function Homepage() {
  return (
    <Container>
      <Typography variant="h4">Welcome</Typography>

      <Typography variant="body1">
        It is our great pleasure to invite you to the International Conference
        of Computational Organometallic Catalysis (ICCOC2023), which will be
        held in Beijing, China, from October 20<sup>th</sup> to 23<sup>th</sup>,
        2023. This is an international conference dedicated to promoting
        advances in the integration of theoretical and computational chemistry
        with homogeneous and heterogeneous catalysis involving transition
        metals.
      </Typography>

      <ul>
        <Typography variant="body1" component={"li"}>
          The International Conference on Computational Organometallic Catalysis
          2023 (ICCOC2023) focuses on the application of theoretical and
          computational chemistry in homogeneous and hetergeneous organometallic
          catalysis. Advances covered range from new catalyzed reactions and
          processes, to ligand and catalyst design, and new mechanistic insights
          that could change implementation into practice.
        </Typography>
        <Typography variant="body1" component={"li"}>
          Participants include scientists involved in theoretical and
          computational chemistry related to catalysis, organometallic
          chemistry, organic synthesis, polymers etc., from both academia and
          industry. The ICCOC2023 is trying to provide a platform to exchange
          academic ideas in this field with a highly engaged discussion. The
          single oral session and one poster session style for oral
          presentations and posters promote discussion and debate, as does the
          conference size (typically 100-150 participants).
        </Typography>
      </ul>

      <Typography variant="h5">Important dates:</Typography>

      <ul>
        <Typography variant="body1" component={"li"}>
          Abstract Submission Deadline: Sept. 30<sup>th</sup>, 2023
        </Typography>
        <Typography variant="body1" component={"li"}>
          Registration Deadline: Sept. 30<sup>th</sup>, 2023
        </Typography>
        <Typography variant="body1" component={"li"}>
          Conference Date: Oct. 20<sup>th</sup>-23<sup>rd</sup>, 2023
        </Typography>
      </ul>

      <ImageList cols={3}>
        {[
          { ...GreatWall, title: "The Great Wall" },
          { ...SummerPalace, title: "Summer Palace" },
          { ...ForbiddenCity, title: "Forbidden City" },
        ].map((item, idx) => (
          <ImageListItem key={idx}>
            <img src={item.src}></img>
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