import type { NextFunction, Request, Response } from 'express'

import { JWT } from '../lib/Jwt.ts'
import { throwlhos } from '../globals/Throwlhos.ts'

type JWTPayload = {
  payload: {
    userId: string
  }
}

export const verifyJwt = (req: Request, _: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) throw throwlhos.err_unauthorized('Usuário não autorizado. token não encontrado')

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
