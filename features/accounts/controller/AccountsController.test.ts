import { Request } from 'express'
// import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import { MockNextFunction, MockResponser } from '../../../globals/Stubs.ts'

import { UserRepository } from '../../../models/user/UserRepository.ts'
import { AccountsController } from './AccountsController.ts'
import { UserRepositoryMock } from '../../__mocks__/UserRepositoryMock.ts'
import { FindUserBankAccountService } from '../../../services/FindUserBankAccountService.ts'
import { CreateUserBankAccountService } from '../../../services/CreateUserBankAccountService.ts'
import { DeleteBankAccountByAccountId } from '../../../services/DeleteBankAccountByAccountId.ts'
import { IncrementUserBankAccountBalanceService } from '../../../services/IncrementUserBankAccountBalanceService.ts'
import { defaultAssert, IResponsePayload, ResponseType } from '../../__mocks__/defaultAssert.ts'

let userRepository: UserRepositoryMock
let accountsController: AccountsController
let createUserBankAccountService: CreateUserBankAccountService
let findUserBankAccountService: FindUserBankAccountService
let incrementUserBankAccountBalanceService: IncrementUserBankAccountBalanceService
let deleteBankAccountByAccountId: DeleteBankAccountByAccountId

Deno.test.beforeEach(() => {
  userRepository = new UserRepositoryMock()

  createUserBankAccountService = new CreateUserBankAccountService(
    userRepository as unknown as UserRepository
  )

  findUserBankAccountService = new FindUserBankAccountService(
      userRepository as unknown as UserRepository
  )

  incrementUserBankAccountBalanceService = new IncrementUserBankAccountBalanceService(
    userRepository as unknown as UserRepository
  )

  deleteBankAccountByAccountId = new DeleteBankAccountByAccountId(
    userRepository as unknown as UserRepository
  )

  accountsController = new AccountsController({
    createUserBankAccountService,
    findUserBankAccountService,
    incrementUserBankAccountBalanceService,
    deleteBankAccountByAccountId,
  })
})

//  Success
Deno.test('- [AccountsController]: it should be able to create a bank account', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    body: {
      userId: '680946cfbfa13bba4231296b'
    },
  } as Request

  const result = await accountsController.create(
    mockRequest,
    MockResponser,
    MockNextFunction,
  ) as unknown as IResponsePayload

  defaultAssert(result, ResponseType.success, {
    code: 201,
    status: 'CREATED',
    message: 'Conta criada com sucesso'
  })
})

// Error
Deno.test(`- [AccountsController]: it shouldn't be able to create a bank account with a inexisting user`, { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    body: {
      userId: '680946cfbfa13bba42312789'
    },
  } as Request

  let result = null

  try {
    result = await accountsController.create(
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
    message: 'Usuário não encontrado'
  })
})


// Success
Deno.test('- [AccountsController]: it should be able to retrive a bank account', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    params: {
      id: 'VV96241'
    },
    user: {
      id: '680946cfbfa13bba4231299j'
    }
  } as unknown as Request

  const result = await accountsController.find(
    mockRequest,
    MockResponser,
    MockNextFunction,
  ) as unknown as IResponsePayload

  defaultAssert(result, ResponseType.success, {
    code: 200,
    status: 'OK',
    message: '',
    data: {
      userBankAccount: {
        accountId: "VV96241",
        balance: 2000,
      }
    }
  })
})

// Error
Deno.test(`- [AccountsController]: it shouldn't be able to retrive a inexistent bank account`, { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    params: {
      id: 'VV12345'
    },
    user: {
      id: '680946cfbfa13bba4231299j'
    }
  } as unknown as Request

  let result = null

  try {
    result = await accountsController.find(
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
    message: 'Conta bancária não encontrada'
  })
})


// Success
Deno.test('- [AccountsController]: it should be able to increment a bank account', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    body: {
      increment: 100
    },
    params: {
      id: 'VV96241'
    },
    user: {
      id: '680946cfbfa13bba4231299j'
    }
  } as unknown as Request

  const result = await accountsController.increment(
    mockRequest,
    MockResponser,
    MockNextFunction,
  ) as unknown as IResponsePayload

  defaultAssert(result, ResponseType.success, {
    code: 200,
    status: 'OK',
    message: `R$${mockRequest.body.increment} adicionado a conta: ${mockRequest.params.id}`
  })
})

// Error
Deno.test(`- [AccountsController]: it shouldn't be able to increment a bank account with negative number`, { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    body: {
      increment: -100
    },
    params: {
      id: 'VV96241'
    },
    user: {
      id: '680946cfbfa13bba4231299j'
    }
  } as unknown as Request

  let result = null

  try {
    result = await accountsController.increment(
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
        message: 'O increment deve ser maior que 0'
      },
    ]
  })
})


// Success
Deno.test('- [AccountsController]: it should be able to delete a bank account', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    params: {
      id: 'VV96241'
    },
    user: {
      id: '680946cfbfa13bba4231299j'
    }
  } as unknown as Request

  const result = await accountsController.delete(
    mockRequest,
    MockResponser,
    MockNextFunction,
  ) as unknown as IResponsePayload

  defaultAssert(result, ResponseType.success, {
    code: 200,
    status: 'OK',
    message: 'Conta excluída com sucesso',
  })
})

// Error
Deno.test(`- [AccountsController]: it shouldn't be able to delete a bank account from another user`, { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    params: {
      id: 'VV96241' // AccountId from user: test2
    },
    user: {
      id: '68f18c4a60bda96b0450f3ff' // Id from user: test3
    }
  } as unknown as Request

  let result = null

  try {
    result = await accountsController.delete(
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
    message: 'Usuário não pode deletar uma conta que não é sua',
  })
})