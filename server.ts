import { DevelopmentServer } from "./environments/development-server.ts";

//  ToDo: create docs with swagger

function bootstrap() {
  const developmentServer = new DevelopmentServer()

  developmentServer.run()
}

bootstrap()
