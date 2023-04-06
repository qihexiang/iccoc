import { createHmac } from "crypto";

export function userPasswordHmac(password: string): string {
    return createHmac("sha256", process.env.APP_SECRET as string)
        .update(password)
        .digest("hex")
}