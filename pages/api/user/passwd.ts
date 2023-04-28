import HttpError from "@/lib/HttpError";
import { errorLog } from "@/lib/errors";
import { passwdUser } from "@/lib/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function passwdRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.session.user === undefined) {
        return res.status(403).json({
            ok: false, message: "Please login."
        })
    }
    const { email } = req.session.user;

    try {
        const { password } = await req.body;
        if (typeof password !== "string") {
            throw new HttpError(400, "Invalid user input.")
        }
        const updated = await passwdUser(email, password);
        return res.json(updated);
    } catch (err) {
        if (err instanceof HttpError) {
            return res.status(err.status).json({
                message: err.message
            })
        }
        errorLog(err)
        return res.status(500).json({
            message: "Internal server error."
        })
    }
}