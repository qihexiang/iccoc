import bcrypt from "bcrypt";
import prisma from "./prisma";
import HttpError from "./HttpError";
import { AbstractCreateSchema, AbstractUpdateSchema, AuthorUpdateSchema, AuthorsCreateSchema } from "./abstract";

/**
 * 创建用户
 * 
 * @param email 
 * @param password 
 * @returns 
 */
export async function createUser(email: string, password: string) {
    const bcrypted = await bcrypt.hash(password, 8);
    const created = await prisma.user.create({
        data: {
            email, password: bcrypted
        }, select: {
            email: true
        }
    });
    return created
}

/**
 * 用户重设密码
 * 
 * @param email 
 * @param password 
 * @returns 
 */
export async function passwdUser(email: string, password: string) {
    const bcrypted = await bcrypt.hash(password, 8);
    const updated = await prisma.user.update({
        where: {
            email
        },
        data: {
            password: bcrypted
        }, select: {
            email: true
        }
    });
    return updated
}

/**
 * 权限检查
 * 
 * @param email 
 * @param password 
 * @returns 
 */
export async function checkUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email }, select: {
            password: true
        }
    });
    const matched = user !== null && await bcrypt.compare(password, user.password)
    return matched
}

/**
 * 获得用户上传的所有摘要
 * 
 * @param email 
 * @returns 
 */
export async function userGetAbstracts(email: string, pageIndex: number, pageSize: number) {
    if (![pageIndex, pageSize].every(value => value >= 0 && Number.isInteger(value)) || pageSize > 100) {
        throw new HttpError(400, "Invalid page size or page index.")
    }
    const user = await prisma.user.findUnique({
        where: { email }, select: {
            abstracts: {
                take: pageSize, skip: pageIndex, include: {
                    authors: true
                }
            }
        }
    });
    if (user === null) throw new HttpError(404, "User not existed")
    return user.abstracts
}

/**
 * 获得用户的某篇摘要详情（含有附件情况）
 * 
 * @param email 
 * @param abstractId 
 * @returns 
 */
export async function userGetAbstract(email: string, abstractId: number) {
    const abstract = await prisma.abstract.findFirst({
        where: { id: abstractId, user: { email } }, include: {
            authors: true, attachments: true
        }
    })
    return abstract
}

/**
 * 创建摘要（不含附件）
 * 
 * @param email 
 * @param data 
 * @returns 
 */
export async function userCreateAbstract(email: string, data: unknown) {
    const schemaChecked = AbstractCreateSchema.safeParse(data);
    if (schemaChecked.success) {
        const abstract = schemaChecked.data;
        const created = await prisma.abstract.create({
            data: {
                ...abstract, user: { connect: { email } }
            }
        });
        return created;
    } else {
        throw new HttpError(400, "Invalid input data.")
    }
}

/**
 * 更新摘要（不含附件）
 * 
 * @param email 
 * @param abstractId 
 * @param data 
 * @returns 
 */
export async function userUpdateAbstract(email: string, abstractId: number, data: unknown) {
    const schemaChecked = AbstractUpdateSchema.safeParse(data);
    if (schemaChecked.success) {
        const patch = schemaChecked.data;
        try {
            const updated = await prisma.user.update({
                where: {
                    email
                }, data: {
                    abstracts: {
                        update: {
                            where: { id: abstractId },
                            data: patch
                        }
                    }
                }, select: {
                    abstracts: true
                }
            })
            return updated.abstracts
        } catch (err) {
            throw new HttpError(403, "Permission denied. Try again after refresh the page.")
        }
    }
    throw new HttpError(400, "Bad input data type.")
}

/**
 * 删除摘要（对应附件也会被删除）
 * 
 * @param email 
 * @param abstractId 
 * @returns 
 */
export async function userDeleteAbstract(email: string, abstractId: number) {
    try {
        const updated = await prisma.user.update({
            where: {
                email
            }, data: {
                abstracts: {
                    delete: {
                        id: abstractId
                    }
                }
            }, select: {
                abstracts: true
            }
        })
        return updated.abstracts
    } catch (err) {
        throw new HttpError(403, "Permission denied. Try again after refresh the page.")
    }
}

/**
 * 获得摘要的某个附件信息
 * 
 * @param email 
 * @param abstractId 
 * @param filename 
 * @returns 
 */
