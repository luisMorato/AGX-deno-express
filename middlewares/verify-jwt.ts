import type { Request, Response, NextFunction } from 'express'
import jsonWebToken from "jsonwebtoken";
import { UnauthorizedError } from "../_errors/unauthorized-error.ts";

export const verifyJwt = (req: Request, _: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) throw new UnauthorizedError('Usuário não autorizado. token não encontrado')
        
        jsonWebToken.verify(token, Deno.env.get('JWT_SECRET')!)
        next()
    } catch (error) {
        next(error)
    }
}