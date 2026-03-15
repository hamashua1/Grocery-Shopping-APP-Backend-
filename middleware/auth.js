import jwt from 'jsonwebtoken'

const authenticate = (req, res, next) => {
    const token = req.cookies?.token
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Please log in.' })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired session. Please log in again.' })
    }
}

export default authenticate
