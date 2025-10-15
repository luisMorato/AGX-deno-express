import { BaseSchema } from '../../base/BaseSchema.ts'
import { generateAccountId } from '../../utils/GenerateAccountId.ts'

export type Iuser = {
  name: string
  email: string
  password: string
  birthdate: Date
  bankAccount?: {
    accountId: string
    balance: number
  }
}

export class User implements Iuser {
  name: Iuser['name']
  email: Iuser['email']
  password: Iuser['password']
  birthdate: Iuser['birthdate']
  bankAccount: Iuser['bankAccount']

  constructor(user: Iuser) {
    this.name = user.name
    this.email = user.email
    this.password = user.password
    this.birthdate = user.birthdate
    this.bankAccount = user.bankAccount
  }
}

class UserSchemaClass extends BaseSchema {
  constructor() {
    super(
      {
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
        bankAccount: {
          type: Object,
          required: false,
          accountId: {
            type: String,
            unique: true,
          },
          balance: {
            type: Number,
            default: 0,
            gte: 0,
          },
        },
      }
    )
  }
}

const userSchema = new UserSchemaClass().schema

userSchema.pre('save', function (next) {
  const accountId = generateAccountId()
  this.bankAccount = {
    accountId: accountId,
    balance: Number((this.bankAccount as Iuser['bankAccount'])?.balance) || 0,
  }
  next()
})

//  Permitiria que eu tivesse, por exemplo, métodos e variáveis na classe de usuário, acessíveis pelo meu schema
userSchema.loadClass(User)

export { userSchema }
