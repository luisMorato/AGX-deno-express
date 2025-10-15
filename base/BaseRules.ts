import requestCheck from 'request-check'
import { throwlhos } from '../globals/Throwlhos.ts'
import { IThrowlhos } from 'throwlhos'

export interface ICheckObj {
  [key: string]: any
  isRequiredField?: boolean
}

export class BaseRules {
  protected rc

  constructor() {
    this.rc = requestCheck.default()
  }

  validate = (...args: ICheckObj[]): void => {
    try {
      const arrayOfInvalid = this.rc.check(...args)

      if (arrayOfInvalid?.length) {
        throw throwlhos.err_badRequest('Erro durante a validação', arrayOfInvalid)
      }
    } catch (err: any) {
      console.warn(err)
      throw {
        code: 422,
        message: err.message ?? err,
        status: err.status,
        errors: err.errors,
      } as IThrowlhos
    }
  }
}
