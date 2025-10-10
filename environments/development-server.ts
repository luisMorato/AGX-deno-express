import express from 'express'

import { userRouter } from "../routes/user-router.ts";
import { authRouter } from "../routes/auth-router.ts";
import { docsRouter } from "../routes/docs-router.ts";

import { AbsctractEnvironment } from "./absctract-environment.ts";

export class DevelopmentServer extends AbsctractEnvironment {
    constructor() {
        const port = Number(Deno.env.get('PORT')!)
        super(port)
    }

    run() {
        const server = express()

        this.initizalizeDefaultMiddlewares(server)
        
        server.use(userRouter)
        server.use(authRouter)
        server.use(docsRouter)
        
        this.setErrorHandler(server)
        this.listen(server)
    }
}