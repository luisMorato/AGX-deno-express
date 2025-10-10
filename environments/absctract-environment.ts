import express, { Express } from 'express'
import cors from 'cors'
import { errorHandler } from "../error-handler.ts";

export abstract class AbsctractEnvironment {
    protected PORT: number

    constructor(
        port: number
    ) {
        this.PORT = port
    }

    protected initizalizeDefaultMiddlewares(server: Express) {
        server.use(cors({
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            origin: ['*'],
        }))

        server.use(express.json())
    }

    protected listen(server: Express) {
        server.listen(this.PORT, () => {
            console.log(`Servidor rodando na porta: ${this.PORT}`)
        })
    }

    protected setErrorHandler(server: Express) {
        server.use(errorHandler)
    }
}