import HttpError from "@/lib/HttpError";
import { errorLog } from "@/lib/errors";
import { sessionOptions } from "@/lib/session";
import { userAddAuthor } from "@/lib/user";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

async function authorRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.session.user === undefined) {
        return res.status(403).json({
            message: "Please login."
        })
    }
    const { email } = req.session.user;

    const { id: idStr } = req.query;
    const id = Number(idStr);
    if (!Number.isInteger(id) || id < 0) {
        return res.status(400).json({
            message: "Invalid abstract id."
        })
    }

    if (req.method === "POST") {
        const data = await req.body;
        try {
            const authors = await userAddAuthor(email, id, data);
            return res.json(authors)
        } catch(err) {
            if (err instanceof HttpError) {
                return res.status(err.status).json({
                    message: err.reason
                })
            }

            errorLog(err)
            return res.status(500).json({
                message: "Internal server error."
            })
        }
    }

    return res.status(405).setHeader("Allow", ["POST"]).json({
        message: "Invalid request method."
    })
}

export default withIronSessionApiRoute(authorRoute, sessionOptions)