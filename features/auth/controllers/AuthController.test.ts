import { Request } from 'express'
import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import { MockNextFunction, MockResponser } from '../../../globals/Stubs.ts'

import { JWT } from '../../../lib/Jwt.ts'
import { JwtRepository } from '../../../lib/JwtRepository.ts'
import { AuthController } from './AuthController.ts'
import { UserRepository } from '../../../models/user/UserRepository.ts'
import { UserRepositoryMock } from '../../__mocks__/UserRepositoryMock.ts'
import { AuthenticateService } from '../../../services/AuthenticateService.ts'
import { EncrypterRepository } from '../../../lib/EncrypterRepository.ts'

class EncrypterMock implements EncrypterRepository {
  async compare(_password: string, _hash: string) {
    return await true
  }

  async encrypt(_password: string) {
    return await ''
  }
}

class JWTMock implements JwtRepository {
  private JWT_SECRET: string

  constructor() {
    this.JWT_SECRET = ''
  }

  validate() {}

  verify(_token: string) {}

  sign(_payload: any) { return '' }

  decode<T>(_token: string): T {
    return {} as T
  }
}

Deno.test('- [AuthController]: it should be able to authenticate', async () => {
  const userRepositoryMock = new UserRepositoryMock() as unknown as UserRepository
  const authenticateService = new AuthenticateService({
    userRepository: userRepositoryMock,
    encrypter: new EncrypterMock(),
  })

  const authController = new AuthController({
    authenticateService,
    jwt: new JWTMock() as unknown as JWT
  })

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
  ) as any

  assertEquals(result.code, 200)
  assertEquals(result.message, 'Autenticado com sucesso')
})