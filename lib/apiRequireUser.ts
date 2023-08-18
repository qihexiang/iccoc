import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { parseToken } from "./cookieConfig";
import prisma from "./prisma";

export default async function apiRequireUser() {
    const cookie = cookies();
    const errResponse = () => {
      const responseCookie = cookie.set("user", "")
      return new Response(null, {
        status: 403, headers: {
          "Set-Cookie": responseCookie.toString()
        }
      })
    }
    const userCookie = cookie.get("user")
    if (userCookie === undefined) return errResponse()
    const email = parseToken(userCookie.value)
    if (email === null) return errResponse()
    if ((await prisma.user.count({ where: { email } })) === 0) return errResponse()
    return email
}