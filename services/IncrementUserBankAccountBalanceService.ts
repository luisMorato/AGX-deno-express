import { throwlhos } from '../globals/Throwlhos.ts'
import { UserRepository } from '../models/user/UserRepository.ts'

type IncrementUserBankAccountRequest = {
  id: string
  userId: string
  increment: number
}

export class IncrementUserBankAccountBalanceService {
  public userRepository: UserRepository

  constructor(
    userRepository = new UserRepository(),
  ) {
    this.userRepository = userRepository
  }

  async execute({ id, userId, increment }: IncrementUserBankAccountRequest) {
    const [userBankAccount] = await this.userRepository.aggregate([
      { $match: { 'bankAccount.accountId': id } },
      {
        $project: {
          bankAccount: true,
        },
      },
    ])

    if (!userBankAccount) throw throwlhos.err_notFound('Conta bancária não encontrada')

    if (String(userBankAccount._id) !== userId) throw throwlhos.err_forbidden('Usuário não pode incrementar uma conta que não é sua')

    await this.userRepository.updateOne(
      { 'bankAccount.accountId': id },
      { $inc: { 'bankAccount.balance': increment } },
    )
  }
}
