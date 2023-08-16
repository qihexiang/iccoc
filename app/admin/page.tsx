import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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
    const adminUsername = cookies().get("admin")
    if(adminUsername === undefined || await  prisma.admin.count({where: {username: adminUsername.value}}) === 0) {
        return redirect("/admin/login")
    }

    return <AdminHome></AdminHome>
}