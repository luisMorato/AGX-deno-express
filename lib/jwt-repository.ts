export abstract class JwtRepository {
  abstract sign(payload: any): string
  abstract verify(token: string): void
  abstract decode<T>(token: string): T
}