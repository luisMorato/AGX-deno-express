import type { NextFunction, Request, Response } from 'express'

import { UsersRules } from '../UsersRules.ts'
import { FetchUsersService } from '../../../services/FetchUsersService.ts'
import { CreateUserService } from '../../../services/CreateUserService.ts'
import { FindUserByIdService } from '../../../services/FindUserByIdService.ts'
import { UpdateUserByIdService } from '../../../services/UpdateUserByIdService.ts'
import { DeleteUserByIdService } from '../../../services/DeleteUserByIdService.ts'

const rules = new UsersRules()

export class UsersController {
  private createUserService: CreateUserService
  private fetchUsersService: FetchUsersService
  private findUserByIdService: FindUserByIdService
  private updateUserByIdService: UpdateUserByIdService
  private deleteUserByIdService: DeleteUserByIdService

  constructor({
    createUserService = new CreateUserService(),
    fetchUsersService = new FetchUsersService(),
    findUserByIdService = new FindUserByIdService(),
    updateUserByIdService = new UpdateUserByIdService(),
    deleteUserByIdService = new DeleteUserByIdService(),
  } = {}) {
    this.createUserService = createUserService
    this.fetchUsersService = fetchUsersService
    this.findUserByIdService = findUserByIdService
    this.updateUserByIdService = updateUserByIdService
    this.deleteUserByIdService = deleteUserByIdService
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        email,
        password,
        birthdate,
      } = req.body

      rules.validate(
        { name, isRequiredField: true },
        { email, isRequiredField: true },
        { password, isRequiredField: true },
        { birthdate: new Date(birthdate), isRequiredField: true },
      )

      await this.createUserService.execute({
        name,
        email,
        password,
        birthdate,
      })

      return res.send_created('Usuário inserido com sucesso')
    } catch (error) {
      next(error)
    }
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.query as { email?: string; name?: string }

      rules.validate(
        { name, isRequiredField: false },
        { email, isRequiredField: false },
      )

      const users = await this.fetchUsersService.execute({ name, email })

      return res.send_ok('', { users })
    } catch (error) {
      next(error)
    }
  }

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      rules.validate(
        { id, isRequiredField: true },
      )

      const user = await this.findUserByIdService.execute(id)

      return res.send_ok('', { user })
    } catch (error) {
      next(error)
    }
  }

  updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      const {
        name,
        email,
        password,
        newPassword,
        birthdate,
      } = req.body

      rules.validate(
        { id, isRequiredField: true },
        { name, isRequiredField: true },
        { email, isRequiredField: true },
        { password, isRequiredField: true },
        { newPassword, isRequiredField: false },
        { birthdate: new Date(birthdate), isRequiredField: true },
      )

      const userId = req.user?.id

      if (!userId) return res.err_unauthorized('Usuário não autenticado')

      await this.updateUserByIdService.execute({
        id,
        name,
        email,
        password,
        newPassword,
        birthdate,
        tokenUserId: userId,
      })

      return res.send_ok('Usuário atualizado com sucesso')
    } catch (error) {
      next(error)
    }
  }

  deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      rules.validate(
        { id, isRequiredField: true },
      )

      const userId = req.user?.id

      if (!userId) return res.err_unauthorized('Usuário não autenticado')

      await this.deleteUserByIdService.execute({ id, tokenUserId: userId })

      return res.send_ok('Usuário excluído com sucesso')
    } catch (error) {
      next(error)
    }
  }
}
