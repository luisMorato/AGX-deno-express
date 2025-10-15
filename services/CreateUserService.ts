import { throwlhos } from '../globals/Throwlhos.ts'

import { Encrypter } from '../lib/Encrypter.ts'
import { UserRepository } from '../models/user/UserRepository.ts'

type IcreateUserServiceRequest = {
  name: string
  email: string
  password: string
  birthdate: Date
}

export class CreateUserService {
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
    name,
    email,
    password,
    birthdate,
  }: IcreateUserServiceRequest) {
    const existingUserByEmail = await this.userRepository.findOne({ email })

    if (existingUserByEmail) throw throwlhos.err_conflict('Usuário com esse email já cadastrado')

    const hashedPassword = await this.encrypter.encrypt(password)

    await this.userRepository.insertOne({
      name,
      email,
      password: hashedPassword,
      birthdate,
    })
  }
}
