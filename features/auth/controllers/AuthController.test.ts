import { Request } from 'express'
// import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import { MockNextFunction, MockResponser } from '../../../globals/Stubs.ts'

import { JWT } from '../../../lib/Jwt.ts'
import { JwtRepository } from '../../../lib/JwtRepository.ts'
import { AuthController } from './AuthController.ts'
import { UserRepository } from '../../../models/user/UserRepository.ts'
import { UserRepositoryMock } from '../../__mocks__/UserRepositoryMock.ts'
import { AuthenticateService } from '../../../services/AuthenticateService.ts'
import { EncrypterRepository } from '../../../lib/EncrypterRepository.ts'
import { Encrypter } from '../../../lib/Encrypter.ts'
import { defaultAssert, IResponsePayload, ResponseType } from '../../__mocks__/defaultAssert.ts'

class EncrypterMock implements EncrypterRepository {
  async compare(_password: string, _hash: string) {
    return await true
  }

  async encrypt(_password: string) {
    return await 'hashed password'
  }
}

class JWTMock implements JwtRepository {
  private JWT_SECRET: string

  constructor() {
    this.JWT_SECRET = 'my_super_secret_test'
    this.validate()
  }

  validate() {
    // console.log('JWT_SECRET: ', this.JWT_SECRET)
  }

  verify(_token: string) {}

  sign(_payload: any) { return 'payload' }

  decode<T>(_token: string): T {
    return {} as T
  }
}

let userRepositoryMock: UserRepositoryMock
let encrypter: EncrypterMock
let jwtMock: JWTMock
let authenticateService: AuthenticateService
let authController: AuthController

Deno.test.beforeEach(() => {
  userRepositoryMock = new UserRepositoryMock()
  encrypter = new EncrypterMock() as unknown as Encrypter
  jwtMock = new JWTMock()

  authenticateService = new AuthenticateService({
    userRepository: userRepositoryMock as unknown as UserRepository,
    encrypter,
  })

  authController = new AuthController({
    authenticateService,
    jwt: jwtMock as unknown as JWT,
  })
})

Deno.test('- [AuthController]: it should be able to authenticate', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    body: {
      email: 'test@test.com',
      password: '12345',
    },
  } as unknown as Request

  const result = await authController.authenticate(
    mockRequest,
    MockResponser,
    MockNextFunction,
  ) as unknown as IResponsePayload

  defaultAssert(result, ResponseType.success, {
    code: 200,
    status: 'OK',
    message: 'Autenticado com sucesso',
  })
})