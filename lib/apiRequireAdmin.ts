import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { parseToken } from "./cookieConfig";
import prisma from "./prisma";

export default async function apiRequireAdmin() {
  const cookie = cookies();
  const errResponse = () => {
    const responseCookie = cookie.set("admin", "")
    return NextResponse.json(null, {
      status: 403, headers: {
        "Set-Cookie": responseCookie.toString()
      }
    })
  }
  const adminCookie = cookie.get("admin")
  if (adminCookie === undefined) return errResponse()
  const username = parseToken(adminCookie.value)
  if (username === null) return errResponse()
  if ((await prisma.admin.count({ where: { username } })) === 0) return errResponse()
  return username
}
