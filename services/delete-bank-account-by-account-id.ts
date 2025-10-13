import { UserRepository } from "../models/user/user-respotitory.ts";
import { UserBankAccountNotFoundError } from "../_errors/user-bank-account-not-found-error.ts";
import { ForbiddenError } from '../_errors/forbidden-error.ts'

type IdeleteBankAccountByAccountIdRequest = {
  accountId: string
  userId: string
}

export class DeleteBankAccountByAccountId {
    private userRepository: UserRepository

    constructor(
        userRepository = new UserRepository()
    ) {
        this.userRepository = userRepository
    }

    async execute({ accountId, userId }: IdeleteBankAccountByAccountIdRequest) {
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

        if (String(userBankAccount._id) !== userId) throw new ForbiddenError('Usuário não pode deletar uma conta que não é sua')

        await this.userRepository.updateOne({
            'bank_account.account_id': accountId,
        },
        {
            $unset: {
                bank_account: '',
            }
        }
    )
    }
}
