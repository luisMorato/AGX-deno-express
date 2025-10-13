// import mongoose from "mongoose";
import { UserRepository } from "../models/user/user-respotitory.ts";
import { TransferRepository } from "../models/transfers/transfer-repository.ts";
import { UserWithoutFoundsError } from "../_errors/user-without-founds-error.ts";
import { UserBankAccountNotFoundError } from "../_errors/user-bank-account-not-found-error.ts";
import { banksDB } from "../database/db/banks-db.ts";

type IcreateTransferServiceRequest = {
    senderAccountId: string
    receiverAccountId: string
    amount: number
}

export class CreateTransferService {
    private transferRepository: TransferRepository
    private userRepository: UserRepository

    constructor(
        transferRepository = new TransferRepository(),
        userRepository = new UserRepository()
    ) {
        this.transferRepository = transferRepository
        this.userRepository = userRepository
    }

    async execute({
        amount,
        senderAccountId,
        receiverAccountId,
    }: IcreateTransferServiceRequest) {
        const session = await banksDB.startSession()

        const senderAggregatePipeline = [
            { $match: { 'bank_account.account_id': senderAccountId } },
            {
                $project: {
                    _id: false,
                    bank_account: true,
                },
            },
        ]

        const receiverAggregatePipeline = [
            { $match: { 'bank_account.account_id': receiverAccountId } },
            {
                $project: {
                    _id: false,
                    bank_account: true,
                },
            },
        ]

        const [
            [dbSenderBankAccount],
            [dbReceiverBankAccount],
        ] = await Promise.all([
          (this.userRepository.aggregate(senderAggregatePipeline)),
          (this.userRepository.aggregate(receiverAggregatePipeline))
        ])

        if (!dbSenderBankAccount) throw new UserBankAccountNotFoundError('Usuário não possui uma conta do banco')

        if (!dbReceiverBankAccount) throw new UserBankAccountNotFoundError('Conta bancária do beneficiado não encontrada')

        const senderBankAccount = dbSenderBankAccount.bank_account

        if (senderBankAccount.balance < amount) throw new UserWithoutFoundsError('Usuário não possui dinheiro suficiente para essa transação')

        await session.withTransaction(async () => {
            await Promise.all([
                this.userRepository
                    .updateOne(
                        { 'bank_account.account_id': senderAccountId },
                        { $inc: { 'bank_account.balance': -amount } }
                    ),
                this.userRepository.updateOne(
                    { 'bank_account.account_id': receiverAccountId },
                    { $inc: { 'bank_account.balance': amount } },
                ),
                this.transferRepository.insertOne({
                    amount,
                    sender_account_id: senderAccountId,
                    receiver_account_id: receiverAccountId,
                })
            ])
        })
    }
}