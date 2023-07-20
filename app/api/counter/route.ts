import { getCount } from "@/lib/redis";
import { nanoid } from "nanoid";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const countId = req.cookies.get("count") as string | undefined;
  const count = await getCount(countId);
  if (countId === undefined) {
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: {
        "Set-Cookie": `count=${nanoid()}`,
      },
    });
  }
  return new Response(JSON.stringify({ count }));
}
// async function counterRoute(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "GET") {
//     const count = await getCount(req.session.count);
//     if (req.session.count === undefined) {
//       req.session.count = nanoid();
//       await req.session.save();
//     }
//     return res.json({
//       count,
//     });
//   }

//   return res.status(405).setHeader("Allow-Headers", ["GET"]).json({
//     message: "Invalid request method.",
//   });
// }

// export default withIronSessionApiRoute(counterRoute, sessionOptions);
