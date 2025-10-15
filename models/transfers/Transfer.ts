import { BaseSchema } from '../../base/BaseSchema.ts'

export type Itranfer = {
  senderAccountId: string
  receiverAccountId: string
  amount: number
}

class Transfer implements Itranfer {
  senderAccountId: Itranfer['senderAccountId']
  receiverAccountId: Itranfer['receiverAccountId']
  amount: Itranfer['amount']

  constructor(
    transfer: Itranfer,
  ) {
    this.senderAccountId = transfer.senderAccountId
    this.receiverAccountId = transfer.receiverAccountId
    this.amount = transfer.amount
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
    })
  }
}

const transferSchema = new transferSchemaClass().schema
transferSchema.loadClass(Transfer)

export { transferSchema }
