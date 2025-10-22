import { Request } from 'express'
// import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import { MockNextFunction, MockResponser } from '../../../globals/Stubs.ts'

import { TransferController } from './TransferController.ts'
import { CreateTransferService } from '../../../services/CreateTransferService.ts'

import { UserRepository } from '../../../models/user/UserRepository.ts'
import { UserRepositoryMock } from '../../__mocks__/UserRepositoryMock.ts'

import { TransferRepository } from '../../../models/transfers/TransferRepository.ts'
import { FetchTransfersService } from '../../../services/FetchTransfersService.ts'
import { TransferRepositoryMock } from '../../__mocks__/TransferRepositoryMock.ts'
import { BankAccountResumeService } from '../../../services/BankAccountResumeService.ts'
import { FindTransfersByAccountId } from '../../../services/FindTransfersByAccountId.ts'
import { CreateTransferServiceMock } from '../../__mocks__/CreateTransferServiceMock.ts'
import { defaultAssert, IResponsePayload, ResponseType } from '../../__mocks__/defaultAssert.ts'

let userRepository: UserRepository
let transferRepository: TransferRepository

let transferController: TransferController
let createTransferService: CreateTransferService
let fetchTransfersService: FetchTransfersService
let findTransfersByAccountId: FindTransfersByAccountId
let bankAccountResumeService: BankAccountResumeService

Deno.test.beforeEach(() => {
    userRepository = new UserRepositoryMock() as unknown as UserRepository
    transferRepository = new TransferRepositoryMock() as unknown as TransferRepository

    createTransferService = new CreateTransferServiceMock(
        transferRepository,
        userRepository,
    )
    
    fetchTransfersService = new FetchTransfersService(transferRepository)
    
    findTransfersByAccountId = new FindTransfersByAccountId(transferRepository)
    
    bankAccountResumeService = new BankAccountResumeService(
        transferRepository,
        userRepository,
    )

    transferController = new TransferController({
      createTransferService,
      fetchTransfersService,
      findTransfersByAccountId,
      bankAccountResumeService,
    })
})

// Success
Deno.test('- [TransferController]: it should be able to create a transfer', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    body: {
        senderAccountId: "VV96241",
        receiverAccountId: "RQ48460",
        amount: 200,
        transactionType: "CREDIT",
    },
    user: {
      id: '680946cfbfa13bba4231299j'
    },
  } as unknown as Request

  const result = await transferController.create(
    mockRequest,
    MockResponser,
    MockNextFunction,
  ) as unknown as IResponsePayload

  defaultAssert((result), ResponseType.success, {
    code: 201,
    status: 'CREATED',
    message: 'Transferência realizada com sucesso',
  })
})

// Error
Deno.test(`- [TransferController]: it shouldn't be able to send money from another user's account`, { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    body: {
        senderAccountId: "RQ48460",
        receiverAccountId: "VV96241",
        amount: 200,
        transactionType: "CREDIT",
    },
    user: {
      id: '680946cfbfa13bba4231299j' // Id from user with account VV96241
    },
  } as unknown as Request

  let result = null

  try {
    result = await transferController.create(
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
    message: 'Usuário não pode enviar dinheiro de contas que não sejam a sua',
  })
})

// Error
Deno.test(`- [TransferController]: it shouldn't be able to send money FROM an inexisting account`, { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    body: {
        senderAccountId: "AB12345",  // Inexisting accountId
        receiverAccountId: "VV96241",
        amount: 200,
        transactionType: "CREDIT",
    },
    user: {
      id: '680946cfbfa13bba4231299j'
    },
  } as unknown as Request

  let result = null

  try {
    result = await transferController.create(
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
    message: 'Usuário não possui uma conta do banco',
  })
})

// Error
Deno.test(`- [TransferController]: it shouldn't be able to send money TO an inexisting account`, { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    body: {
        senderAccountId: "VV96241",
        receiverAccountId: "AB12345", // Inexisting accountId
        amount: 200,
        transactionType: "CREDIT",
    },
    user: {
      id: '680946cfbfa13bba4231299j'
    },
  } as unknown as Request

  let result = null

  try {
    result = await transferController.create(
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
    message: 'Conta bancária do beneficiado não encontrada',
  })
})

