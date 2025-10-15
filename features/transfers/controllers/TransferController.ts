// deno-lint-ignore-file
import type { NextFunction, Request, Response } from 'express'

import fnCode from 'npm:fn-code'
import { addDays, endOfDay, isValid as isValidDate, startOfDay, subHours } from 'date-fns'

import { TransfersRules } from '../TransfersRules.ts'
import { CreateTransferService } from '../../../services/CreateTransferService.ts'
import { FetchTransfersService } from '../../../services/FetchTransfersService.ts'
import { FindTransfersByAccountId } from '../../../services/FindTransfersByAccountId.ts'
import { BankAccountResumeService } from '../../../services/BankAccountResumeService.ts'

const rules = new TransfersRules()

export class TransferController {
  constructor() {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        senderAccountId,
        receiverAccountId,
        amount,
        transactionType,
      } = req.body

      rules.validate(
        { senderAccountId, isRequiredField: true },
        { receiverAccountId, isRequiredField: true },
        { amount, isRequiredField: true },
        { transactionType, isRequiredField: false },
      )

      const userId = req.user?.id || ''

      const createTransferService = new CreateTransferService()

      await createTransferService.execute({
        userId,
        senderAccountId,
        receiverAccountId,
        amount,
        transactionType,
      })

      return res.send_created('Transferência realizada com sucesso')
    } catch (error) {
      next(error)
    }
  }

  async list(_: Request, res: Response, next: NextFunction) {
    try {
      const fetchTransfersService = new FetchTransfersService()

      const { transfers } = await fetchTransfersService.execute()

      return res.send_ok('', { transfers })
    } catch (error) {
      next(error)
    }
  }

  async findByAccountId(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountId } = req.params

      rules.validate(
        { accountId, isRequiredField: true },
      )

      const findTransfersByAccountId = new FindTransfersByAccountId()

      const { transfers } = await findTransfersByAccountId.execute({ accountId })

      return res.send_ok('', { transfers })
    } catch (error) {
      next(error)
    }
  }

  async spent(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        accountId,
      } = req.params

      const {
        from,
        to,
      } = req.query as { from: string; to: string }

      rules.validate(
        { accountId, isRequiredField: true },
        { from, isRequiredField: false },
        { to, isRequiredField: false },
      )

      if (new Date(from) > new Date(to)) {
        return res.send_badRequest('A data de inicio deve ser menor que a data final')
      }

      let startDate = null
      let endDate = null

      if (isValidDate(new Date(from)) && isValidDate(new Date(to))) {
        const ZONE = 'brasilia'

        const TIMEZONE: number = fnCode.default.one(
          ZONE,
          {
            'brasilia': 3,
          },
          {
            default: 3,
          },
        )

        startDate = addDays(subHours(startOfDay(from), TIMEZONE), 1) //  Remove TZ hours
        endDate = addDays(subHours(endOfDay(to), TIMEZONE), 1) //  Remove TZ hours
      }

      const bankAccountResumeService = new BankAccountResumeService()
      const { transfersResume } = await bankAccountResumeService.execute({
        accountId,
        from: startDate,
        to: endDate,
      })

      return res.send_ok('', transfersResume)
    } catch (error) {
      next(error)
    }
  }
}
