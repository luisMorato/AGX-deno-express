import { Iuser } from "../models/user/User.ts";

import { UserRepository } from "../models/user/user-respotitory.ts";
import { UserBankAccountNotFoundError } from '../_errors/user-bank-account-not-found-error.ts'
import { ForbiddenError } from '../_errors/forbidden-error.ts'

type findUserBankAccountServiceRequest = {
  accountId: string
  userId: string
}

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

  async execute({ accountId, userId }: findUserBankAccountServiceRequest): Promise<findUserBankAccountServiceResponse> {
    const [userBankAccount] = await this.userRepository.aggregate([
      { $match: { 'bank_account.account_id': accountId } },
      {
        $project: {
          // _id: false,
          bank_account: true,
        },
      },
    ])

    if (!userBankAccount) throw new UserBankAccountNotFoundError('Conta bancária não encontrada')

    if (String(userBankAccount._id) !== userId) throw new ForbiddenError('Usuário não pode vizualizar uma conta que não é sua')

    return {
      userBankAccount: userBankAccount.bank_account
    }
  }
}