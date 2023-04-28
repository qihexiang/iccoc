import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { copyFile, rename, unlink } from "fs/promises";
import { extname, join } from "path";
import { cwd } from "process";
import HttpError from "@/lib/HttpError";
import { userUploadAttachments } from "@/lib/user";
import { nanoid } from "nanoid";
import { errorLog } from "@/lib/errors";
import { sessionOptions } from "@/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function attachmentRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user === undefined) {
    return res.status(403).json({
      ok: false,
      message: "Please login.",
    });
  }
  const { email } = req.session.user;

  const { id: idStr } = req.query;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id < 0) {
    return res.status(400).json({
      message: "Invalid abstract id.",
    });
  }

  if (req.method === "POST") {
    try {
      const form = formidable({
        multiples: false,
        maxFileSize: 32 * 1024 * 1024,
      });
      const files = await new Promise<formidable.Files>((resolve, reject) => {
        form.parse(req, (err, _fileds, files) => {
          if (err) {
            reject(err);
          } else {
            resolve(files);
          }
        });
      }).catch((err) => {
        throw new HttpError(400, "Invalid user input");
      });
      const file = files["attachment"];
      if (file !== undefined && !(file instanceof Array)) {
        const fileId = nanoid();
        await copyFile(file.filepath, join(cwd(), "data", fileId))
          .then(() => unlink(file.filepath))
          .catch((err) => {
            errorLog(err)
            const error = new HttpError(
              500,
              "Something wrong with file upload."
            );
            error.cause = err;
            throw error;
          });
        const fileInfo = await userUploadAttachments(
          email,
          id,
          file.originalFilename ?? `${fileId}${extname(file.filepath)}`,
          fileId,
          file.size
        );
        return res.json(fileInfo);
      }
      return res.status(400).json({
        message: "Invalid user input",
      });
    } catch (err) {
      if (err instanceof HttpError) {
        return res.status(err.status).json({
          message: err.reason,
        });
      }

      errorLog(err);
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
  }

  return res.status(405).setHeader("Allow", ["POST"]).json({
    message: "Invalid request method.",
  });
}

export default withIronSessionApiRoute(attachmentRoute, sessionOptions);
