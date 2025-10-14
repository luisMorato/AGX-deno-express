import express, { type Express } from 'express'

import cors from 'cors'
import morgan from 'morgan'
import responser from 'responser'
import { ResponseError } from '../middlewares/ResponseError.ts'

export abstract class AbsctractEnvironment {
  protected PORT: number
  protected hostname: string
  private protocol: string
  private morganFormatString: string

  constructor(
    port: number,
    hostname: string,
  ) {
    this.PORT = port
    this.hostname = hostname
    this.protocol = 'http'
    this.morganFormatString = ':remote-addr :method :url :status :res[content-length] - :response-time ms'
  }

  protected initizalizeDefaultMiddlewares(server: Express) {
    server.use(cors({
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      origin: ['*'],
    }))

    server.use(express.json())
    server.use(responser.default)
    server.use(
      morgan(this.morganFormatString)
    )
  }

  protected listen(server: Express) {
    server.listen(this.PORT, () => {
      console.log(
        `- Servidor rodando na porta: ${this.PORT} \n\n- API Url: ${this.protocol}://${this.hostname}:${this.PORT} \n- Docs Url: ${this.protocol}://${this.hostname}:${this.PORT}/docs`,
      )
    })
  }

  protected setErrorHandler(server: Express) {
    const responseError = new ResponseError({ promptErrors: true })
    server.use(responseError.errorHandler)
  }
}
