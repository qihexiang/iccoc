import pageRequireAdmin from "@/lib/pageRequireAdmin";
import prisma from "@/lib/prisma";
import { Collaborator, ProjectStatus, UserType } from "@prisma/client";
import AdminHome from "./AdminHome";

export type AbstractItemData = {
  title: string;
  status: ProjectStatus;
  filename: string;
  storagePath: string;
  user: {
    email: string;
    name: string;
    institution: string;
    title: string;
    phoneNumber: string;
    userType: UserType;
  };
  collaborators: Collaborator[];
};

export default async function AdminPage() {
  await pageRequireAdmin()
  const users = await prisma.user.findMany({
    include: {
      collaborators: true,
      projects: true,
    }
  })
  return <AdminHome></AdminHome>
}
