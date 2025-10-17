import jsonWebToken from 'jsonwebtoken'
import npmTthrowlhos from 'throwlhos'
import { JwtRepository } from './JwtRepository.ts'

export class JWT implements JwtRepository {
  private JWT_SECRET: string

  constructor() {
    this.JWT_SECRET = Deno.env.get('JWT_SECRET')!
    this.validate()
  }

  validate() {
    const throwlhos = npmTthrowlhos.default

    if (!this.JWT_SECRET) throw throwlhos.err_notFound('JWT deve ser utilizado com o JWT_SECRET')
  }

  sign(payload: any) {
    const token = jsonWebToken.sign(payload, this.JWT_SECRET)

    return token
  }

  verify(token: string) {
    jsonWebToken.verify(token, this.JWT_SECRET)
  }

  decode<T>(token: string) {
    this.verify(token)
    const payload = jsonWebToken.decode(token) as T

    return payload
  }
}
