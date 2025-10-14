import type { NextFunction, Request, Response } from 'express'

import { TransfersRules } from '../TransfersRules.ts'
import { CreateTransferService } from '../../../services/CreateTransferService.ts'
import { FetchTransfersService } from '../../../services/FetchTransfersService.ts'
import { FindTransfersByAccountId } from '../../../services/FindTransfersByAccountId.ts'

const rules = new TransfersRules()

export class TransferController {
  constructor() {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        senderAccountId,
        receiverAccountId,
        amount,
      } = req.body

      rules.validate(
        { senderAccountId, isRequiredField: true },
        { receiverAccountId, isRequiredField: true },
        { amount, isRequiredField: true },
      )

      const userId = req.user?.id || ''

      const createTransferService = new CreateTransferService()

      await createTransferService.execute({
        userId,
        senderAccountId,
        receiverAccountId,
        amount,
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
        { accountId, isRequiredField: true }
      )

      const findTransfersByAccountId = new FindTransfersByAccountId()

      const { transfers } = await findTransfersByAccountId.execute({ accountId })

      return res.send_ok('', { transfers })
    } catch (error) {
      next(error)
    }
  }
}
