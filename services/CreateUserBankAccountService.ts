import { throwlhos } from '../globals/Throwlhos.ts'
import { UserRepository } from '../models/user/UserRepository.ts'
import { generateAccountId } from '../utils/GenerateAccountId.ts'

type IcreateUserBankAccountServiceRequest = {
  userId: string
}

export class CreateUserBankAccountService {
  private userRepository: UserRepository

  constructor(
    userRepository = new UserRepository(),
  ) {
    this.userRepository = userRepository
  }

  async execute({
    userId,
  }: IcreateUserBankAccountServiceRequest) {
    const accountId = generateAccountId()

    const user = await this.userRepository.findById(userId)

    if (!user) throw throwlhos.err_notFound('Usuário não encontrado')

    if (user?.bankAccount?.accountId) throw throwlhos.err_conflict('Usuário já possui uma conta')

    await this.userRepository.updateById(userId, {
      bankAccount: {
        accountId,
        balance: 0,
      },
    })
  }
}
