import { throwlhos } from '../globals/Throwlhos.ts'

import { Encrypter } from '../lib/Encrypter.ts'
import { UserRepository } from '../models/user/UserRepository.ts'

type IupdateUserRequest = {
  id: string
  name?: string
  email?: string
  password: string
  newPassword?: string
  birthdate?: Date
  tokenUserId: string
}

export class UpdateUserByIdService {
  private userRepository: UserRepository
  private encrypter: Encrypter

  constructor(
    userRepository = new UserRepository(),
    encrypter = new Encrypter(),
  ) {
    this.userRepository = userRepository
    this.encrypter = encrypter
  }

  async execute({
    id,
    name,
    email,
    password,
    newPassword,
    birthdate,
    tokenUserId,
  }: IupdateUserRequest) {
    if (tokenUserId !== id) throw throwlhos.err_forbidden('Usuário não pode editar outro usuário')

    const userToUpdate = await this.userRepository.findById(id)

    if (!userToUpdate) throw throwlhos.err_notFound('Usuário não encontrado')

    const hasPasswordMatch = await this.encrypter.compare(password, userToUpdate.password)

    if (!hasPasswordMatch) throw throwlhos.err_unauthorized('Senha incorreta')

    const existingUserByEmail = await this.userRepository.findOne({ email })

    if (existingUserByEmail && String(existingUserByEmail._id) !== String(userToUpdate._id)) {
      throw throwlhos.err_conflict('Usuário com esse email já cadastrado')
    }

    let hashedPassword = userToUpdate.password

    if (newPassword) {
      hashedPassword = await this.encrypter.encrypt(newPassword)
    }

    await this.userRepository.updateById(id, {
      name,
      email,
      password: hashedPassword,
      birthdate,
    })
  }
}
