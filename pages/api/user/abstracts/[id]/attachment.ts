import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { rename } from "fs/promises";
import { extname, join } from "path";
import { cwd } from "process";
import HttpError from "@/lib/HttpError";
import { userUploadAttachments } from "@/lib/user";
import { nanoid } from "nanoid";
import { errorLog } from "@/lib/errors";
import { sessionOptions } from "@/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";

async function attachmentRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.session.user === undefined) {
        return res.status(403).json({
            ok: false, message: "Please login."
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
        const form = formidable({ multiples: false });
        form.parse(req, async (err, _fileds, files) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to transport data."
                })
            }
            const target = files["attachment"];
            try {
                if (target !== undefined && !(target instanceof Array)) {
                    const fileId = nanoid();
                    await rename(target.filepath, join(cwd(), "data", fileId)).catch((err) => {
                        const error = new HttpError(500, "Something wrong with file upload.")
                        error.cause = err
                        throw error
                    });
                    const file = await userUploadAttachments(email, id, target.originalFilename ?? `${fileId}${extname(target.filepath)}`, fileId, target.size);
                    return res.json(file)
                }
                return res.status(400).json({
                    message: "Invalid uploaded data, retry later."
                })
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
        })
    }

    return res.status(405).setHeader("Allow", ["POST"]).json({
        message: "Invalid request method."
    })
}

export default withIronSessionApiRoute(attachmentRoute, sessionOptions)