import {resend} from 'resend'
import dotenv from 'dotenv'
dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)
export const sendResetEmail = async (to,token ) =>{
const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`
try{
    const email = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to,
        subject: 'Reset Your Password',
        html: `  <p>Hello,</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,})
      return email     
}catch(error){
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
}
}


