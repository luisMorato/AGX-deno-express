import { throwlhos } from '../globals/Throwlhos.ts'
import { UserRepository } from '../models/user/UserRepository.ts'

type IdeleteBankAccountByAccountIdRequest = {
  accountId: string
  userId: string
}

export class DeleteBankAccountByAccountId {
  private userRepository: UserRepository

  constructor(
    userRepository = new UserRepository(),
  ) {
    this.userRepository = userRepository
  }

  async execute({ accountId, userId }: IdeleteBankAccountByAccountIdRequest) {
    const [userBankAccount] = await this.userRepository.aggregate([
      { $match: { 'bankAccount.accountId': accountId } },
      {
        $project: {
          bankAccount: true,
        },
      },
    ])

    if (!userBankAccount) throw throwlhos.err_notFound('Conta bancária não encontrada')

    if (String(userBankAccount._id) !== userId) throw throwlhos.err_forbidden('Usuário não pode deletar uma conta que não é sua')

    await this.userRepository.updateOne({
      'bankAccount.accountId': accountId,
    }, {
      $unset: {
        bankAccount: '',
      },
    })
  }
}
