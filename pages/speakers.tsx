import { errorLog } from "@/lib/errors";
import { Typography } from "@mui/material";
import { readFile } from "fs/promises";
import { sortBy } from "lodash";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { join } from "path";
import { cwd } from "process";
import { z } from "zod";

const dataSchema = z.object({
  toBeUpdated: z.boolean(),
  speakers: z.array(
    z.tuple([
      z.string().min(1),
      z.string().min(1),
      z.string().min(1)
    ])
  )
})

type SpeakersProps = z.infer<typeof dataSchema>

export default function SpeakersView(props: SpeakersProps) {
  const speakers = props.speakers.map(([firstName, lastName, college]) => ({ firstName, lastName, college }))
  return <>
    <Head>
      <title>{`Speakers - ICCOC2023`}</title>
    </Head>
    <Typography variant="h4">Invited Speakers</Typography>
    <Typography variant={"overline"}>(list in alphabetical order)</Typography>
    <ul>
      {
        sortBy(speakers, ["lastName", "fistName", "college"]).map(({ firstName, lastName, college }, idx) => {
          return <Typography key={idx} variant="body1" component={"li"}>{firstName} {lastName} {college}</Typography>
        })
      }
      {
        props.toBeUpdated ? <Typography variant="body1" component={"li"}>to be updated...</Typography> : null
      }
    </ul>
  </>
}

export const getServerSideProps: GetServerSideProps<SpeakersProps> = async () => {
  const data = await readFile(join(cwd(), "jsonData", "speakers.json"), "utf-8").then(data => JSON.parse(data))
  const validate = dataSchema.safeParse(data);
  if (validate.success) {
    return { props: validate.data }
  } else {
    errorLog(validate.error)
    return {
      props: {
        speakers: [], toBeUpdated: true
      }
    }
  }
}
