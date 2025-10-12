import { DevelopmentServer } from "./environments/development-server.ts";

//  ToDo: create docs with swagger

async function bootstrap() {
  const developmentServer = new DevelopmentServer()

  await developmentServer.run()
}

await bootstrap()
