"use client";

import { Container, Typography } from "@mui/material";
import { sortBy } from "lodash";
import { SpeakersProps } from "./page";
import { H1 } from "@/components/TypoElement";

export default function SpeakersView(props: SpeakersProps) {
  const speakers = props.speakers.map(([firstName, lastName, college]) => ({
    firstName,
    lastName,
    college,
  }));
  return (
    <Container>
      <H1>Invited Speakers</H1>
      <Typography variant={"overline"}>(list in alphabetical order)</Typography>
      <ul>
        {sortBy(speakers, ["lastName", "fistName", "college"]).map(
          ({ firstName, lastName, college }, idx) => {
            return (
              <Typography key={idx} variant="body1" component={"li"}>
                {firstName} {lastName} {college}
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
