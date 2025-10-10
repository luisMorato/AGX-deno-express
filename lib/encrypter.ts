import { hash, compare,  } from 'bcryptjs'
import { EncrypterRepository } from "./encrypter-repository.ts";

export class Encrypter implements EncrypterRepository {
    async encrypt(password: string) {
        return await hash(password, 8)
    }

    async compare(password: string, hash: string) {
        return await compare(password, hash)
    }
}