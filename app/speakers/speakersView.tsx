'use client'

import { errorLog } from "@/lib/errors";
import { Container, Typography } from "@mui/material";
import { readFile } from "fs/promises";
import { sortBy } from "lodash";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { join } from "path";
import { cwd } from "process";
import { SpeakersProps } from "./page";

export default function SpeakersView(props: SpeakersProps) {
  const speakers = props.speakers.map(([firstName, lastName, college]) => ({
    firstName,
    lastName,
    college,
  }));
  return (
    <Container>
      <Head>
        <title>{`Speakers - ICCOC2023`}</title>
      </Head>
      <Typography variant="h4">Invited Speakers</Typography>
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
