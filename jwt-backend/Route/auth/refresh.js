import express from 'express'
import crypto from 'crypto'
import client from '../../db/index.js'
import { generateAccessToken, generateRefreshToken, setRefreshCookies } from '../../utils/index.js'

const router = express.Router()


router.post('/refresh', async (req, res) => {
  const raw = req.cookies.refreshToken
  const hashed = crypto.createHash('sha256').update(raw).digest("hex")

  const result = await client.query("select * from refresh_tokens where token = $1 ", [hashed])
  const token = result.rows[0]
  if (!token && new Date(token.expires_at) < new Date()) {
    return res.status(401).json({
      error: "No token found login again"
    })
  }


  if (token.is_used) {
    await client.query("delete from refresh_tokens where family = $1 ", [token.family])
    res.clearCookie("refreshToken", { path: "/api/v1" })
    return res.status(401).json({
      error: "already used up Token"
    })
  }

  const userResponse = await client.query("select * from users where id = $1", [token.user_id])

  const user = userResponse.rows[0];

  if (!user) {
    return res.status(401).json({
      error: "No user found"
    })
  }

  await client.query("update refresh_tokens set is_used = true where id = $1 ", [token.id])

  const accessToken = generateAccessToken(user)
  const refreshToken = await generateRefreshToken(user.id, token.family)

  setRefreshCookies(res, refreshToken)

  return res.status(200).json({
    accessToken
  })
})





export default router
