'use client';

import BUCT from "@/images/BUCT.jpg";
import CRE from "@/images/CRE.png";
import ForbiddenCity from "@/images/forbiddencity.jpg";
import GreatWall from "@/images/greatwall.jpg";
import SummerPalace from "@/images/summerpalace.jpg";
import { Box, Container, ImageList, ImageListItem, ImageListItemBar, Typography } from "@mui/material";
import Image from "next/image";

export default function Homepage() {
  return <Container>
    <Typography variant="h4">Welcome</Typography>

    <Typography variant="body1">
      It is our great pleasure to invite you to the International Conference of Computational Organometallic Catalysis
      (ICCOC2023), which will be held in Beijing, China, from October 20<sup>th</sup> to 23<sup>th</sup>, 2023. This
      is an international conference dedicated to promoting advances in the integration of theoretical and computational
      chemistry with homogeneous and heterogeneous catalysis involving transition metals.
    </Typography>
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

    <Image alt="Beijing University of Chemical Technology" src={BUCT} height={128}></Image>

    <Image alt="CRE" src={CRE} height={128}></Image>
  </Container>
}