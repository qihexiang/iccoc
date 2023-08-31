import { Metadata } from "next";

export const metadata: Metadata = {
  title: "General Information | ICCOC2023",
};

export default function GeneralInfoPage() {
  return <div>
    <h1 className="typoblock">General Information</h1>
    <p className="typoblock">
      There will be 6 keynote lectures, 46 invited lectures presented in the
      two-day conference of ICCOC2023.
    </p>
    <h2 className="typoblock">Instructions for Speakers:</h2>
    <ul className="typoblock">
      <li>
        The presentation time for keynote lecture is 45 minutes (including 5
        minutes questions and discussion)
      </li>
      <li>
        The presentation time for invited and oral lectures is 25 minutes
        (including 5 minutes questions and discussion)
      </li>
    </ul>
    <h2 className="typoblock">Instructions for Poster Presenters:</h2>
    <ul className="typoblock">
      <li>The size of poster board is 90cm (width) X 120cm (height).</li>
      <li>
        All posters are to be mounted between 12:30 and 14:30, Oct. 20
        <sup>th</sup>. Posters are to be removed before noon on Oct. 23
        <sup>rd</sup> when the poster boards will be removed. All the
        remaining posters past the time will be recycled.
      </li>
      <li>
        The staff will be in service to assist on poster mounting. Adhesive
        tapes will be provided on site.
      </li>
      <li>
        The staff will be in service to assist on poster mounting. Adhesive
        tapes will be provided on site. - Each student poster is to be
        evaluated by four referees. Students are advised to present your work
        to all of them.
      </li>
    </ul>
    <h2 className="typoblock">Conference Language:</h2>
    <p className="typoblock">The official language of the conference is English.</p>
  </div>;
}
