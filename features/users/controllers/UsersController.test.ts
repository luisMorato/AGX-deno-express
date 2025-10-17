import { Request } from 'express'
import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import { MockNextFunction, MockResponser } from '../../../globals/Stubs.ts'

import { UserRepository } from '../../../models/user/UserRepository.ts'
import { UsersController } from './UsersController.ts'
import { CreateUserService } from '../../../services/CreateUserService.ts'
import { UserRepositoryMock } from '../../__mocks__/UserRepositoryMock.ts'
import { EncrypterRepository } from '../../../lib/EncrypterRepository.ts'
import { FindUserByIdService } from '../../../services/FindUserByIdService.ts'
import { UpdateUserByIdService } from '../../../services/UpdateUserByIdService.ts'

class EncrypterMock implements EncrypterRepository {
  async compare(_password: string, _hash: string) {
    return await true
  }

  async encrypt(_password: string) {
    return await ''
  }
}

// Success
Deno.test('- [UsersController]: it should be able to create an user', async () => {
  const userRepositoryMock = new UserRepositoryMock() as unknown as UserRepository

  const usersController = new UsersController({
    createUserService: new CreateUserService(
      userRepositoryMock,
      new EncrypterMock(),
    ),
  })

  const mockRequest = {
    body: {
      name: "luis",
      email: "luis@test.com",
      password: "12345",
      birthdate: "2001-03-02T02:20:31.000+00:00",
    },
  } as unknown as Request

  const result = await usersController.create(
    mockRequest,
    MockResponser,
    MockNextFunction,
  ) as any

  assertEquals(result.code, 201)
  assertEquals(result.status, 'CREATED')
  assertEquals(result.message, 'Usuário inserido com sucesso')
})

// Error
Deno.test(`- [UsersController]: it shouldn't be able to create an user with an existing email`, async () => {
  const userRepositoryMock = new UserRepositoryMock() as unknown as UserRepository

  const usersController = new UsersController({
    createUserService: new CreateUserService(
      userRepositoryMock,
      new EncrypterMock(),
    ),
  })

  const mockRequest = {
    body: {
      name: "luis",
      email: "test@test.com",
      password: "12345",
      birthdate: "2001-03-02T02:20:31.000+00:00",
    },
  } as unknown as Request

  let result = null

  try {
    result =await usersController.create(
      mockRequest,
      MockResponser,
      MockNextFunction,
    ) as any
  } catch (error) {
    result = error
  }

  assertEquals((result as any).code, 409)
  assertEquals((result as any).status, 'CONFLICT')
  assertEquals((result as any).message, 'Usuário com esse email já cadastrado')
})


// Success
Deno.test('- [UsersController]: it should be able to find user by id', async () => {
  const userRepositoryMock = new UserRepositoryMock() as unknown as UserRepository

  const usersController = new UsersController({
    findUserByIdService: new FindUserByIdService(
      userRepositoryMock,
    ),
  })

  const mockRequest = {
    params: {
      id: '680946cfbfa13bba4231296b'
    },
  } as unknown as Request

  const result = await usersController.findById(
    mockRequest,
    MockResponser,
    MockNextFunction,
  ) as any

  assertEquals(result.code, 200)
  assertEquals(result.data, {
      user: {
        _id: '680946cfbfa13bba4231296b',
        name: 'test',
        email: 'test@test.com',
        password: '$2b$08$7arCba/I3Ac7TfScnNnGDeQG26ux.DLhx/IjJV9S1Fl2FoqZYM9GS',
        birthdate: new Date('2025-10-17T00:53:22.615Z'),
      }
  })
})

// Error
Deno.test(`- [UsersController]: it shouldn't be able to find user with inexisting id`, async () => {
  const userRepositoryMock = new UserRepositoryMock() as unknown as UserRepository

  const usersController = new UsersController({
    findUserByIdService: new FindUserByIdService(
      userRepositoryMock,
    ),
  })

  const mockRequest = {
    params: {
      id: '680946cfbfa13bba42312345'
    },
  } as unknown as Request

  let result = null

  try {
    result = await usersController.findById(
      mockRequest,
      MockResponser,
      MockNextFunction,
    )
  } catch (error) {
    result = error
  }

  assertEquals((result as any).code, 404)
  assertEquals((result as any).message, 'Usuário não encontrado')
})


// Success
Deno.test('- [UsersController]: it should be able to update user by id', async () => {
  const userRepositoryMock = new UserRepositoryMock() as unknown as UserRepository

  const usersController = new UsersController({
    updateUserByIdService: new UpdateUserByIdService(
      userRepositoryMock,
      new EncrypterMock(),
    ),
  })

  const mockRequest = {
    params: {
      id: '680946cfbfa13bba4231296b'
    },
    user: {
      id: '680946cfbfa13bba4231296b'
    },
    body: {
      name: 'test',
      email: 'test@test.com',
      password: '12345',
      birthdate: "2010-03-02T02:20:31.000+00:00"
    }
  } as unknown as Request

  const result = await usersController.updateById(
    mockRequest,
    MockResponser,
    MockNextFunction,
  ) as any

  assertEquals(result.code, 200)
  assertEquals(result.message, 'Usuário atualizado com sucesso')
})