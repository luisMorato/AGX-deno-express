import { UserBankAccountNotFoundError } from "../_errors/user-bank-account-not-found-error.ts";
import { UserRepository } from "../models/user/user-respotitory.ts";

type IncrementUserBankAccountRequest = {
  id: string
  increment: number
}

export class IncrementUserBankAccountBalanceService {
  private userRepository: UserRepository 

  constructor(
    userRepository = new UserRepository()
  ) {
    this.userRepository = userRepository
  }

  async execute({ id, increment }: IncrementUserBankAccountRequest) {
    const [userBankAccount] = await this.userRepository.aggregate([
      { $match: { 'bank_account.account_id': id } },
      {
        $project: {
          _id: false,
          bank_account: true,
        },
      },
    ])
    
    if (!userBankAccount) throw new UserBankAccountNotFoundError('Conta bancária não encontrada')

    await this.userRepository.updateOne(
      { 'bank_account.account_id': id },
      { $inc: { 'bank_account.balance': increment } }
    )
  }
}
