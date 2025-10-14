import type { NextFunction, Request, Response } from 'express'

import { AccountsRules } from '../AccountsRules.ts'
import { FindUserBankAccountService } from '../../../services/FindUserBankAccountService.ts'
import { CreateUserBankAccountService } from '../../../services/CreateUserBankAccountService.ts'
import { DeleteBankAccountByAccountId } from '../../../services/DeleteBankAccountByAccountId.ts'
import { IncrementUserBankAccountBalanceService } from '../../../services/IncrementUserBankAccountBalanceService.ts'

const rules = new AccountsRules()

export class AccountsController {
  constructor() {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body

      rules.validate(
        { userId, isRequiredField: true },
      )

      const createUserBankAccountService = new CreateUserBankAccountService()
      await createUserBankAccountService.execute({ userId })

      return res.send_created('Conta criada com sucesso')
    } catch (error) {
      next(error)
    }
  }

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      rules.validate({ id, isRequiredField: true })

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
      const { id } = req.params
      const { increment } = req.body

      rules.validate(
        { id, isRequiredField: true },
        { increment, isRequiredField: true },
      )

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
      const { id } = req.params
      rules.validate({ id, isRequiredField: true })

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
