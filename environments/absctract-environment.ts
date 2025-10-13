import express, { Express } from 'express'
import cors from 'cors'
import { errorHandler } from "../error-handler.ts";

export abstract class AbsctractEnvironment {
    protected PORT: number
    protected hostname: string
    private protocol: string

    constructor(
        port: number,
        hostname: string
    ) {
        this.PORT = port
        this.hostname = hostname
        this.protocol = 'http'
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
            console.log(`- Servidor rodando na porta: ${this.PORT} \n\n- API Url: ${this.protocol}://${this.hostname}:${this.PORT} \n- Docs Url: ${this.protocol}://${this.hostname}:${this.PORT}/docs`)
        })
    }

    protected setErrorHandler(server: Express) {
        server.use(errorHandler)
    }
}