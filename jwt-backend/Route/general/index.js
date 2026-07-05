import express from 'express'
import { authorization } from '../../middleware/authorization.js'
import client from '../../db/index.js'

const router = new express.Router()


router.get('/user-detail', authorization, async (req, res) => {
  const userId = req.id

  const response = await client.query("select id, name , email from users where id = $1", [userId])

  if (response.rows.length <= 0) {
    res.status(400).json({
      error: "no user found"
    })
  }

  return res.status(200).json({
    user: response.rows[0]
  })
})




export default router
