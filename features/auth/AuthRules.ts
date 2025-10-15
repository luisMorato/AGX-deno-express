import is from '@zarco/isness'
import { BaseRules } from '../../base/BaseRules.ts'

export class AuthRules extends BaseRules {
  constructor() {
    super()

    this.rc.addRules('email', [
      {
        validator: is.string,
        message: 'Email deve ser uma string',
      },
      {
        validator: is.email,
        message: 'Email inválido',
      },
    ])

    this.rc.addRule('password', {
      validator: is.string,
      message: 'Senha deve ser uma string',
    })
  }
}
