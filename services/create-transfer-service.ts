import mongoose from "mongoose";
import { TransferRepository } from "../models/transfers/transfer-repository.ts";

type IcreateTransferServiceRequest = {
    senderAccountId: string
    receiverAccountId: string
    amount: number
}

export class CreateTransferService {
    private transferRepository: TransferRepository

    constructor(
        transferRepository = new TransferRepository()
    ) {
        this.transferRepository = transferRepository
    }

    async execute({
        amount,
        senderAccountId,
        receiverAccountId,
    }: IcreateTransferServiceRequest) {
        const session = await mongoose.startSession()

        session.withTransaction(async () => {
            //  ToDo: substracts the amount from the sender's Acount and increments the amount on the receiver's account
            await Promise.all([
                await this.transferRepository.insertOne({
                    amount,
                    sender_account_id: senderAccountId,
                    receiver_account_id: receiverAccountId,
                })
            ])
        })
    }
}