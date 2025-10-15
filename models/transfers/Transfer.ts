import { BaseSchema } from '../../base/BaseSchema.ts'

export enum ITransactionTypes {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export type Itranfer = {
  senderAccountId: string
  receiverAccountId: string
  amount: number
  transactionType: ITransactionTypes
}

class Transfer implements Itranfer {
  senderAccountId: Itranfer['senderAccountId']
  receiverAccountId: Itranfer['receiverAccountId']
  amount: Itranfer['amount']
  transactionType: Itranfer['transactionType']

  constructor(
    transfer: Itranfer,
  ) {
    this.senderAccountId = transfer.senderAccountId
    this.receiverAccountId = transfer.receiverAccountId
    this.amount = transfer.amount
    this.transactionType = transfer.transactionType
  }
}

class transferSchemaClass extends BaseSchema {
  constructor() {
    super({
      senderAccountId: {
        type: String,
        required: true,
      },
      receiverAccountId: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      transactionType: {
        type: String,
        enum: Object.values(ITransactionTypes),
        default: 'DEBIT',
        required: true,
        validate: {
          validator: (value) => Object.values(ITransactionTypes).includes(value),
          message: 'Valor inválido para tipo da transação',
        },
      },
    })
  }
}

const transferSchema = new transferSchemaClass().schema

transferSchema.loadClass(Transfer)

export { transferSchema }
