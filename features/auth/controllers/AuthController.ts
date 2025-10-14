import type { NextFunction, Request, Response } from 'express'

import { JWT } from '../../../lib/Jwt.ts'
import { AuthRules } from '../AuthRules.ts'
import { AuthenticateService } from '../../../services/AuthenticateService.ts'

const rules = new AuthRules()

export class AuthController {
  constructor() {}

  async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body

      rules.validate(
        { email, isRequiredField: true },
        { password, isRequiredField: true },
      )

      const authenticateService = new AuthenticateService()

      const { userId } = await authenticateService.execute({
        email,
        password,
      })

      const jwt = new JWT()

      const token = jwt.sign({
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
