import { errorLog } from "@/lib/errors";
import { readFile } from "fs/promises";
import { sortBy } from "lodash";
import { Metadata } from "next";
import { join } from "path";
import { cwd } from "process";
import { z } from "zod";
import Link from "next/link"

const dataSchema = z.object({
  toBeUpdated: z.boolean(),
  speakers: z.array(
    z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)])
      .or(
        z.tuple([z.string().min(1), z.string().min(1), z.string().min(1), z.string().min(1)])
      )
  ),
});

export type SpeakersProps = z.infer<typeof dataSchema>;

export const metadata: Metadata = {
  title: "Invited speakers | ICCOC2023",
};

const loadJson = async () => {
  const data = await readFile(join(cwd(), "jsonData", "speakers.json"), "utf-8")
    .then((data) => JSON.parse(data))
    .catch(() => {
      return {
        speakers: [],
        toBeUpdated: true,
      };
    });
  const validate = dataSchema.safeParse(data);
  if (validate.success) {
    return { ...validate.data };
  } else {
    errorLog(validate.error);
    return {
      speakers: [],
      toBeUpdated: true,
    };
  }
};

export default async function SpeakersPage() {
  const json = await loadJson();
  return <div>
    <h1 className="typoblock">Invited Speakers</h1>
    <p className="typoblock">(list in alphabetical order)</p>
    <ul className="typoblock">
      {sortBy(json.speakers, [1, 0, 2]).map(
        ([firstName, lastName, college, url], idx) => <li key={idx}>
          {
            url !== undefined ? <Link className="link" href={url} target="_blank">{firstName} {lastName}</Link> : <>{firstName} {lastName}</>
          } {college}
        </li>
      )}
      {json.toBeUpdated ? <li>to be updated...</li> : null}
    </ul>
  </div>;
}


