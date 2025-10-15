import is from '@zarco/isness'
import { BaseRules } from '../../base/BaseRules.ts'

export class UsersRules extends BaseRules {
  constructor() {
    super()

    this.rc.addRule('name', {
      validator: is.string,
      message: 'O nome deve ser uma string',
    })

    this.rc.addRules('email', [
      {
        validator: is.string,
        message: 'Email deve ser uma string',
      },
      {
        validator: is.email,
        message: 'Email inválido',
      },
      {
        validator: (val: any) => val.length <= 64,
        message: 'Email deve conter menos que 64 caracteres',
      },
    ])

    this.rc.addRule('password', {
      validator: is.string,
      message: 'A senha deve ser uma string',
    })

    this.rc.addRules('birthdate', [
      {
        validator: is.date,
        message: 'A data de aniversário deve ser do tipo Date',
      },
      {
        validator: (val: any) => val < new Date(),
        message: 'A data de aniversário deve ser menor que a data atual',
      },
    ])

    this.rc.addRule('id', {
      validator: is.objectId,
      message: 'Id do usuário inválido',
    })

    this.rc.addRule('newPassword', {
      validator: is.string,
      message: 'A nova senha deve ser uma string',
    })
  }
}
