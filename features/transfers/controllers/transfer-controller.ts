import type { Request, Response, NextFunction } from 'express'

import z from "zod";
import JsonWebToken from 'jsonwebtoken';

import { CreateTransferService } from "../../../services/create-transfer-service.ts";
import { FetchTransfersService } from "../../../services/fetch-transfers-service.ts";
import { FindTransfersByAccountId } from "../../../services/find-transfers-by-account-id.ts";

const createTransferBodySchema = z.object({
  senderAccountId: z.string(),
  receiverAccountId: z.string(),
  amount: z.coerce.number().gt(0, {
    error: 'Quantidade deve ser maior que 0'
  }),
})

const findTransfersByAccountIdParamsSchema = z.object({
  accountId: z.string().min(1, {
    error: 'A conta é necessária'
  })
})

type JWTPayload = {
    payload: {
        userId: string
    }
}

export class TransferController {
  constructor() {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        senderAccountId,
        receiverAccountId,
        amount,
      } = createTransferBodySchema.parse(req.body)

      const token = req.headers.authorization?.split(' ')[1]
      const { payload } = JsonWebToken.decode(token!) as JWTPayload

      const createTransferService = new CreateTransferService()

      await createTransferService.execute({
        userId: payload.userId,
        senderAccountId,
        receiverAccountId,
        amount,
      })

      return res.status(201).json('Transferência realizada com sucesso')
    } catch (error) {
      next(error)
    }
  }

  async list(_: Request, res: Response, next: NextFunction) {
    try {
      const fetchTransfersService = new FetchTransfersService()

      const { transfers } = await fetchTransfersService.execute()

      return res.status(200).json({ transfers })
    } catch (error) {
      next(error)
    }
  }

  async findByAccountId(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountId } = findTransfersByAccountIdParamsSchema.parse(req.params)

      const findTransfersByAccountId = new FindTransfersByAccountId()

      const { transfers } = await findTransfersByAccountId.execute({ accountId })

      return res.status(200).json({ transfers })
    } catch (error) {
      next(error)
    }
  }
}
