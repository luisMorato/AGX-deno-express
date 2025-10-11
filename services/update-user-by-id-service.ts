import { InvalidCredentialsError } from "../_errors/invalid-credentials-error.ts";
import { UserAlreadyExistsError } from "../_errors/user-already-exists-error.ts";
import { UserNotFoundError } from "../_errors/user-not-found-error.ts";
import { Encrypter } from "../lib/encrypter.ts";
import { UserRepository } from "../models/user/user-respotitory.ts";

type IupdateUserRequest = {
    id: string
    name?: string
    email?: string
    password: string
    birthdate?: Date
}

export class UpdateUserByIdService {
    private userRepository: UserRepository
    private encrypter: Encrypter

    constructor(
        userRepository = new UserRepository(),
        encrypter = new Encrypter()
    ) {
        this.userRepository = userRepository
        this.encrypter = encrypter
    }

    async execute({
        id,
        name,
        email,
        password,
        birthdate,
    }: IupdateUserRequest) {
        const userToUpdate = await this.userRepository.findById(id)

        if (!userToUpdate) throw new UserNotFoundError('Usuário não encontrado')

        const hasPasswordMatch = this.encrypter.compare(password, userToUpdate.password)

        if (!hasPasswordMatch) throw new InvalidCredentialsError('Senha incorreta')

        const existingUserByEmail = await this.userRepository.findOne({ email })

        if (existingUserByEmail?.email !== userToUpdate.email) throw new UserAlreadyExistsError('Usuário com esse email já cadastrado')

        const hashedPassword = this.encrypter.encrypt(password)

        await this.userRepository.updateById(id, {
            name,
            email,
            password: hashedPassword,
            birthdate,
        })
    }
}