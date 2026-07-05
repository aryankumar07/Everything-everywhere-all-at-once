import jwt from 'jsonwebtoken'


export const authorization = (req, res, next) => {

  const header = req.headers.authorization

  if (header === undefined || header === null || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "No token headers found"
    })
  }

  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.ACCESS_PSWD)
    req.id = decoded.userId
    next()
  } catch {
    return res.status(401).json({
      error: "Token expired login agian"
    })
  }
}
