import { Request } from 'express'
// import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import { MockNextFunction, MockResponser } from '../../../globals/Stubs.ts'

import { Encrypter } from '../../../lib/Encrypter.ts'
import { UserRepository } from '../../../models/user/UserRepository.ts'
import { UsersController } from './UsersController.ts'
import { CreateUserService } from '../../../services/CreateUserService.ts'
import { UserRepositoryMock } from '../../__mocks__/UserRepositoryMock.ts'
import { EncrypterRepository } from '../../../lib/EncrypterRepository.ts'
import { FindUserByIdService } from '../../../services/FindUserByIdService.ts'
import { UpdateUserByIdService } from '../../../services/UpdateUserByIdService.ts'
import { FetchUsersService } from '../../../services/FetchUsersService.ts'
import { DeleteUserByIdService } from '../../../services/DeleteUserByIdService.ts'
import { defaultAssert, IResponsePayload, ResponseType } from '../../__mocks__/defaultAssert.ts'

class EncrypterMock implements EncrypterRepository {
  async compare(_password: string, _hash: string) {
    return await true
  }

  async encrypt(_password: string) {
    return await 'senha encriptada'
  }
}

let userRepositoryMock: UserRepositoryMock
let usersController: UsersController
let encrypterMock: Encrypter

Deno.test.beforeEach(() => {
  userRepositoryMock = new UserRepositoryMock() 
  encrypterMock = new EncrypterMock() as unknown as Encrypter

  usersController = new UsersController({
    createUserService: new CreateUserService(
      userRepositoryMock as unknown as UserRepository,
      encrypterMock,
    ),
    fetchUsersService: new FetchUsersService(
      userRepositoryMock as unknown as UserRepository,
    ),
    findUserByIdService: new FindUserByIdService(
      userRepositoryMock as unknown as UserRepository,
    ),
     updateUserByIdService: new UpdateUserByIdService(
      userRepositoryMock  as unknown as UserRepository,
      encrypterMock,
    ),
    deleteUserByIdService: new DeleteUserByIdService(
      userRepositoryMock  as unknown as UserRepository,
    )
  })
})

// Success
Deno.test('- [UsersController]: it should be able to create an user', { sanitizeOps: false, sanitizeResources: false }, async () => {
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
  ) as unknown as IResponsePayload

  defaultAssert(result, ResponseType.success, {
    code: 201,
    status: 'CREATED',
    message: 'Usuário inserido com sucesso',
  })
})

// Error
Deno.test(`- [UsersController]: it shouldn't be able to create an user with an existing email`, { sanitizeOps: false, sanitizeResources: false }, async () => {
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
    result = await usersController.create(
      mockRequest,
      MockResponser,
      MockNextFunction,
    ) as any
  } catch (error) {
    result = error
  }

  defaultAssert((result as IResponsePayload), ResponseType.error, {
    code: 409,
    status: 'CONFLICT',
    message: 'Usuário com esse email já cadastrado',
  })
})


//Success
Deno.test('- [UsersController]: it should be able to retrieve all users', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    query: {},
  } as unknown as Request

  const result = await usersController.list(
    mockRequest,
    MockResponser,
    MockNextFunction,
  ) as unknown as IResponsePayload

  defaultAssert(result, ResponseType.success, {
    code: 200,
    status: 'OK',
    message: '',
    data: {
      users: [
        {
          _id: '680946cfbfa13bba4231296b',
          name: 'test',
          email: 'test@test.com',
          password: '$2b$08$7arCba/I3Ac7TfScnNnGDeQG26ux.DLhx/IjJV9S1Fl2FoqZYM9GS',
          birthdate: new Date('2025-10-17T00:53:22.615Z'),
        },
        {
          _id: '680946cfbfa13bba4231299j',
          name: 'test2',
          password: '$2b$08$PNgKc3SFbnf4yky6gu84QuJJS.rgNcLG2rBz7rHeBYBoWe6r4YQWi',
          email: 'test2@test.com',
          birthdate: new Date('2025-10-17T00:53:22.615Z'),
          bankAccount: {
            accountId: 'VV96241',
            balance: 2000,
          }
        },
        {
          _id: "68f18c4a60bda96b0450f3ff",
          bankAccount: {
            accountId: "RQ48460",
            balance: 5000,
          },
          birthdate: new Date('2025-10-17T00:53:22.615Z'),
          email: "test3@test.com",
          name: "test3",
          password: "$2b$08$mlELUBfAe2VPlYK3yOQ8yODfVwTk2O6AR3Oy1n0Abt7aYS9aancr2",
       },
      ]
    }
  })
})

