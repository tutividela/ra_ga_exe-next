import type { NextApiRequest, NextApiResponse } from "next";
import sha256 from "crypto-js/sha256";
import { prisma } from "../../../server/db/client";
import { z, ZodError } from "zod";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === "POST") {
        await handlePOST(req, res);
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
}

const hashPassword = (password: string) => {
    return sha256(password).toString();
};

const User = z.object({
    name: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(50),
    confirmPassword: z.string().min(8).max(50),
}).refine(data => data.password === data.confirmPassword, "Passwords must match");



async function handlePOST(req: NextApiRequest, res: NextApiResponse) {

    try {
        const data = User.parse(req.body);
        const password = hashPassword(data.password);
        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: password,
            }
        });

        await prisma.account.create({
            data: {
                userId: user.id,
                type: "credentials",
                provider: "credentials",
                providerAccountId: user.id,
            },
        })

        res.status(200).json({
            statusCode: 200,
            body: {
                user: {
                    name: user.name,
                    email: user.email,
                    image: user.image,
                }
            }
        })
    }
    catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({ statusCode: 400, body: e.flatten() })
        }
        throw e;
    }

}
