import { open, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import {format} from "date-fns"

const loggerFiles = Promise.all(([0, 1, 2, 3, 4, 5] as const).map(
    id => open(join(cwd(), "logs", `${id}.log`), "a")
))

export default async function logger(message: string, level: (0 | 1 | 2 | 3 | 4 | 5) = 5) {
    const files = await loggerFiles;
    await writeFile(files[level], `${format(new Date(), "yyyy-MM-dd hh:mm:ss")} ${message}\n`)
}