// Error
Deno.test(`- [UsersController]: it shouldn't be able to retrieve users with invalid email`, { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    query: {
      email: 'test!test.co'
    },
  } as unknown as Request

  let result = null

  try {
    result = await usersController.list(
      mockRequest,
      MockResponser,
      MockNextFunction,
    )
  } catch (error) {
    result = error
  }

  defaultAssert((result as IResponsePayload), ResponseType.error, {
    code: 422,
    status: 'BAD_REQUEST',
    message: 'Erro durante a validação',
    errors: [
      {
        message: 'Email inválido'
      },
    ]
  })
})


// Success
Deno.test('- [UsersController]: it should be able to find user by id', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    params: {
      id: '680946cfbfa13bba4231296b'
    },
  } as unknown as Request

  const result = await usersController.findById(
    mockRequest,
    MockResponser,
    MockNextFunction,
  ) as unknown as IResponsePayload

  defaultAssert(result, ResponseType.success, {
    code: 200,
    status: 'OK',
    message: '',
    data: {
      user: {
        _id: '680946cfbfa13bba4231296b',
        name: 'test',
        email: 'test@test.com',
        password: '$2b$08$7arCba/I3Ac7TfScnNnGDeQG26ux.DLhx/IjJV9S1Fl2FoqZYM9GS',
        birthdate: new Date('2025-10-17T00:53:22.615Z'),
      }
    }
  })
})

// Error
Deno.test(`- [UsersController]: it shouldn't be able to find user with inexisting id`, { sanitizeOps: false, sanitizeResources: false }, async () => {
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

  defaultAssert((result as IResponsePayload), ResponseType.error, {
    code: 404,
    status: 'NOT_FOUND',
    message: 'Usuário não encontrado',
  })
})


// Success
Deno.test('- [UsersController]: it should be able to update user by id', { sanitizeOps: false, sanitizeResources: false }, async () => {
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
  ) as unknown as IResponsePayload

  defaultAssert(result, ResponseType.success, {
    code: 200,
    status: 'OK',
    message: 'Usuário atualizado com sucesso',
  })
})

// Error
Deno.test(`- [UsersController]: it shouldn't be able to update a user with existing email`, { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    params: {
      id: '680946cfbfa13bba4231296b' // Id from user test
    },
    user: {
      id: '680946cfbfa13bba4231296b' // Id from user test
    },
    body: {
      name: 'test',
      email: 'test2@test.com', // Email from user test2
      password: '123456',
      birthdate: "2010-03-02T02:20:31.000+00:00"
    }
  } as unknown as Request

  let result = null

  try {
    result = await usersController.updateById(
      mockRequest,
      MockResponser,
      MockNextFunction,
    )
  } catch (error) {
    result = error
  }

  defaultAssert((result as IResponsePayload), ResponseType.error, {
    code: 409,
    status: 'CONFLICT',
    message: 'Usuário com esse email já cadastrado',
  })
})


// Success
Deno.test('- [UsersController]: it should be able to delete user by id', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    params: {
      id: '680946cfbfa13bba4231296b'
    },
    user: {
      id: '680946cfbfa13bba4231296b'
    },
  } as unknown as Request

  const result = await usersController.deleteById(
    mockRequest,
    MockResponser,
    MockNextFunction,
  ) as unknown as IResponsePayload

  defaultAssert(result, ResponseType.success, {
    code: 200,
    status: 'OK',
    message: 'Usuário excluído com sucesso',
  })
})

// Error
Deno.test(`- [UsersController]: it shouldn't be able to delete another user`, { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    params: {
      id: '680946cfbfa13bba4231296b' // Id from user test
    },
    user: {
      id: '680946cfbfa13bba4231299j' // Id from user test2
    },
  } as unknown as Request

  let result = null
  
  try {
    result = await usersController.deleteById(
      mockRequest,
      MockResponser,
      MockNextFunction,
    )
  } catch (error) {
    result = error
  }

  defaultAssert((result as IResponsePayload), ResponseType.error, {
    code: 403,
    status: 'FORBIDDEN',
    message: 'Usuário não pode deletar outro usuário',
  })
})