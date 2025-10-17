import { PipelineStage, FilterQuery, UpdateQuery } from 'mongoose'

type Iuser = {
  _id: string
  name: string
  email: string
  password: string
  birthdate: Date
  bankAccount?: {
    accountId: string
    balance: number
  }
}

export class UserRepositoryMock {
  public usersMockData: Array<Iuser> = [
    {
      _id: '680946cfbfa13bba4231296b',
      name: 'test',
      email: 'test@test.com',
      password: '$2b$08$7arCba/I3Ac7TfScnNnGDeQG26ux.DLhx/IjJV9S1Fl2FoqZYM9GS', // Hash for: 12345
      birthdate: new Date('2025-10-17T00:53:22.615Z'),
    },
    {
      _id: '680946cfbfa13bba4231299j',
      name: 'test2',
      password: '$2b$08$PNgKc3SFbnf4yky6gu84QuJJS.rgNcLG2rBz7rHeBYBoWe6r4YQWi', // Hash for: 12345
      email: 'test2@test.com',
      birthdate: new Date('2025-10-17T00:53:22.615Z'),
      bankAccount: {
        accountId: 'VV96241',
        balance: 0,
      }
    },
    {
      _id: '68f18c4a60bda96b0450f3ff',
      name: 'test3',
      password: '$2b$08$mlELUBfAe2VPlYK3yOQ8yODfVwTk2O6AR3Oy1n0Abt7aYS9aancr2', // Hash for: 12345
      email: 'test3@test.com',
      birthdate: new Date('2025-10-17T00:53:22.615Z'),
      bankAccount: {
        accountId: 'RQ48460',
        balance: 0,
      }
    },
  ]

  findMany(query: FilterQuery<Iuser>) {
    const data = this.usersMockData.filter(({ name, email }) => {
      return name.toLowerCase() === query.name || email.toLowerCase() === query.email
    })

    return Promise.resolve(data)
  }

  findOne(query: FilterQuery<Iuser>) {
    const data = this.usersMockData.find(({ email }) => email === query?.email) || null

    return Promise.resolve(data)
  }

  findById(id: string) {
    const data = this.usersMockData.find(({ _id }) => _id === id) || null

    return Promise.resolve(data)
  }

  insertOne(data: Iuser) {
    return Promise.resolve(this.usersMockData.push(data))
  }

  updateById(id: string, data: UpdateQuery<Iuser>) {
    const index = this.usersMockData.findIndex((user) => user._id === id)
    if (index === -1) return null

    this.usersMockData[index] = { ...this.usersMockData[index], ...data }
    return Promise.resolve(this.usersMockData[index])
  }

  updateOne(updateQuery: FilterQuery<Iuser>, data: UpdateQuery<Iuser>) {
    const where = updateQuery['bankAccount.accountId']

    const index = this.usersMockData.findIndex((user) => user.bankAccount?.accountId === where)
    if (index === -1) return null

    if (data.$inc) {
      this.usersMockData[index] = {
        ...this.usersMockData[index], ...{
          bankAccount: {
            accountId: where,
            balance: (this.usersMockData[index].bankAccount?.balance + data['$inc']['bankAccount.balance']) || 0
          }
        }
      }
    }

    if (data.$unset) {
      delete this.usersMockData[index].bankAccount
    }

    this.usersMockData[index] = { ...this.usersMockData[index], ...data }
    return Promise.resolve(this.usersMockData[index])
  }

  deleteOne(id: string) {
    return Promise.resolve(this.usersMockData.filter(({ _id }) => _id !== id))
  }

  aggregate(_aggregatePipeline: PipelineStage[]) {
    const accountId = (_aggregatePipeline[0] as any)['$match']['bankAccount.accountId']

    const existingUserBankAccount = this.usersMockData.find(({ bankAccount }) => {
      return bankAccount?.accountId === accountId
    }) || null

    if (!existingUserBankAccount) return [existingUserBankAccount]

    const projectStage = _aggregatePipeline.find((stage) => '$project' in stage)
    const fieldsToProject = [
      '_id',
      ...Object.entries((projectStage as any)['$project'])
        .filter(([_, value]) => value === true)
        .map(([key]) => key)
    ]

    const filteredUser: Record<string, any> = {}

    if (fieldsToProject.length > 0) {
      fieldsToProject.forEach((field) => {
        if (existingUserBankAccount[field as keyof Iuser] !== undefined) {
          return filteredUser[field] = existingUserBankAccount[field as keyof Iuser]
        }
      })
    }

    return Promise.resolve([filteredUser])
  }
}