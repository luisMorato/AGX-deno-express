import { Itranfer } from '../models/transfers/Transfer.ts'
import { TransferRepository } from '../models/transfers/TransferRepository.ts'

type IfindTransfersByAccountIdRequest = {
  accountId: string
}

type IfindTransfersByAccountIdResponse = {
  transfers: Itranfer[]
}

export class FindTransfersByAccountId {
  private transferRepository: TransferRepository

  constructor(
    transferRepository = new TransferRepository(),
  ) {
    this.transferRepository = transferRepository
  }

  async execute({
    accountId,
  }: IfindTransfersByAccountIdRequest): Promise<IfindTransfersByAccountIdResponse> {
    const transfers = await this.transferRepository.findMany({
      $or: [
        { sender_account_id: accountId },
        { receiver_account_id: accountId },
      ],
    }) || []

    return {
      transfers,
    }
  }
}
