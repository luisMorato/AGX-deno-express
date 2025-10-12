import { Router } from "express"
import { Swagger } from "../docs/swagger.ts";

const docsRouter = Router()

const swagger = new Swagger({
  title: 'API Documentation',
  version: '1.0.0',
  routerPaths: ['./routes/*.ts'],
})

docsRouter.use('/docs', swagger.setupAndServe())

export { docsRouter }