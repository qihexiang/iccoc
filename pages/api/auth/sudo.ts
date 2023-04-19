import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import totp from "totp-generator"
import base32Encode from "base32-encode";

const secret = base32Encode(new TextEncoder().encode(process.env.SUDO_SECRET as string), "RFC4648");

async function sudoRoute(req: NextApiRequest, res: NextApiResponse) {
    const { otp } = await req.body;
    if (otp === totp(secret) || otp === totp(secret, {
        timestamp: new Date().getTime() - 30 * 1000
    })) {
        req.session.sudo = true
        await req.session.save()
        res.send({
            ok: true, data: {
                success: true
            }
        })
    } else {
        res.status(403).json({
            ok: false, message: "Please try again."
        })
    }
}

export default withIronSessionApiRoute(sudoRoute, sessionOptions)
