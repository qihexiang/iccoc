import bcrypt from "bcrypt";
import prisma from "./prisma";

export async function createAdmin(account: string, password: string) {
    const bcrypted = await bcrypt.hash(password, 10);
    const created = await prisma.admin.create({
        data: {
            account, password: bcrypted
        }, select: {
            account: true
        }
    });
    return created
}

export async function passwdAdmin(account: string, password: string) {
    const bcrypted = await bcrypt.hash(password, 10);
    const update = await prisma.admin.update({
        where: {
            account
        }, data: {
            password: bcrypted
        }, select: {
            account: true
        }
    });
    return update
}

export async function checkAdmin(account: string, password: string) {
    const admin = await prisma.admin.findUnique({
        where: { account }, select: {
            password: true
        }
    });
    const matched = admin !== null && await bcrypt.compare(password, admin.password)
    return matched
}


