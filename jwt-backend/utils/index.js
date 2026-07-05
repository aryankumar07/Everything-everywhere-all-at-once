import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import client from '../db/index.js'



export const generateAccessToken = (user) => {
  return jwt.sign({
    userId: user.id,
    email: user.email
  }, process.env.ACCESS_PSWD, { expiresIn: process.env.ACCESS_EXP })
}


export const generateRefreshToken = async (userId, family) => {
  const raw = crypto.randomBytes(40).toString("hex")
  const hashed = crypto.createHash('sha256').update(raw).digest("hex")

  const expiresAt = new Date(Date.now() + Number(process.env.REFRESH_EXPIRY_MS))

  await client.query("insert into refresh_tokens (user_id , token, family , expires_at ) values ($1 , $2 , $3 , $4)",
    [userId, hashed, family, expiresAt])


  return raw
}


export const setRefreshCookies = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/api/v1",
    maxAge: process.env.REFRESH_EXPIRY_MS,
  })
}
