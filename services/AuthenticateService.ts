import { Encrypter } from '../lib/Encrypter.ts'
import npmTthrowlhos from 'throwlhos'
import { UserRepository } from '../models/user/UserRepository.ts'

type IauthenticateServiceRequest = {
  email: string
  password: string
}

type IauthenticateServiceResponse = {
  userId: string
}

const throwlhos = npmTthrowlhos.default

export class AuthenticateService {
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
    email,
    password,
  }: IauthenticateServiceRequest): Promise<IauthenticateServiceResponse> {
    const existingUserByEmail = await this.userRepository.findOne({ email })

    if (!existingUserByEmail) throw throwlhos.err_unauthorized('Email Inválido')

    const hasPasswordMatch = await this.encrypter.compare(password, existingUserByEmail.password)

    if (!hasPasswordMatch) throw throwlhos.err_unauthorized('Senha Incorreta')

    return {
      userId: String(existingUserByEmail._id),
    }
  }
}
