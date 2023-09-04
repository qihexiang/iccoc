import {
  H1,
  H2,
  H3,
  LI,
  P,
  TABLE,
  TBODY,
  TD,
  THEAD,
  TR,
} from "@/components/TypoElement";

export const metadata = {
  title: "Registration",
};

export default function Page() {
  return (
    <>
      <H1>{metadata.title}</H1>
      <H2>Registration fees:</H2>
      <TABLE>
        <THEAD>
          <TR>
            <TD>Regular registrations*</TD>
            <TD>Fee</TD>
          </TR>
        </THEAD>
        <TBODY>
          <TR>
            <TD>Regular</TD>
            <TD>2000 RMB (300 US Dollar)</TD>
          </TR>
          <TR>
            <TD>Student</TD>
            <TD>1500 RMB (240 US Dollar)</TD>
          </TR>
          <TR>
            <TD>On site</TD>
            <TD>2500 RMB (285 US Dollar)</TD>
          </TR>
        </TBODY>
      </TABLE>
      <center>
        *Graduate and undergraduate students with validated student IDs; Please
        provide the scanned file of the student ID and the letter from the
        advisor (both in pdf format) for the special rate for students.
      </center>
      <H2>Insurance:</H2>
      Neither travel insurance nor medical, accident or liability insurance is
      included in the registration fees. The ICOC participants should make sure
      that they are fully insured from their home institution.
      <H2>Cancellation of registration:</H2>
      Cancellation must be made in writing to icoc2016@mail.buct.edu.cn in
      advance. No fees will be refunded after Oct. 1, 2016. A processing fee of
      100 US Dollar will be deducted from all refunds
      <H2>Abstract Submission and Deadlines:</H2>
      <LI>Abstract Submission Deadline: Sept. 15, 2016</LI>
      <LI>Registration Deadline: Sept. 25, 2016</LI>
      <LI>Conference Date: Oct. 20-23, 2016</LI>
      <H3>Please observe the following guidelines:</H3>
      <ul>
        <LI>We accept abstracts in PDF format only.</LI>
        <LI>The language of the abstracts is English.</LI>
        <LI>
          The abstract has two parts: 1. Graphic summary and 2. Full abstract.
        </LI>
        <LI>The full abstract should fit on one A4 page (210 x 297 mm).</LI>
        <LI>Please use Times New Roman 12 point font.</LI>
        <LI>Please follow the layout and instructions below.</LI>
      </ul>
      <P>
        Abstracts can be prepared according to the provided templates and submit
        it on line which will be available soon.
      </P>
      <a href="./download/template.docx" download={"template.docx"}>
        Abstract_doc Template
      </a>
      <H2>Information for Poster Presenters:</H2>
      <P>
        The poster (A0 size) should be designed to fit the space of 85 cm width
        x 120 cm height. Pushpins or other related materials will be provided on
        site for your convenience. Poster space will be allocated by the number
        on the poster board in the conference hall.
      </P>
      <P>
        Taking photograph of his/her poster without permission is strictlly
        prohibited!
      </P>
    </>
  );
}
