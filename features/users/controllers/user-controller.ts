import type { Request, Response, NextFunction } from 'express'

import { z } from 'zod'
import { isValidObjectId } from "mongoose";
import { FetchUsersService } from "../../../services/fetch-users-service.ts";
import { CreateUserService } from "../../../services/create-user-service.ts";
import { FindUserByIdService } from "../../../services/find-user-by-id-service.ts";
import { UpdateUserByIdService } from "../../../services/update-user-by-id-service.ts";
import { DeleteUserByIdService } from "../../../services/delete-user-by-id-service.ts";

const createUserBodySchema = z.object({
    name: z.string().min(1, {
        error: 'Nome é obrigatório',
    }),
    email: z.email({
        error: 'Email inválido'
    }).min(1, {
        error: 'O email é obrigatório',
    }),
    password: z.string().min(5, {
        error: 'A senha deve conter no mínimo 5 caracteres'
    }),
    birthdate: z.coerce.date(),
})

const listUsersQuerySchema = z.object({
    name: z.string().optional(),
    email: z.email().optional(),
})

const findUserByIdParamsSchema = z.object({
    id: z.string().refine((userId) => isValidObjectId(userId))
})

const updateUserBodySchema = z.object({
    name: z.string().optional(),
    email: z.email({
        error: 'Email inválido'
    }).optional(),
    password: z.string().min(5, {
        error: 'A senha deve conter no mínimo 5 caracteres'
    }),
    birthdate: z.coerce.date().optional(),
})

export class UserController {
    // private createUserService: CreateUserService
    // private fetchUsersService: FetchUsersService

    constructor(
        // private findUserByIdService = new FindUserByIdService()
    ) {}

    async create(req: Request, res: Response) {
        try {
            const {
                name,
                email,
                password,
                birthdate,
            } = createUserBodySchema.parse(req.body)

            const createUserService = new CreateUserService()

            await createUserService.execute({
                name,
                email,
                password,
                birthdate,
            })

            res.status(201).json('Usuário inserido com sucesso')
        } catch (error) {
            throw error
        }
    }

    async list(req: Request, res: Response) {
        try {
            const { name, email } = listUsersQuerySchema.parse(req.query)

            const fetchUsersService = new FetchUsersService()
            const users = await fetchUsersService.execute({ name, email })

            return res.status(200).json({ users })
        } catch (error) {
            throw error
        }
    }

    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = findUserByIdParamsSchema.parse(req.params)

            const findUserByIdService = new FindUserByIdService()
            const user = await findUserByIdService.execute(id)

            return res.status(200).json({ user })
        } catch (error) {
            next(error)
        }
    }

    async updateById(req: Request, res: Response) {
        try {
            const { id } = findUserByIdParamsSchema.parse(req.params)

            const {
                name,
                email,
                password,
                birthdate,
            } = updateUserBodySchema.parse(req.body)

            const updateUserByIdService = new UpdateUserByIdService()
            
            await updateUserByIdService.execute({
                id,
                name,
                email,
                password,
                birthdate,
            })

            return res.status(200).json('Usuário atualizado com sucesso')
        } catch (error) {
            throw error
        }
    }

    async deleteById(req: Request, res: Response) {
        try {
            const { id } = findUserByIdParamsSchema.parse(req.params)

            const deleteUserByIdService = new DeleteUserByIdService()

            await deleteUserByIdService.execute(id)

            return res.status(200).json('Usuário excluído com sucesso')
        } catch (error) {
            throw error
        }
    }
}