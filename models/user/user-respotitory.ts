import { Model } from "mongoose"

import { banksDB } from "../../database/db/banks-db.ts"
import { BaseRepository } from "../../base/base-repository.ts"
import { Iuser, userSchema } from "./User.ts"

export class UserRepository extends BaseRepository<Iuser> {
    constructor(
        model: Model<Iuser> = banksDB.model<Iuser>(
            'User',
            userSchema
        )
    ) {
        super(model)
    }
}