import { throwlhos } from '../globals/Throwlhos.ts'
import { UserRepository } from '../models/user/UserRepository.ts'
import { TransferRepository } from '../models/transfers/TransferRepository.ts'

type IBankAccountResumeService = {
  accountId: string
  from: Date | null
  to: Date | null
}

export class BankAccountResumeService {
  private userRepository: UserRepository
  private transferRepository: TransferRepository

  constructor(
    transferRepository = new TransferRepository(),
    userRepository = new UserRepository(),
  ) {
    this.transferRepository = transferRepository
    this.userRepository = userRepository
  }

  async execute({ accountId, from, to }: IBankAccountResumeService) {
    const [existingBankAccount] = await this.userRepository.aggregate([
      { $match: { 'bankAccount.accountId': accountId } },
      {
        $project: {
          _id: false,
          bankAccount: true,
        },
      },
    ])

    if (!existingBankAccount) throw throwlhos.err_notFound('Conta bancária não encontrada')

    const aggregatePipeline: any = [
      { $match: { senderAccountId: accountId } },
    ]

    if (from && to) {
      aggregatePipeline.push(
        {
          $match: {
            createdAt: {
              $gte: from,
              $lte: to,
            },
          },
        },
      )
    }

    const transfersResume = await this.transferRepository.aggregate([
      ...aggregatePipeline,
      {
        $group: {
          _id: '$transactionType',
          transactionsCount: { $count: {} },
          totalSpent: { $sum: '$amount' },
        },
      },
    ])

    return {
      transfersResume,
    }
  }
}
