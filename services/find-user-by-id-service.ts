import { UserRepository } from "../models/user/user-respotitory.ts";
import { UserNotFoundError } from "../_errors/user-not-found-error.ts";

export class FindUserByIdService {
    private userRepository: UserRepository
    
    constructor(
        userRepository = new UserRepository()
    ) {
        this.userRepository = userRepository
    }

    async execute(id: string) {
        const user = await this.userRepository.findById(id)

        if (!user) throw new UserNotFoundError('Usuário não encontrado')

        return user
    }
}