import { Pool } from "pg"

const isProd = process.env.NODE_ENV === "production"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

// TODO: if the provider publishes a CA bundle, use ssl: { ca: fs.readFileSync(...) }
// rejectUnauthorized: false encrypts the connection but does not verify the server cert
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: isProd ? { rejectUnauthorized: false } : false,
})

// an idle client killed by the db (restart, failover) emits 'error' on the pool.
// without this listener node treats it as unhandled and kills the process.
pool.on("error", (err) => {
  console.error("unexpected error on idle pg client", err)
})

// always pass values as params ($1, $2) - never concatenate them into text
export const query = (text, params) => pool.query(text, params)

// fn receives the checked-out client. every query inside MUST use that client -
// calling the exported query() here would run on a different connection,
// outside the transaction.
export async function withTransaction(fn) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await fn(client)
    await client.query("COMMIT")
    return result
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
}

export const closePool = () => pool.end()
