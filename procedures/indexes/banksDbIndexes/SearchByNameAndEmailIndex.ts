import type { Iuser } from '../../../models/user/User.ts'
import type { IDBIndexes } from '../db-indexes.ts'

import { UserRepository } from '../../../models/user/UserRepository.ts'

export const indexes: IDBIndexes<Iuser> = {
  model: new UserRepository().model,
  indexes: [
    {
      keys: {
        name: 1, // Equidade First
        email: 1, // Equidade First
        birthdate: 1, //  Sort/Range after
      },
    },
  ],
}
