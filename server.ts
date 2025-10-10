import { DevelopmentServer } from "./environments/development-server.ts";

//  ToDo: create accounts for users
//  ToDo: create transfers between users accounts
//  ToDo: create docs with swagger
//  ToDo: Fix error handling to show correct error status code

function bootstrap() {
  const developmentServer = new DevelopmentServer()

  developmentServer.run()
}

bootstrap()
