import { createHmac } from "crypto"
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"

function sign(toSend: string) {
    return createHmac("sha256", process.env["SECRET_COOKIE_PASSWORD"] as string)
        .update(toSend)
        .digest("hex")
}

export function generateToken(data: string) {
    const toSend = Buffer.from(data, "utf-8").toString("hex")
    const expires = Buffer.from(`${new Date().getTime() + 4 * 60 * 60 * 1000}`, "utf-8").toString("hex")
    const payload = `${toSend}.${expires}`
    const signature = sign(payload)
    return `${payload}.${signature}`
}

export function parseToken(data: string | undefined) {
    if(data === undefined) return null;
    const [payload, expires, signature] = data.split(".")
    if (sign(`${payload}.${expires}`) === signature || new Date().getTime() >= Number(expires)) return Buffer.from(payload, "hex").toString("utf-8")
    return null
}

export default {
    maxAge: 4 * 60 * 60,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
} satisfies Partial<ResponseCookie>