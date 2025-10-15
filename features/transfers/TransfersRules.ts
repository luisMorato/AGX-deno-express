import is from '@zarco/isness'
import { BaseRules } from '../../base/BaseRules.ts'
import { ITransactionTypes } from '../../models/transfers/Transfer.ts'

export class TransfersRules extends BaseRules {
  constructor() {
    super()

    this.rc.addRules('senderAccountId', [
      {
        validator: is.string,
        message: 'O id da conta do beneficiador deve ser uma string',
      },
      {
        validator: (val: any) => val.length === 7,
        message: 'id da conta do beneficiador deve conter 7 caracteres',
      },
    ])

    this.rc.addRules('receiverAccountId', [
      {
        validator: is.string,
        message: 'O id da conta do beneficiado deve ser uma string',
      },
      {
        validator: (val: any) => val.length === 7,
        message: 'id da conta do beneficado deve conter 7 caracteres',
      },
    ])

    this.rc.addRules('amount', [
      {
        validator: is.number,
        message: 'A quantidade deve ser um número',
      },
      {
        validator: (val: any) => val > 0,
        message: 'A quantidade da transferência deve ser maior que 0',
      },
    ])

    this.rc.addRule('transactionType', {
      validator: (value: any) => Object.values(ITransactionTypes).includes(value),
      message: 'Valor inválido para tipo da transação',
    })

    this.rc.addRules('accountId', [
      {
        validator: is.string,
        message: 'O id da conta deve ser uma string',
      },
      {
        validator: (val: any) => val.length === 7,
        message: 'O id da conta deve conter 7 caracteres',
      },
    ])

    this.rc.addRule('from', {
      validator: (val: any) => is.date(new Date(val)),
      message: `A propriedade 'from' deve ser do tipo date`,
    })

    this.rc.addRule('to', {
      validator: (val: any) => is.date(new Date(val)),
      message: `A propriedade 'to' deve ser do tipo date`,
    })
  }
}
