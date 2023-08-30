"use client";

import { Container, Link, Typography } from "@mui/material";
import { sortBy } from "lodash";
import { SpeakersProps } from "./page";
import { H1 } from "@/components/TypoElement";

export default function SpeakersView(props: SpeakersProps) {
  const speakers = props.speakers.map(([firstName, lastName, college, url]) => ({
    firstName,
    lastName,
    college,
    url
  }));
  return (
    <Container>
      <H1>Invited Speakers</H1>
      <Typography variant={"overline"}>(list in alphabetical order)</Typography>
      <ul>
        {sortBy(speakers, ["lastName", "fistName", "college"]).map(
          ({ firstName, lastName, college, url }, idx) => {
            return (
              <Typography key={idx} variant="body1" component={"li"}>
                {
                  url !== undefined ? <Link href={url} target="_blank">{firstName} {lastName}</Link> : <>{firstName} {lastName}</>
                } {college}
              </Typography>
            );
          }
        )}
        {props.toBeUpdated ? (
          <Typography variant="body1" component={"li"}>
            to be updated...
          </Typography>
        ) : null}
      </ul>
    </Container>
  );
}
