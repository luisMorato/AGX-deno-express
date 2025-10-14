import { DevelopmentServer } from './environments/DevelopmentServer.ts'

async function bootstrap() {
  const developmentServer = new DevelopmentServer()

  await developmentServer.run()
}

await bootstrap()
