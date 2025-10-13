import { UserRepository } from "../models/user/user-respotitory.ts";
import { UserNotFoundError } from "../_errors/user-not-found-error.ts";

export class DeleteUserByIdService {
    private userRepository: UserRepository

    constructor(
        userRepository = new UserRepository()
    ) {
        this.userRepository = userRepository
    }

    async execute(id: string) {
        const existingUserById = await this.userRepository.findById(id)

        if (!existingUserById) throw new UserNotFoundError('Usuário não encontrado')

        await this.userRepository.deleteOne(id)
    }
}