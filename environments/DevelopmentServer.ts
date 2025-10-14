import express from 'express'

import { userRouter } from '../routes/UserRouter.ts'
import { authRouter } from '../routes/AuthRouter.ts'
import { docsRouter } from '../routes/DocsRouter.ts'
import { transferRouter } from '../routes/TransferRouter.ts'
import { accountsRouter } from '../routes/AccountsRouter.ts'

import { AbsctractEnvironment } from './AbsctractEnvironment.ts'

export class DevelopmentServer extends AbsctractEnvironment {
  constructor() {
    const port = Number(Deno.env.get('PORT')!)
    const hostname = 'localhost'
    super(port, hostname)
  }

  run() {
    const server = express()

    this.initizalizeDefaultMiddlewares(server)

    server.use(userRouter)
    server.use(authRouter)
    server.use(transferRouter)
    server.use(accountsRouter)

    server.use(docsRouter)

    this.setErrorHandler(server)
    this.listen(server)
  }
}
