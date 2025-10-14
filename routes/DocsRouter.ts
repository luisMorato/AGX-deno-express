import { Router } from 'express'

import { Swagger } from '../docs/Swagger.ts'

const docsRouter = Router()

const swagger = new Swagger({
  title: 'API Documentation',
  version: '1.0.0',
  authSchema: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  routerPaths: ['./routes/*.ts'],
})

docsRouter.use('/docs', swagger.setupAndServe())

export { docsRouter }
