export abstract class EncrypterRepository {
    abstract encrypt(password: string): Promise<string>
    abstract compare(password: string, hash: string): Promise<boolean>
}