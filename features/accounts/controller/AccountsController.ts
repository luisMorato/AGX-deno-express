import type { NextFunction, Request, Response } from 'express'

import { AccountsRules } from '../AccountsRules.ts'
import { FindUserBankAccountService } from '../../../services/FindUserBankAccountService.ts'
import { CreateUserBankAccountService } from '../../../services/CreateUserBankAccountService.ts'
import { DeleteBankAccountByAccountId } from '../../../services/DeleteBankAccountByAccountId.ts'
import { IncrementUserBankAccountBalanceService } from '../../../services/IncrementUserBankAccountBalanceService.ts'

const rules = new AccountsRules()

export class AccountsController {
  private createUserBankAccountService: CreateUserBankAccountService
  private findUserBankAccountService: FindUserBankAccountService
  private incrementUserBankAccountBalanceService: IncrementUserBankAccountBalanceService
  private deleteBankAccountByAccountId: DeleteBankAccountByAccountId

  constructor({
    createUserBankAccountService = new CreateUserBankAccountService(),
    findUserBankAccountService = new FindUserBankAccountService(),
    incrementUserBankAccountBalanceService = new IncrementUserBankAccountBalanceService(),
    deleteBankAccountByAccountId = new DeleteBankAccountByAccountId(),
  } = {}) {
    this.createUserBankAccountService = createUserBankAccountService
    this.findUserBankAccountService = findUserBankAccountService
    this.incrementUserBankAccountBalanceService = incrementUserBankAccountBalanceService
    this.deleteBankAccountByAccountId = deleteBankAccountByAccountId
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body

      rules.validate(
        { userId, isRequiredField: true },
      )

      await this.createUserBankAccountService.execute({ userId })

      return res.send_created('Conta criada com sucesso')
    } catch (error) {
      next(error)
    }
  }

  find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      rules.validate({ id, isRequiredField: true })

      const userId = req.user?.id || ''

      const { userBankAccount } = await this.findUserBankAccountService.execute({
        accountId: id,
        userId,
      })

      return res.send_ok('', { userBankAccount })
    } catch (error) {
      next(error)
    }
  }

  increment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { increment } = req.body

      rules.validate(
        { id, isRequiredField: true },
        { increment, isRequiredField: true },
      )

      const userId = req.user?.id || ''

      await this.incrementUserBankAccountBalanceService.execute({
        id,
        userId,
        increment,
      })

      return res.send_ok(`R$${increment} adicionado a conta: ${id}`)
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      rules.validate({ id, isRequiredField: true })

      const userId = req.user?.id || ''

      await this.deleteBankAccountByAccountId.execute({
        accountId: id,
        userId,
      })

      return res.send_ok('Conta excluída com sucesso')
    } catch (error) {
      next(error)
    }
  }
}
