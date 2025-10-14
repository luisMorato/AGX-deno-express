import { throwlhos } from '../globals/Throwlhos.ts'
import { UserRepository } from '../models/user/UserRepository.ts'

export class DeleteUserByIdService {
  private userRepository: UserRepository

  constructor(
    userRepository = new UserRepository(),
  ) {
    this.userRepository = userRepository
  }

  async execute(id: string) {
    const existingUserById = await this.userRepository.findById(id)

    if (!existingUserById) throw throwlhos.err_notFound('Usuário não encontrado')

    await this.userRepository.deleteOne(id)
  }
}
