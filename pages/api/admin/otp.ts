import { NextApiRequest, NextApiResponse } from "next";
import totp from "totp-generator"
import base32Encode from "base32-encode"

export default function otpHandler(req: NextApiRequest, res: NextApiResponse) {
    res.send(totp(base32Encode(Buffer.from(process.env.APP_SECRET as string), 'RFC4648')))
}