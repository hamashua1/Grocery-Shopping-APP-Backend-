import crypto from 'crypto'
import loginModel from '../Models/login.js'
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
            const rawToken = crypto.randomBytes(32).toString('hex')
            const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

            user.passwordResetToken = hashedToken
            user.passwordResetExpires = Date.now() + 60 * 60 * 1000 // 1 hour
            await user.save()

            await sendResetEmail(email, rawToken)
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

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
        const user = await loginModel.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token. Please request a new password reset.' })
        }

        user.password = newPassword
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()

        res.status(200).json({ message: 'Password reset successfully. You can now login with your new password.' })
    } catch (err) {
        console.error('Password reset error:', err)
        res.status(500).json({ message: 'Server error. Please try again later.' })
    }
}
