import type { Request, Response, NextFunction } from "express";

import z from "zod";
import { isValidObjectId } from "mongoose";

import { FindUserBankAccountService } from "../../../services/find-user-bank-account-service.ts";
import { CreateUserBankAccountService } from "../../../services/create-user-bank-account-service.ts";
import { DeleteBankAccountByAccountId } from "../../../services/delete-bank-account-by-account-id.ts";
import { IncrementUserBankAccountBalanceService } from "../../../services/increment-user-bank-account-balance-service.ts";

const createUserAccountBodySchema = z.object({
  userId: z.string().min(1, {
    error: 'O usuário é obrigatório',
  }).refine((userId) => isValidObjectId(userId)),
})

const findAccountByIdParamsSchema = z.object({
  id: z.string().min(1, {
    error: 'O id da conta é obrigatório',
  })
})

const updateUserBankAccountBalanceBodySchema = z.object({
  increment: z.coerce.number()
})

export class AccountsController {
  constructor() {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = createUserAccountBodySchema.parse(req.body)

      const createUserBankAccountService = new CreateUserBankAccountService()
      await createUserBankAccountService.execute({ userId })

      return res.status(201).json('Conta criada com sucesso')
    } catch (error) {
      next(error)
    }
  }

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = findAccountByIdParamsSchema.parse(req.params)

      const findUserBankAccountService = new FindUserBankAccountService()

      const userId = req.user?.id || ''

      const { userBankAccount } = await findUserBankAccountService.execute({
        accountId: id,
        userId,
      })

      return res.status(200).json({ userBankAccount })
    } catch (error) {
      next(error)
    }
  }

  async increment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = findAccountByIdParamsSchema.parse(req.params)
      const { increment } = updateUserBankAccountBalanceBodySchema.parse(req.body)

      const userId = req.user?.id || ''

      const incrementUserBankAccountBalanceService = new IncrementUserBankAccountBalanceService()
      await incrementUserBankAccountBalanceService.execute({
        id,
        userId,
        increment,
      })

      res.status(200).json(`R$${increment} adicionado a conta: ${id}`)
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = findAccountByIdParamsSchema.parse(req.params)

      const userId = req.user?.id || ''

      const deleteBankAccountByAccountId = new DeleteBankAccountByAccountId()

      await deleteBankAccountByAccountId.execute({
        accountId: id,
        userId,
      })

      return res.status(200).json('Conta excluída com sucesso')
    } catch (error) {
      next(error)
    }
  }
}