export async function userGetAttachment(email: string, abstractId: number, filename: string) {
    const result = await prisma.user.findUnique({
        where: {
            email
        },
        select: {
            abstracts: {
                where: { id: abstractId },
                select: {
                    attachments: {
                        where: {
                            filename
                        },
                        select: {
                            fsname: true
                        }
                    }
                }
            }
        }
    })
    if (result?.abstracts[0]?.attachments[0]?.fsname !== undefined) {
        return result.abstracts[0].attachments[0].fsname
    }
    throw new HttpError(404, "No such attachment.")
}

/**
 * 上传附件后的信息录入
 * 
 * @param email 
 * @param abstractId 
 * @param filename 
 * @param fsname 
 * @param size 
 * @returns 
 */
export async function userUploadAttachments(email: string, abstractId: number, filename: string, fsname: string, size: number) {
    try {
        const updated = await prisma.user.update({
            where: {
                email
            },
            data: {
                abstracts: {
                    update: {
                        where: { id: abstractId },
                        data: {
                            attachments: {
                                create: {
                                    filename, fsname, size
                                }
                            }
                        }
                    }
                }
            },
            select: {
                abstracts: {
                    where: {
                        id: abstractId
                    },
                    select: {
                        attachments: true
                    }
                }
            }
        })
        return updated.abstracts[0].attachments
    } catch (err) {
        throw new HttpError(403, "Permission denied, there might be files with same name.")
    }
}

/**
 * 删除附件后的信息移除
 * 
 * @param email 
 * @param abstractId 
 * @param filename 
 * @returns 
 */
export async function userDeleteAttachements(email: string, abstractId: number, filename: string) {
    try {
        const updated = await prisma.user.update({
            where: { email },
            data: {
                abstracts: {
                    update: {
                        where: { id: abstractId },
                        data: {
                            attachments: {
                                delete: {
                                    abstractId_filename: {
                                        abstractId: abstractId, filename
                                    }
                                }
                            }
                        }
                    }
                }
            },
            select: {
                abstracts: {
                    where: {
                        id: abstractId
                    },
                    select: {
                        attachments: true
                    }
                }
            }
        })
        return updated.abstracts[0].attachments
    } catch (err) {
        throw new HttpError(403, "Permission denied, please retry after refresh the page.")
    }
}

export async function userAddAuthor(email: string, abstractId: number, data: unknown) {
    const dataChecked = AuthorsCreateSchema.safeParse(data);
    if (dataChecked.success) {
        const updated = await prisma.user.update({
            where: { email }, data: {
                abstracts: {
                    update: {
                        where: {
                            id: abstractId
                        }, data: {
                            authors: {
                                create: dataChecked.data
                            }
                        }
                    }
                }
            }, select: {
                abstracts: {
                    where: {
                        id: abstractId
                    },
                    select: { authors: true }
                }
            }
        }).catch(() => { throw new HttpError(403, "Permission denied, refresh and retry later.") })
        return updated.abstracts[0].authors
    }
    throw new HttpError(400, "Invalid user input, check and retry later.")
}

export async function userUpdateAuthor(email: string, abstractId: number, authorId: number, data: unknown) {
    const dataChecked = AuthorUpdateSchema.safeParse(data);
    if (dataChecked.success) {
        const updated = await prisma.user.update({
            where: {
                email
            }, data: {
                abstracts: {
                    update: {
                        where: {
                            id: abstractId
                        }, data: {
                            authors: {
                                update: {
                                    where: { id: authorId },
                                    data: dataChecked.data
                                }
                            }
                        }
                    }
                }
            }, select: {
                abstracts: {
                    where: {
                        id: abstractId
                    }, select: {
                        authors: true
                    }
                }
            }
        })
        return updated.abstracts[0].authors
    }
    throw new HttpError(400, "Invalid user input, please check and retry")
}

export async function userRemoveAuthor(email: string, abstractId: number, authorId: number) {
    const updated = await prisma.user.update({
        where: { email }, data: {
            abstracts: {
                update: {
                    where: { id: abstractId }, data: {
                        authors: {
                            delete: {
                                id: authorId
                            }
                        }
                    }
                }
            }
        }, select: {
            abstracts: {
                where: {
                    id: abstractId
                },
                select: {
                    authors: true
                }
            }
        }
    }).catch(() => { throw new HttpError(403, "Permission denied, refresh and retry later.") })
    return updated.abstracts[0].authors
}
