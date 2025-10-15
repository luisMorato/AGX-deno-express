import { Model } from 'mongoose'

import { banksDB } from '../../database/db/BanksDB.ts'
import { BaseRepository } from '../../base/BaseRepository.ts'
import { Itranfer, transferSchema } from './Transfer.ts'

class TransferRepository extends BaseRepository<Itranfer> {
  constructor(
    model: Model<Itranfer> = banksDB.model<Itranfer>(
      'Transfer',
      transferSchema,
    ),
  ) {
    super(model)
  }
}

export { TransferRepository }
