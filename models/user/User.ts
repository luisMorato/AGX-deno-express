import { BaseSchema } from "../../base/base-schema.ts";
import { generateAccountId } from "../../utils/generate-account-id.ts";

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
  bank_account: Iuser['bank_account']

  constructor(user: Iuser) {
    this.name = user.name
    this.email = user.email
    this.password = user.password
    this.birthdate = user.birthdate
    this.bank_account = user.bank_account
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
                    type: Number,
                    default: 0,
                },
            },
        })
    }
}

const userSchema = new UserSchemaClass().schema

userSchema.pre('save', function(next) {
    const accountId = generateAccountId()
    this.bank_account = {
        account_id: accountId,
        balance: Number((this.bank_account as Iuser['bank_account'])?.balance),
    }
    next()
})

//  Permitiria que eu tivesse, por exemplo, métodos e variáveis na classe de usuário, acessíveis pelo meu schema
userSchema.loadClass(User)

export { userSchema }