import { errorLog } from "@/lib/errors";
import { readFile } from "fs/promises";
import { join } from "path";
import { cwd } from "process";
import { Suspense } from "react";
import { z } from "zod";
import SpeakersView from "./speakersView";

const dataSchema = z.object({
  toBeUpdated: z.boolean(),
  speakers: z.array(
    z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)])
  ),
});

export type SpeakersProps = z.infer<typeof dataSchema>;

export default async function SpeakersPage() {
  const json = await loadJson();
  return (
    <Suspense>
      <SpeakersView {...json}></SpeakersView>
    </Suspense>
  );
}

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
