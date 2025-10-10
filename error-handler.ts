import type { Request, Response } from 'express'

import { UserNotFoundError } from "./_errors/user-not-found-error.ts";
import { UnauthorizedError } from "./_errors/unauthorized-error.ts";
import { InvalidCredentialsError } from "./_errors/invalid-credentials-error.ts";
import { UserAlreadyExistsError } from "./_errors/user-already-exists-error.ts";

export const errorHandler = (error: Error, _: Request, res: Response) => {
    console.log('Error: ', error instanceof UserNotFoundError)

    if (error instanceof UserAlreadyExistsError) {
      return res.status(409).json({ error: error.message }).send()
    }

    if (error instanceof UserNotFoundError) {
      return res.status(404).json({ error: error.message }).send()
    }

    if (error instanceof InvalidCredentialsError || error instanceof UnauthorizedError) {
      return res.status(401).json({ error: error.message }).send()
    }

    return res.status(500).json({ error: 'Erro interno do servidor' }).send()
}