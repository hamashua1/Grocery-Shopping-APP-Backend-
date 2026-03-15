import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})

export const sendResetEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Password Reset Request - Grocery Shopping App',
        html: `
            <p>Reset your password for Grocery Shopping App by clicking this link: <a href="${resetUrl}">Reset Password</a></p>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, ignore this email.</p>
        `,
        text: `
            Password Reset Request

            You have requested to reset your password for your Grocery Shopping App account.

            Click this link to reset your password: ${resetUrl}

            This link will expire in 1 hour.

            If you didn't request this password reset, please ignore this email.

            Grocery Shopping App Team
        `
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log('Password reset email sent successfully to:', email)
    } catch (err) {
        console.error('Error sending password reset email:', err)
        throw new Error('Failed to send password reset email')
    }
}

export default transporter
