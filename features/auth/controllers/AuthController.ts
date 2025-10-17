import type { NextFunction, Request, Response } from 'express'

import { JWT } from '../../../lib/Jwt.ts'
import { AuthRules } from '../AuthRules.ts'
import { AuthenticateService } from '../../../services/AuthenticateService.ts'

const rules = new AuthRules()

export class AuthController {
  private authenticateService: AuthenticateService
  private jwt: JWT

  constructor({
    authenticateService = new AuthenticateService(),
    jwt = new JWT()
  } = {}) {
    this.authenticateService = authenticateService
    this.jwt = jwt
  }

  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body

      rules.validate(
        { email, isRequiredField: true },
        { password, isRequiredField: true },
      )

      const { userId } = await this.authenticateService.execute({
        email,
        password,
      })

      const token = await this.jwt.sign({
        payload: {
          userId,
        },
      })

      return res.cookie('auth-token', token).send_ok('Autenticado com sucesso')
    } catch (error) {
      next(error)
    }
  }
}
