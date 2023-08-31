"use client";

import ExpandableIframe from "@/components/ExpandableIframe";
import { H1, H2, P } from "@/components/TypoElement";
import { Button, Container, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import NextLink from "next/link"

export default function AccommodationInfo() {
  return (
    <Container>
      <H1>Accommodation</H1>
      <Box display={"flex"} gap={1} alignItems={"center"}>
        <Button variant="contained" LinkComponent={NextLink} href="/abstracts/travel">My travel information</Button>
        <Button variant="contained" LinkComponent={NextLink} href="/abstracts/hotelbooking">Hotel booking support</Button>
      </Box>
      <P>
        Kindly remind all participants to make hotel reservations soon.
      </P>
      <P>
        {" "}
        Hotel accommodation is not included in the registration fees. However, a
        limited number of rooms are available at special rates to conference
        attendees at the Beijing Guizhou Hotel.
      </P>
      <H2>Beijing Guizhou Hotel:</H2>
      <P>
        The Beijing Guizhou Hotel provieds special rates for the participatns of
        ICCOC2023. The hotel charges your credit card when you check out. Please
        make your reservations as early as possible because rooms are limited.
      </P>
      <P>Tel: +86-10-58109988</P>
      <Link href="https://maps.app.goo.gl/vdVbCUJ1vSe6ixC4A">Google Map</Link>
      <br></br>
      <Link href="https://j.map.baidu.com/6c/p7xJ">Baidu Map</Link>
      <ExpandableIframe
        buttonName="Expand Google Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1663.7760957146456!2d116.41846718051349!3d39.97006588140491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35f054ad3ae459a5%3A0x250400f6e4aa8a7!2sGuizhou%20Mansion%20Beijing!5e0!3m2!1sen!2sus!4v1682753899645!5m2!1sen!2sus"
        height="450"
        style={{ border: 0, width: "100%" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></ExpandableIframe>
      <H2>Guest House of BUCT :</H2>
      <P>
        For students and junior scientists with limited financial budget, we
        help to list several budget hostels in the neighborhood of the ICCOC
        venue. Most of them are dormitory-type and are within walking distance
        either from the venue. Please note that these accommodation are NOT
        affiliated with ICCOC organizers and interested participants should
        refer to the map below and make reservations by themselves.
      </P>
      <P>Tel: +86-10-64435232</P>
      <Link href="https://j.map.baidu.com/fa/Kt8J">Baidu Map</Link>
    </Container>
  );
}
