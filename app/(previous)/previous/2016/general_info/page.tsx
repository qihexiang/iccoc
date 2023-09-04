import { H1, LI, H2, P } from "@/components/TypoElement";

export const metadata = {
  title: "General Info",
};

export default function Page() {
  return (
    <>
      <H1>{metadata.title}</H1>

      <ul>
        <LI>
          There will be 6 keynote lectures, 30 invited lectures presented in the
          two-day conference of ICOC2016.
        </LI>
        <LI>To be updated.</LI>
      </ul>

      <H2>Instructions for Speakers:</H2>

      <ul>
        <LI>
          The presentation time for keynote lecture is 45 minutes (including 5
          minutes questions and discussion)
        </LI>
        <LI>
          The presentation time for invited and oral lectures is 25 minutes
          (including 5 minutes questions and discussion)
        </LI>
      </ul>

      <H2>Instructions for Poster Presenters:</H2>

      <ul>
        <LI>The size of poster board is 90cm (width) X 120cm (height).</LI>
        <LI>
          All posters are to be mounted between 12:30 and 14:30, Oct. 21th.
          Posters are to be removed before noon on Oct.
        </LI>
        22th when the poster boards will be removed. All the remaining posters
        past the time will be recycled.
        <LI>
          The staff will be in service to assist on poster mounting. Adhesive
          tapes will be provided on site.
        </LI>
        <LI>
          Each student poster is to be evaluated by four referees. Students are
          advised to present your work to all of them.
        </LI>
      </ul>

      <H2>Conference Language:</H2>

      <P>The official language of the conference is English.</P>
    </>
  );
}
