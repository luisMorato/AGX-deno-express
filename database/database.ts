import mongoose from 'mongoose'
import { throwlhos } from '../globals/Throwlhos.ts'

type IdatabaseConnection = {
  username: string
  hostname: string
  database: string
}

export class Database {
  private username: string
  private password: string
  private hostname: string
  private database: string

  constructor(
    databaseConnection: IdatabaseConnection,
  ) {
    this.username = databaseConnection.username,
      this.hostname = databaseConnection.hostname,
      this.database = databaseConnection.database,
      this.password = Deno.env.get('DATABASE_PASSWORD')!
    this.validate()
  }

  private validate = (): void => {
    if (!this.username) {
      throw throwlhos.err_notFound('[Database] Please provide a database username!')
    }
    if (!this.hostname) {
      throw throwlhos.err_notFound('[Database] Please provide a database hostname!')
    }
    if (!this.database) {
      throw throwlhos.err_notFound('[Database] Please provide a database name!')
    }
    if (!this.password) {
      throw throwlhos.err_notFound('[Database] Please provide a database password!')
    }
  }

  private get connectionString(): string {
    const DATABASE_URL = `mongodb+srv://${this.username}:${this.password}@${this.hostname}/${this.database}`
    return DATABASE_URL
  }

  public connect(): mongoose.Connection {
    try {
      const connection = mongoose.createConnection(this.connectionString)

      return connection
    } catch (error) {
      throw error
    }
  }
}
