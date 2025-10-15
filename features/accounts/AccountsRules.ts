import is from '@zarco/isness'
import { BaseRules } from '../../base/BaseRules.ts'
import { isValidObjectId } from 'mongoose'

export class AccountsRules extends BaseRules {
  constructor() {
    super()

    this.rc.addRules('userId', [
      {
        validator: (val: any) => isValidObjectId(val),
        message: 'UserId inválido',
      },
      {
        validator: is.string,
        message: 'UserId deve ser do tipo string',
      },
    ])

    this.rc.addRule('id', {
      validator: is.string,
      message: 'ID deve ser do tipo string',
    })

    this.rc.addRules('increment', [
      {
        validator: is.number,
        message: 'O increment deve ser do tipo number',
      },
      {
        validator: (val: any) => val > 0,
        message: 'O increment deve ser maior que 0',
      },
    ])
  }
}
