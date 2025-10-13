import type { NextFunction, Request, Response } from 'express'

import { UserNotFoundError } from "./_errors/user-not-found-error.ts";
import { UnauthorizedError } from "./_errors/unauthorized-error.ts";
import { ZodError, treeifyError } from "zod";
import { UserAlreadyExistsError } from "./_errors/user-already-exists-error.ts";
import { UserWithoutFoundsError } from "./_errors/user-without-founds-error.ts";
import { InvalidCredentialsError } from "./_errors/invalid-credentials-error.ts";
import { UserBankAccountNotFoundError } from "./_errors/user-bank-account-not-found-error.ts";
import { UserBankAccountAlreadyExistsError } from "./_errors/user-bank-account-already-exists-error.ts";
import { ForbiddenError } from './_errors/forbidden-error.ts'

export const errorHandler = (error: Error, _: Request, res: Response, _next: NextFunction) => {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        error: treeifyError(error),
      }).send()
    }

    if (error instanceof UserAlreadyExistsError) {
      return res.status(409).json({ error: error.message }).send()
    }

    if (error instanceof UserNotFoundError) {
      return res.status(404).json({ error: error.message }).send()
    }
    
    if (error instanceof InvalidCredentialsError || error instanceof UnauthorizedError) {
      return res.status(401).clearCookie('auth-token').json({ error: error.message }).send()
    }

    if (error instanceof UserBankAccountAlreadyExistsError) {
      return res.status(409).json({ error: error.message }).send()
    }

    if (error instanceof UserBankAccountNotFoundError) {
      return res.status(404).json({ error: error.message }).send()
    }

    if (error instanceof UserWithoutFoundsError) {
      return res.status(400).json({ error: error.message }).send()
    }

    if (error instanceof ForbiddenError) {
      return res.status(403).json({ error: error.message }).send()
    }

    return res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message,
    }).send()
}