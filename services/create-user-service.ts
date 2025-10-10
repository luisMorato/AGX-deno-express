import { UserAlreadyExistsError } from "../_errors/user-already-exists-error.ts";
import { Encrypter } from "../lib/encrypter.ts";
import { UserRepository } from "../models/user/user-respotitory.ts";

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
        encrypter = new Encrypter()
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

        if (existingUserByEmail) throw new UserAlreadyExistsError('Usuário com esse email já cadastrado')

        const hashedPassword = await this.encrypter.encrypt(password)

        await this.userRepository.insertOne({
            name,
            email,
            password: hashedPassword,
            birthdate,
        })
    }
}