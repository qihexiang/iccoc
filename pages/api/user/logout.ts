import logger from "@/lib/logger";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { NextApiHandler } from "next";

const LogoutRoute: NextApiHandler = (req, res) => {
  req.session.destroy();
  logger(`User Logout: ${req.session.user?.email}`, 2)
  res.send("Logged out");
};

export default withIronSessionApiRoute(LogoutRoute, sessionOptions);
