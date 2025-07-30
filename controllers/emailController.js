
import loginModel from '../Models/login.js'
import jwt from 'jsonwebtoken'
import transporter from '../services/emailService.js'

// Function to send password reset email using nodemailer
const sendResetEmail = async (email, token) => {
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
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
}

export const requestPasswordReset = async (req, res) => {
   const { email } = req.body
   try {
     // Validate email format
     if (!email || !email.includes('@')) {
       return res.status(400).json({ message: 'Please provide a valid email address' })
     }

     const results = await loginModel.findOne({ email })
     if (!results) return res.status(404).json({ message: 'User not found with this email address' })
     
     const token = jwt.sign({ id: results._id }, process.env.JWT_RESET_SECRET, { expiresIn: '1h' })
     await sendResetEmail(email, token)
     res.status(200).json({ message: 'Password reset email sent successfully. Please check your inbox.' })
   } catch (err) {
     console.error('Password reset request error:', err)
     if (err.message === 'Failed to send password reset email') {
       res.status(500).json({ message: 'Failed to send reset email. Please try again later.' })
     } else {
       res.status(500).json({ message: 'Server error. Please try again later.' })
     }
   }
}

export const resetPassword = async (req, res) => {
   const { token } = req.params
   const { newPassword } = req.body
   try {
     // Validate new password
     if (!newPassword || newPassword.length < 6) {
       return res.status(400).json({ message: 'Password must be at least 6 characters long' })
     }

     const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET)
     const results = await loginModel.findById(decoded.id)
     if (!results) return res.status(404).json({ message: 'User not found' })
     
     // The password will be automatically hashed by the pre-save middleware in the model
     results.password = newPassword
     await results.save()
     res.status(200).json({ message: 'Password reset successfully. You can now login with your new password.' })
   } catch (err) {
     console.error('Password reset error:', err)
     if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
       res.status(400).json({ message: 'Invalid or expired reset token. Please request a new password reset.' })
     } else {
       res.status(500).json({ message: 'Server error. Please try again later.' })
     }
   }
}





