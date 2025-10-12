import express from 'express'

import { userRouter } from "../routes/user-router.ts";
import { authRouter } from "../routes/auth-router.ts";
import { docsRouter } from "../routes/docs-router.ts";

import { AbsctractEnvironment } from "./absctract-environment.ts";
import { transferRouter } from "../routes/transfer-router.ts";
import { accountsRouter } from "../routes/accounts-router.ts";

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