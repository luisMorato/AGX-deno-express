import { throwlhos } from '../globals/Throwlhos.ts'
import { UserRepository } from '../models/user/UserRepository.ts'

export class FindUserByIdService {
  private userRepository: UserRepository

  constructor(
    userRepository = new UserRepository(),
  ) {
    this.userRepository = userRepository
  }

  async execute(id: string) {
    const user = await this.userRepository.findById(id)

    if (!user) throw throwlhos.err_notFound('Usuário não encontrado')

    return user
  }
}
