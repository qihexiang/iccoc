import pageRequireAdmin from "@/lib/pageRequireAdmin";
import prisma from "@/lib/prisma";
import UserManage from "./UserManage";

export default async function Page() {
  await pageRequireAdmin();
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });
  return (
    <div>
      <h1>User management</h1>
      <UserManage users={users}></UserManage>
    </div>
  );
}
