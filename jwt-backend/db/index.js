import "dotenv/config"
import { Client } from "pg";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
}

const client = new Client(config)

const connectDB = () => {
  return client.connect().then(() => {
    console.log("PostgreSQL connected successfully")
    return client
  })
}

export { connectDB }
export default client
