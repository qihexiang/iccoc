import cookieConfig, { generateToken } from "@/lib/cookieConfig";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import totpGenerator from "totp-generator";
import z from "zod";

const registrySchema = z.object({
  username: z.string().email(),
  totp: z.string().regex(/^[0-9]{6}$/),
});

export async function POST(request: NextRequest) {
  const registryInfo = await request.json();
  const validateResult = registrySchema.safeParse(registryInfo);
  if (validateResult.success === false) {
    return new Response("Bad request", { status: 400 });
  }
  const { username, totp } = validateResult.data;
  const admin = await prisma.admin.findUnique({
    where: { username },
    select: { secret: true },
  });
  if (admin === null)
    return new Response("Failed to login, retry later", { status: 403 });
  if (
    totpGenerator(admin.secret) === totp ||
    totpGenerator(admin.secret, {
      timestamp: new Date().getTime() - 30 * 1000,
    }) === totp
  ) {
    const cookie = cookies().set("admin", generateToken(username), cookieConfig);
    return new Response("Login success", {
      headers: {
        "Set-Cookie": cookie.toString(),
      },
    });
  }
  return new Response("Failed to login, retry later", { status: 403 });
}

export async function DELETE() {
  const cookie = cookies()
  cookie.set("admin", "", {...cookieConfig, expires: new Date().getTime() - 1000})
  return new Response("Logout success", {
    headers: {
      "Set-Cookie": cookie.toString(),
    },
  });
}
