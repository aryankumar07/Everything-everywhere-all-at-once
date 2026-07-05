import 'dotenv/config'
import { Client } from "pg";


const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
}


const client = new Client(config)

export const connectDb = async () => {
  await client.connect()
  console.log("DataBase ready")
  return client
}


export default client
