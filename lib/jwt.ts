import jsonWebToken from "jsonwebtoken";
import { JwtRepository } from './jwt-repository.ts'

export class JWT extends JwtRepository {
  private JWT_SECRET: string

  constructor() {
    super()
    this.JWT_SECRET = Deno.env.get('JWT_SECRET')!
    this.validate()
  }

  validate() {
    if (!this.JWT_SECRET) throw new Error('JWT must be used with a JWT_SECRET')
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