<<<<<<< HEAD
import { errorLog } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

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
                    const { title, content, authors } = await req.body;
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
                                        data: authors
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
                }
            } else if (req.method === "DELETE") {
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
                    prisma.$transaction([prisma.abstract.update({
                        where: {
                            id: Number(id)
                        }, data: {
                            authors: {
                                deleteMany: {}
                            }
                        }
                    }),
                    prisma.abstract.delete({
                        where: {
                            id: Number(id)
                        },
                        include: {
                            authors: true
                        }
                    })])
                }
                res.status(200).json({
                    ok: true, data: {}
                })
            } else {
                res.status(405).setHeader("Allow", ["GET", "PUT", "DELETE"]).json({
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

=======
import { errorLog } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

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
                    const { title, content, authors } = await req.body;
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
                                        data: authors
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
                }
            } else if (req.method === "DELETE") {
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
                    prisma.$transaction([prisma.abstract.update({
                        where: {
                            id: Number(id)
                        }, data: {
                            authors: {
                                deleteMany: {}
                            }
                        }
                    }),
                    prisma.abstract.delete({
                        where: {
                            id: Number(id)
                        },
                        include: {
                            authors: true
                        }
                    })])
                }
                res.status(200).json({
                    ok: true, data: {}
                })
            } else {
                res.status(405).setHeader("Allow", ["GET", "PUT", "DELETE"]).json({
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

>>>>>>> dev
export default withIronSessionApiRoute(abstractRoute, sessionOptions)