import { Model } from 'mongoose'

import { banksDB } from '../../database/db/BanksDB.ts'
import { BaseRepository } from '../../base/BaseRepository.ts'
import { Iuser, userSchema } from './User.ts'

export class UserRepository extends BaseRepository<Iuser> {
  constructor(
    model: Model<Iuser> = banksDB.model<Iuser>(
      'User',
      userSchema,
    ),
  ) {
    super(model)
  }
}
