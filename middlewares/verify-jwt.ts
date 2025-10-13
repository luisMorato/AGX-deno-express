import type { Request, Response, NextFunction } from 'express'

import jsonWebToken from "jsonwebtoken";
import { UnauthorizedError } from "../_errors/unauthorized-error.ts";
// import { ForbiddenError } from '../_errors/forbidden-error.ts'

// type JWTPayload = {
//     payload: {
//         userId: string
//     }
// }

export const verifyJwt = (req: Request, _: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) throw new UnauthorizedError('Usuário não autorizado. token não encontrado')
        
        jsonWebToken.verify(token, Deno.env.get('JWT_SECRET')!)

        // const { payload } = jsonWebToken.decode(token) as JWTPayload

        // if (req.url.includes('/users') && req.params.id) {
        //     if (req.params.id !== payload.userId) {
        //         throw new ForbiddenError('Usuário não pode editar/vizualizar outro usuário')
        //     }
        // }
        next()
    } catch (error) {
        next(error)
    }
}