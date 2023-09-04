import { H1, P, H2 } from "@/components/TypoElement";
import Head from "next/head";

export const metadata = {
  title: "Accommodation",
};

export default function Page() {
  return (
    <>
      <H1>{metadata.title}</H1>

      <P>Kindly remind all participants to make hotel reservations soon.</P>

      <P>
        Hotel accommodation is not included in the registration fees. However, a
        limited number of rooms are available at special rates to conference
        attendees at the Beijing Guizhou Hotel.
      </P>
      <H2>Beijing Guizhou Hotel:</H2>

      <P>
        The Beijing Guizhou Hotel provieds special rates for the participatns of
        ICOC2016. The hotel charges your credit card when you check out. Please
        make your reservations as early as possible because rooms are limited.
      </P>

      <P>Tel: +86-10-58109818</P>

      <object
        width={"100%"}
        height={480}
        data="https://www.openstreetmap.org/export/embed.html?bbox=116.4106070995331%2C39.96771197837375%2C116.41414761543275%2C39.969599050562195&amp;layer=mapnik&amp;marker=39.968655520979674%2C116.41237735748291"
      ></object>
      <H2>Guest House of BUCT :</H2>

      <P>
        For students and junior scientists with limited financial budget, we
        help to list several budget hostels in the neighborhood of the ICOC
        venue. Most of them are dormitory-type and are within walking distance
        either from the venue. Please note that these accommodation are NOT
        affiliated with ICOC organizers and interested participants should refer
        to the map below and make reservations by themselves.
      </P>

      <P>Tel: +86-10-64435232</P>
    </>
  );
}
