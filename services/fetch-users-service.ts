import { UserRepository } from "../models/user/user-respotitory.ts";

type IfetchUsersServiceQueryParams = {
    name?: string
    email?: string
}

// type IusersQuery = {
//     name?: {
//         $regex: {
//             name: string
//             $options: 'i'
//         }
//     }
//     email?: string
// }

export class FetchUsersService {
    private userRepository: UserRepository

    constructor(userRepository = new UserRepository()) {
        this.userRepository = userRepository
    }

    async execute({
        name,
        email,
    }: IfetchUsersServiceQueryParams) {
        const usersQuery: IfetchUsersServiceQueryParams = {}

        if (name) usersQuery.name = name

        if (email) usersQuery.email = email

        const users = await this.userRepository.findMany(usersQuery)

        return users || []
    }
}