// Error
Deno.test(`- [TransferController]: it shouldn't be able to send a negative amount to an account`, { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    body: {
        senderAccountId: "VV96241",
        receiverAccountId: "RQ48460",
        amount: -200,
        transactionType: "DEBIT",
    },
    user: {
      id: '680946cfbfa13bba4231299j'
    },
  } as unknown as Request

  let result = null

  try {
    result = await transferController.create(
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
        message: 'A quantidade da transferência deve ser maior que 0'
      }
    ]
  })
})


// Success
Deno.test('- [TransferController]: it should be able to retrieve all transfers', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {} as unknown as Request

  const result = await transferController.list(
    mockRequest,
    MockResponser,
    MockNextFunction,
  ) as unknown as IResponsePayload

  defaultAssert((result), ResponseType.success, {
    code: 200,
    status: 'OK',
    message: '',
    data: {
      transfers: [
        {
          _id: '68efdf6d6118fe67e4fc4722',
          senderAccountId: 'VV96241',
          receiverAccountId: 'GR81590',
          amount: 100,
          transactionType: 'DEBIT',
          createdAt: new Date('2025-10-15T17:52:42.452+00:00'),
        },
        {
          _id: '68efdf766118fe67e4fc4729',
          senderAccountId: 'VV96241',
          receiverAccountId: 'GR81590',
          amount: 200,
          transactionType: 'DEBIT',
          createdAt: new Date('2025-10-15T17:52:42.452+00:00'),
        },
        {
          _id: '68efdf796118fe67e4fc472f',
          senderAccountId: 'VV96241',
          receiverAccountId: 'GR81590',
          amount: 250,
          transactionType: 'CREDIT',
          createdAt: new Date('2025-10-16T17:52:42.452Z'),
        },
      ]
    }
  })
})


// Success
Deno.test(
  '- [TransferController]: it should be able to retrieve all transfers from a specific account',
  { sanitizeOps: false, sanitizeResources: false },
  async () => {
    const mockRequest = {
      params: {
        accountId: 'VV96241',
      }
    } as unknown as Request

    const result = await transferController.findByAccountId(
      mockRequest,
      MockResponser,
      MockNextFunction,
    ) as unknown as IResponsePayload

    defaultAssert((result), ResponseType.success, {
      code: 200,
      status: 'OK',
      message: '',
      data: {
        transfers: [
              {
            _id: "68efdf6d6118fe67e4fc4722",
            senderAccountId: "VV96241",
            receiverAccountId: "GR81590",
            amount: 100,
            transactionType: "DEBIT",
            createdAt: new Date('2025-10-15T17:52:42.452Z')
          },
          {
            _id: "68efdf766118fe67e4fc4729",
            senderAccountId: "VV96241",
            receiverAccountId: "GR81590",
            amount: 200,
            transactionType: "DEBIT",
            createdAt: new Date('2025-10-15T17:52:42.452Z')
          },
          {
            _id: "68efdf796118fe67e4fc472f",
            senderAccountId: "VV96241",
            receiverAccountId: "GR81590",
            amount: 250,
            transactionType: "CREDIT",
            createdAt: new Date('2025-10-16T17:52:42.452Z')
          }
        ]
      }
    })
  }
)

// Error
Deno.test(`- [TransferController]: it shouldn't be able to retrieve an invalid accountId`, { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    params: {
      accountId: 'VV9624'
    }
  } as unknown as Request

  let result = null

  try {
    result = await transferController.findByAccountId(
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
        message: 'O id da conta deve conter 7 caracteres'
      }
    ]
  })
})


//Success
Deno.test(
  '- [TransferController]: it should be able to retrive a specific account spent resume',
  { sanitizeOps: false, sanitizeResources: false },
  async () => {
    const mockRequest = {
      params: {
        accountId: 'VV96241',
      },
      query: {}
    } as unknown as Request

    const result = await transferController.spent(
      mockRequest,
      MockResponser,
      MockNextFunction,
    ) as unknown as IResponsePayload

    defaultAssert((result), ResponseType.success, {
      code: 200,
      status: 'OK',
      message: '',
      data: [
        {
          accountId: "VV96241",
          resume: { totalSpent: 300, transactionsCount: 2, type: "DEBIT" }
        },
        {
          accountId: "VV96241",
          resume: { totalSpent: 250, transactionsCount: 1, type: "CREDIT" }
        }
      ]
    })
  }
)