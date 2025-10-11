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

        const aggregatePipeline = [
            { $match: { 'bank_account.account_id': senderAccountId } },
            {
                $project: {
                    _id: false,
                    bank_account: true,
                },
            },
        ]

        const [{
            bank_account: senderBankAccount,
        }] = await this.userRepository.aggregate(aggregatePipeline)

        if (!senderBankAccount.account_id) throw new UserBankAccountNotFoundError('Usuário não possui uma conta do banco')

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