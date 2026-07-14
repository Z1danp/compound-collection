import jwt from 'jsonwebtoken'
import 'dotenv/config'

function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decode
    next()
  } catch (err) {
    return res.status(401).json({error: 'Invalid or expired token'})
  }
}

export default authMiddleware