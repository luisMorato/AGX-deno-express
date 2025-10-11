import { UserBankAccountAlreadyExistsError } from "../_errors/user-bank-account-already-exists-error.ts";
import { UserRepository } from "../models/user/user-respotitory.ts";
import { generateAccountId } from "../utils/generate-account-id.ts";

type IcreateUserBankAccountServiceRequest = {
  userId: string
}

export class CreateUserBankAccountService {
  private userRepository: UserRepository
  
  constructor(
    userRepository = new UserRepository()
  ) {
    this.userRepository = userRepository
  }

  async execute({
    userId,
  }: IcreateUserBankAccountServiceRequest) {
    const accountId = generateAccountId()

    const user = await this.userRepository.findById(userId)

    if (user?.bank_account?.account_id) throw new UserBankAccountAlreadyExistsError('Usuário já possui uma conta')

    await this.userRepository.updateById(userId, {
      bank_account: {
        account_id: accountId,
        balance: 0,
      },
    })
  }
}
