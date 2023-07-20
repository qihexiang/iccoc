"use client";

import { Container, Typography } from "@mui/material";

export default function GeneralInfo() {
  return (
    <Container>
      <Typography variant="h4">General Information</Typography>
      <Typography variant="body1"></Typography>
      <ul>
        <Typography component={"li"} variant="body1">
          There will be 6 keynote lectures, 30 invited lectures presented in the
          two-day conference of ICCOC2023.
        </Typography>
        <Typography component={"li"} variant="body1">
          To be updated.
        </Typography>
      </ul>
      <Typography variant="h5">Instructions for Speakers:</Typography>
      <ul>
        <Typography component={"li"} variant="body1">
          The presentation time for keynote lecture is 45 minutes (including 5
          minutes questions and discussion)
        </Typography>
        <Typography component={"li"} variant="body1">
          The presentation time for invited and oral lectures is 25 minutes
          (including 5 minutes questions and discussion)
        </Typography>
      </ul>
      <Typography variant="h5">Instructions for Poster Presenters:</Typography>
      <ul>
        <Typography component={"li"} variant="body1">
          The size of poster board is 90cm (width) X 120cm (height).
        </Typography>
        <Typography component={"li"} variant="body1">
          All posters are to be mounted between 12:30 and 14:30, Oct. 20
          <sup>th</sup>. Posters are to be removed before noon on Oct. 23
          <sup>rd</sup> when the poster boards will be removed. All the
          remaining posters past the time will be recycled.
        </Typography>{" "}
        <Typography component={"li"} variant="body1">
          The staff will be in service to assist on poster mounting. Adhesive
          tapes will be provided on site.
        </Typography>
        <Typography component={"li"} variant="body1">
          The staff will be in service to assist on poster mounting. Adhesive
          tapes will be provided on site. - Each student poster is to be
          evaluated by four referees. Students are advised to present your work
          to all of them.
        </Typography>
      </ul>
      <Typography variant="h5">Conference Language:</Typography>
      <Typography variant="body1">
        The official language of the conference is English.
      </Typography>
    </Container>
  );
}
