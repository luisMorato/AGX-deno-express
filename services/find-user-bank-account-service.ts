import { Iuser } from "../models/user/User.ts";

import { UserRepository } from "../models/user/user-respotitory.ts";
import { UserBankAccountNotFoundError } from '../_errors/user-bank-account-not-found-error.ts'

type findUserBankAccountServiceResponse = {
  userBankAccount: Iuser['bank_account']
}

export class FindUserBankAccountService {
  private userRepository: UserRepository
  
  constructor(
    userRepository = new UserRepository()
  ) {
    this.userRepository = userRepository
  }

  async execute(id: string): Promise<findUserBankAccountServiceResponse> {
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

    return {
      userBankAccount: userBankAccount.bank_account
    }
  }
}