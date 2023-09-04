import { H1, LI, P } from "@/components/TypoElement";

export const metadata = {
  title: "VISA Requirements",
};

export default function Page() {
  return (
    <>
      <H1>{metadata.title}</H1>

      <P>Please contact with us by email icoc2016@mail.buct.edu.cn.</P>

      <H1>
        Please supply the following information with your request for an
        invitation letter:
      </H1>

      <ol>
        <LI> Citizenship;</LI>
        <LI> Full name as in the passport;</LI>
        <LI> Passport number;</LI>
        <LI> Passport expiry date (with day and month).</LI>
      </ol>
    </>
  );
}
