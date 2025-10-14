import type { NextFunction, Request, Response } from 'express'

import z from "zod"
import { JWT } from '../../../lib/jwt.ts'
import { AuthenticateService } from "../../../services/authenticate-service.ts";

const authenticateBodySchema = z.object({
    email: z.email({
        error: 'Email Inválido'
    }).min(1, {
        error: 'O email é obrigatório',
    }),
    password: z.string().min(1, {
        error: 'A senha é obrigatória',
    }),
})

export class AuthController {
    constructor() {}

    async authenticate(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = authenticateBodySchema.parse(req.body)

            const authenticateService = new AuthenticateService()
            
            const { userId } = await authenticateService.execute({
                email,
                password
            })

            const jwt = new JWT()
            
            const token = jwt.sign({
                payload: {
                    userId,
                }
            })

            return res.status(200).cookie('auth-token', token).send()
        } catch (error) {
            next(error)
        }

    }
}