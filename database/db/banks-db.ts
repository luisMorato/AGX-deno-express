import { Database } from "../database.ts";

const databaseConfiguration = {
    username: Deno.env.get('DATABASE_USERNAME')!,
    hostname: Deno.env.get('DATABASE_HOSTNAME')!,
    database: Deno.env.get('DARTABASE_NAME')!,
}

const database = new Database(databaseConfiguration)

const banksDB = database.connect()

export { banksDB }
