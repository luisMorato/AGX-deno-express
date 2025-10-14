import type { Request, Response, NextFunction } from 'express'

import { UnauthorizedError } from "../_errors/unauthorized-error.ts";
import { JWT } from '../lib/jwt.ts'

type JWTPayload = {
    payload: {
        userId: string
    }
}

export const verifyJwt = (req: Request, _: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) throw new UnauthorizedError('Usuário não autorizado. token não encontrado')
        
        const jwt = new JWT()
        jwt.verify(token)
        
        const { payload } = jwt.decode<JWTPayload>(token)
        req.user = {
            id: payload.userId,
        }
        next()
    } catch (error) {
        next(error)
    }
}