import express from 'express'
import { pool, query, closePool } from './db/index.js'

const PORT = process.env.PORT || 8000

const app = express()

app.use(express.json())

app.get('/', (_, res) => { res.send("Hello World") })

app.get('/health', async (_, res) => {
  try {
    await query("select 1")
    res.json({ db: "ok" })
  } catch (err) {
    console.error("health check failed", err)
    res.status(503).json({ db: "down" })
  }
})

// fail at boot rather than serving 500s
try {
  await pool.query("select 1")
  console.log("connected to postgres")
} catch (err) {
  console.error("could not connect to postgres", err)
  process.exit(1)
}

const server = app.listen(PORT, () => {
  console.log(`server running on ${PORT}`)
})

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down`)
  server.close(async () => {
    await closePool()
    process.exit(0)
  })
}

process.on("SIGINT", () => shutdown("SIGINT"))
process.on("SIGTERM", () => shutdown("SIGTERM"))
