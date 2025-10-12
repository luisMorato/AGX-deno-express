import { DevelopmentServer } from "./environments/development-server.ts";

async function bootstrap() {
  const developmentServer = new DevelopmentServer()

  await developmentServer.run()
}

await bootstrap()
