import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { NextApiHandler } from "next";

const LogoutRoute: NextApiHandler = (req, res) => {
  req.session.destroy();
  res.send("Logged out");
}

export default withIronSessionApiRoute(LogoutRoute, sessionOptions);
