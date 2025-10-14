import { BaseSchema } from '../../base/BaseSchema.ts'

export type Itranfer = {
  sender_account_id: string
  receiver_account_id: string
  amount: number
}

class Transfer implements Itranfer {
  sender_account_id: Itranfer['sender_account_id']
  receiver_account_id: Itranfer['receiver_account_id']
  amount: Itranfer['amount']

  constructor(
    transfer: Itranfer,
  ) {
    this.sender_account_id = transfer.sender_account_id
    this.receiver_account_id = transfer.receiver_account_id
    this.amount = transfer.amount
  }
}

class transferSchemaClass extends BaseSchema {
  constructor() {
    super({
      sender_account_id: {
        type: String,
        required: true,
      },
      receiver_account_id: {
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
