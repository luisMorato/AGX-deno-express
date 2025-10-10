import { BaseSchema } from "../../base/base-schema.ts";

export type Iuser = {
    name: string
    email: string
    password: string
    birthdate: Date
    bank_account?: {
        account_id: string
        balance: number
    }
}

export class User implements Iuser {
  name: Iuser['name']
  email: Iuser['email']
  password: Iuser['password']
  birthdate: Iuser['birthdate']
  bank_account?: { account_id: string; balance: number; };

  constructor(bank: Iuser) {
    this.name = bank.name
    this.email = bank.email
    this.password = bank.password
    this.birthdate = bank.birthdate
    this.bank_account = bank.bank_account
  }
}

class UserSchemaClass extends BaseSchema {
    constructor() {
        super({
            name: {
                type: String,
                minLength: 1,
                required: true,
                uppercase: true,
            },
            email: {
                type: String,
                minLength: 1,
                maxLength: 64,
                unique: true,
                required: true,
            },
            password: {
                type: String,
                minLength: 5,
                required: true,
            },
            birthdate: {
                type: Date,
                required: true,
                validate: {
                    validator: (birthdate) => new Date(birthdate) < new Date(),
                    message: 'A data de aniversário deve ser menor que a data atual',
                },
            },
            bank_account: {
                account_id: {
                    type: String,
                },
                balance: {
                    type: String,
                    default: 0,
                },
            },
        })
    }
}

const userSchema = new UserSchemaClass().schema
userSchema.loadClass(User)

export { userSchema }