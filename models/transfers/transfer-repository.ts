import { Model } from "mongoose"

import { banksDB } from "../../database/db/banks-db.ts"
import { BaseRepository } from "../../base/base-repository.ts"
import { Itranfer, transferSchema } from "./Transfer.ts"

export class TransferRepository extends BaseRepository<Itranfer> {
    constructor(
        model: Model<Itranfer> = banksDB.model<Itranfer>(
            'Transfer',
            transferSchema,
        )
    ) {
        super(model)
    }
}