import { errorLog } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { abstractSchema } from '@/pages/activities/panel';
import { withIronSessionApiRoute } from 'iron-session/next'
import { includes } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next'

async function abstractRoute(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    if (req.session.user === undefined) {
        res.status(403).json({
            ok: false, message: "Please login."
        })
    } else {
        const { email } = req.session.user;
        try {
            if (req.method === "GET") {
                const abstract = await prisma.abstract.findFirst({
                    where: {
                        id: Number(id as string), user: {
                            email
                        }
                    }, include: {
                        authors: true
                    }
                });
                if (abstract !== null) {
                    res.status(200).json({
                        ok: true, data: {
                            abstract
                        }
                    })
                }
            } else if (req.method === "PUT") {
                const belongTo = await prisma.abstract.findFirst({
                    where: {
                        id: Number(id as string), user: {
                            email
                        }
                    }, select: { title: true }
                })
                if (belongTo === null) {
                    res.status(403).json({
                        ok: false, message: "Not permitted."
                    })
                } else {
                    const data = await req.body;
                    const result = abstractSchema.safeParse(data)
                    if (result.success) {
                        const {
                            title, content, authors, speaker, correspondAuthor
                        } = result.data;
                        const authorsToCreate = authors.map((author, idx) => ({ ...author, isSpeaker: idx === speaker, isCorrespondAuthor: idx === correspondAuthor }))
                        const [_, updated] = await prisma.$transaction([
                            prisma.abstract.update({
                                where: { id: Number(id) },
                                data: {
                                    title, content, authors: {
                                        deleteMany: {}
                                    }
                                }
                            }),
                            prisma.abstract.update({
                                where: { id: Number(id) },
                                data: {
                                    authors: {
                                        createMany: {
                                            data: authorsToCreate
                                        }
                                    }
                                }
                            })
                        ])
                        res.status(200).json({
                            ok: true, data: {
                                abstract: updated
                            }
                        })
                    } else {
                        res.status(400).json({
                            ok: false, message: result.error.message
                        })
                    }
                }
            } else {
                res.status(405).setHeader("Allow", ["GET", "PUT"]).json({
                    ok: false, message: "Invalid request method."
                })
            }
        } catch (err) {
            errorLog(err)
            res.status(500).json({
                ok: false,
                message: "Internal server error, please check if all information correct and submit a few minutes later. If this still happens, please contact qihexiang@outlook.com"
            })
        }
    }
}

export default withIronSessionApiRoute(abstractRoute, sessionOptions)