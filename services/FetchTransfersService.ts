import { Itranfer } from '../models/transfers/Transfer.ts'
import { TransferRepository } from '../models/transfers/TransferRepository.ts'

type IfetchTransfersServiceResponse = {
  transfers: Itranfer[]
}

export class FetchTransfersService {
  private transferRespository: TransferRepository

  constructor(
    transferRespository = new TransferRepository(),
  ) {
    this.transferRespository = transferRespository
  }

  async execute(): Promise<IfetchTransfersServiceResponse> {
    const transfers = await this.transferRespository.findMany({}) || []

    return {
      transfers,
    }
  }
}
