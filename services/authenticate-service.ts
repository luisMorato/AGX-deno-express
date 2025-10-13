import { InvalidCredentialsError } from "../_errors/invalid-credentials-error.ts";
// import { UserNotFoundError } from "../_errors/user-not-found-error.ts";
import { Encrypter } from "../lib/encrypter.ts";
import { UserRepository } from "../models/user/user-respotitory.ts";

type IauthenticateServiceRequest = {
    email: string
    password: string
}

type IauthenticateServiceResponse = {
    userId: string
}

export class AuthenticateService {
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
        email,
        password,
    }: IauthenticateServiceRequest): Promise<IauthenticateServiceResponse> {
        const existingUserByEmail = await this.userRepository.findOne({ email })

        if (!existingUserByEmail) throw new InvalidCredentialsError('Email Inválido')

            
        const hasPasswordMatch = await this.encrypter.compare(password, existingUserByEmail.password)
        console.log(hasPasswordMatch)

        if (!hasPasswordMatch) throw new InvalidCredentialsError('Senha Incorreta')

        return {
            userId: String(existingUserByEmail.id),
        } 
    }
}