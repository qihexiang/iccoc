export default {
    expires: new Date().getTime() + 4 * 60 * 60 * 1000,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
} as const