import { PipelineStage, FilterQuery, UpdateQuery } from 'mongoose'

export enum ITransactionTypes {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

type ITransfer = {
  _id: string
  senderAccountId: string
  receiverAccountId: string
  amount: number
  transactionType: ITransactionTypes
  createdAt: Date
}

export class TransferRepositoryMock {
  public transfersMockData: ITransfer[] = [
    {
      _id: '68efdf6d6118fe67e4fc4722',
      senderAccountId: 'VV96241',
      receiverAccountId: 'GR81590',
      amount: 100,
      transactionType: ITransactionTypes.DEBIT,
      createdAt: new Date('2025-10-15T17:52:42.452+00:00'),
    },
    {
      _id: '68efdf766118fe67e4fc4729',
      senderAccountId: 'VV96241',
      receiverAccountId: 'GR81590',
      amount: 200,
      transactionType: ITransactionTypes.DEBIT,
      createdAt: new Date('2025-10-15T17:52:42.452+00:00'),
    },
    {
      _id: '68efdf796118fe67e4fc472f',
      senderAccountId: 'VV96241',
      receiverAccountId: 'GR81590',
      amount: 250,
      transactionType: ITransactionTypes.CREDIT,
      createdAt: new Date('2025-10-16T17:52:42.452+00:00'),
    },
  ]
  
  findMany(query: FilterQuery<ITransfer>) {
    let data = this.transfersMockData

    if (query.$or) {
      const accountId = query.$or[0].senderAccountId

      data = data.filter(({ senderAccountId, receiverAccountId }) => [senderAccountId, receiverAccountId].includes(accountId))
    }

    return Promise.resolve(data)
  }

  insertOne(data: ITransfer) {
    return Promise.resolve(this.transfersMockData.push(data))
  }

  updateById(id: string, data: UpdateQuery<ITransfer>) {
    const index = this.transfersMockData.findIndex((user) => user._id === id)
    if (index === -1) return null

    this.transfersMockData[index] = { ...this.transfersMockData[index], ...data }
    return Promise.resolve(this.transfersMockData[index])
  }

  aggregate(_aggregatePipeline: PipelineStage[]) {
    const accountId = (_aggregatePipeline[0] as any)['$match'].senderAccountId
    const createdAt = (_aggregatePipeline[0] as any)['$match'].createdAt

    const from = createdAt ? createdAt.$gte : null
    const to = createdAt ? createdAt.$lte : null

    let transfers = this.transfersMockData.filter(({ senderAccountId }) => senderAccountId === accountId)

    if (from && to) {
      transfers = transfers.filter(({ createdAt }) => createdAt > from && createdAt < to)
    }

    const transfersResume: Record<string, {
      accountId: string,
      resume: {
        type: ITransactionTypes,
        transactionsCount: number,
        totalSpent: number,
      },
    }> = {}

    const group = Object.groupBy(transfers, ({ transactionType }) => transactionType)
    const keys = Object.entries(ITransactionTypes).map(([key]) => key)

    keys.forEach((key) => {
      if (!transfersResume[key]) {
        transfersResume[key] = {
          accountId: '',
          resume: {
            type: ITransactionTypes.DEBIT,
            transactionsCount: 0,
            totalSpent: 0,
          },
        }
      }

      let totalSpent = 0;
      let transactionsCount = 0;

      (group[key as keyof typeof ITransactionTypes] as ITransfer[]).forEach((transfer) => {
        totalSpent += transfer.amount
        transactionsCount += 1

        transfersResume[transfer.transactionType] = {
          accountId: transfer.senderAccountId,
          resume: {
            totalSpent,
            transactionsCount,
            type: transfer.transactionType,
          }
        }
      })
    })

    const transferResumes = keys.map((key) => transfersResume[key])
    
    return Promise.resolve(transferResumes)
  }
}