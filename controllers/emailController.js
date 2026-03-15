import loginModel from '../Models/login.js'
import jwt from 'jsonwebtoken'
import { sendResetEmail } from '../services/emailService.js'
import { emailRegex } from '../utils/validators.js'

export const requestPasswordReset = async (req, res) => {
    try {
        const email = req.body.email?.toLowerCase().trim()

        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' })
        }

        const user = await loginModel.findOne({ email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, { expiresIn: '1h' })
            await sendResetEmail(email, token)
        }

        res.status(200).json({ message: 'If this email is registered, a reset link has been sent.' })
    } catch (err) {
        console.error('Password reset request error:', err)
        if (err.message === 'Failed to send password reset email') {
            return res.status(500).json({ message: 'Failed to send reset email. Please try again later.' })
        }
        res.status(500).json({ message: 'Server error. Please try again later.' })
    }
}

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body
    try {
        if (!token) {
            return res.status(400).json({ message: 'Reset token is required.' })
        }
        if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' })
        }

        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET)
        const user = await loginModel.findById(decoded.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        user.password = newPassword
        await user.save()
        res.status(200).json({ message: 'Password reset successfully. You can now login with your new password.' })
    } catch (err) {
        console.error('Password reset error:', err)
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Invalid or expired reset token. Please request a new password reset.' })
        }
        res.status(500).json({ message: 'Server error. Please try again later.' })
    }
}
