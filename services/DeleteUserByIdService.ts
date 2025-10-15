import { throwlhos } from '../globals/Throwlhos.ts'
import { UserRepository } from '../models/user/UserRepository.ts'

type IdeleteUserByIdServiceRequest = {
  id: string
  tokenUserId: string
}

export class DeleteUserByIdService {
  private userRepository: UserRepository

  constructor(
    userRepository = new UserRepository(),
  ) {
    this.userRepository = userRepository
  }

  async execute({ id, tokenUserId }: IdeleteUserByIdServiceRequest) {
    if (tokenUserId !== id) throw throwlhos.err_forbidden('Usuário não pode deletar outro usuário')

    const existingUserById = await this.userRepository.findById(id)

    if (!existingUserById) throw throwlhos.err_notFound('Usuário não encontrado')

    await this.userRepository.deleteOne(id)
  }
}
