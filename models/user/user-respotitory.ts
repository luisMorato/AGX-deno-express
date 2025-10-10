import { Model } from "mongoose";

import { userDB } from "../../database/db/userDB.ts";
import { Iuser, userSchema } from "./User.ts";
import { BaseRepository } from "../../base/base-repository.ts";

export class UserRepository extends BaseRepository<Iuser> {
    constructor(
        model: Model<Iuser> = userDB.model<Iuser>(
            'User',
            userSchema
        )
    ) {
        super(model)
    }
}