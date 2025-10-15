import { banksDB } from '../database/db/BanksDB.ts'
import { throwlhos } from '../globals/Throwlhos.ts'
import { UserRepository } from '../models/user/UserRepository.ts'
import { TransferRepository } from '../models/transfers/TransferRepository.ts'

type IcreateTransferServiceRequest = {
  senderAccountId: string
  userId: string
  receiverAccountId: string
  amount: number
}

export class CreateTransferService {
  private transferRepository: TransferRepository
  private userRepository: UserRepository

  constructor(
    transferRepository = new TransferRepository(),
    userRepository = new UserRepository(),
  ) {
    this.transferRepository = transferRepository
    this.userRepository = userRepository
  }

  async execute({
    amount,
    userId,
    senderAccountId,
    receiverAccountId,
  }: IcreateTransferServiceRequest) {
    const session = await banksDB.startSession()

    const senderAggregatePipeline = [
      { $match: { 'bankAccount.accountId': senderAccountId } },
      {
        $project: {
          bankAccount: true,
        },
      },
    ]

    const receiverAggregatePipeline = [
      { $match: { 'bankAccount.accountId': receiverAccountId } },
      {
        $project: {
          _id: false,
          bankAccount: true,
        },
      },
    ]

    const [
      [dbSender],
      [dbReceiverBankAccount],
    ] = await Promise.all([
      this.userRepository.aggregate(senderAggregatePipeline),
      this.userRepository.aggregate(receiverAggregatePipeline),
    ])

    if (!dbSender) throw throwlhos.err_notFound('Usuário não possui uma conta do banco')

    if (!dbReceiverBankAccount) throw throwlhos.err_notFound('Conta bancária do beneficiado não encontrada')

    const senderBankAccount = dbSender.bankAccount
    const senderId = String(dbSender._id)

    if (userId !== senderId) throw throwlhos.err_forbidden('Usuário não pode enviar dinheiro de contas que não sejam a sua')

    if (senderBankAccount.balance < amount) throw throwlhos.err_forbidden('Usuário não possui dinheiro suficiente para essa transação')

    try {
      session.startTransaction()

      await Promise.all([
        this.userRepository
          .updateOne(
            { 'bankAccount.accountId': senderAccountId },
            { $inc: { 'bankAccount.balance': -amount } },
          ),
        this.userRepository.updateOne(
          { 'bankAccount.accountId': receiverAccountId },
          { $inc: { 'bankAccount.balance': amount } },
        ),
        this.transferRepository.insertOne({
          amount,
          senderAccountId: senderAccountId,
          receiverAccountId: receiverAccountId,
        }),
      ])

      session.commitTransaction()
    } catch (error) {
      session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }

    // await session.withTransaction(async () => {
    //   await Promise.all([
    //     this.userRepository
    //       .updateOne(
    //         { 'bank_account.account_id': senderAccountId },
    //         { $inc: { 'bank_account.balance': -amount } },
    //       ),
    //     this.userRepository.updateOne(
    //       { 'bank_account.account_id': receiverAccountId },
    //       { $inc: { 'bank_account.balance': amount } },
    //     ),
    //     this.transferRepository.insertOne({
    //       amount,
    //       sender_account_id: senderAccountId,
    //       receiver_account_id: receiverAccountId,
    //     }),
    //   ])
    // })
  }
}
