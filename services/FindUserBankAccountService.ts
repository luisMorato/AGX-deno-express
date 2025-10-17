import { Iuser } from '../models/user/User.ts'
import { throwlhos } from '../globals/Throwlhos.ts'
import { UserRepository } from '../models/user/UserRepository.ts'

type findUserBankAccountServiceRequest = {
  accountId: string
  userId: string
}

type findUserBankAccountServiceResponse = {
  userBankAccount: Iuser['bankAccount']
}

export class FindUserBankAccountService {
  public userRepository: UserRepository

  constructor(
    userRepository = new UserRepository(),
  ) {
    this.userRepository = userRepository
  }

  async execute({ accountId, userId }: findUserBankAccountServiceRequest): Promise<findUserBankAccountServiceResponse> {
    const [userBankAccount] = await this.userRepository.aggregate([
      { $match: { 'bankAccount.accountId': accountId } },
      {
        $project: {
          bankAccount: true,
        },
      },
    ])

    if (!userBankAccount) throw throwlhos.err_notFound('Conta bancária não encontrada')

    if (String(userBankAccount._id) !== userId) throw throwlhos.err_forbidden('Usuário não pode vizualizar uma conta que não é sua')

    return {
      userBankAccount: userBankAccount.bankAccount,
    }
  }
}
