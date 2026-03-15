import loginModel from '../Models/login.js'
import jwt from 'jsonwebtoken'
import transporter from '../services/emailService.js'
import { emailRegex } from '../utils/validators.js'

export const postRegister = async (req, res) => {
    try {
        const { name, password } = req.body
        const email = req.body.email?.toLowerCase().trim()

        if (!name || !name.trim() || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' })
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address.' })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' })
        }

        const existing = await loginModel.findOne({ email })
        if (existing) {
            return res.status(409).json({ message: 'Registration failed. Please check your details.' })
        }

        const user = new loginModel({ name: name.trim(), email, password })
        await user.save()

        res.status(201).json({ message: 'Account created successfully.', user: { id: user._id, name: user.name, email: user.email } })

        const mail = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to our Grocery Shopping App',
            text: `Welcome to our shopping app! You have successfully created an account with email: ${email}`
        }
        transporter.sendMail(mail).catch(err => console.error('Welcome email failed:', err))
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Registration failed. Please check your details.' })
        }
        console.error('Registration error:', err)
        res.status(500).json({ message: 'Could not create account. Please try again.' })
    }
}

export const postSignIn = async (req, res) => {
    try {
        const { password } = req.body
        const email = req.body.email?.toLowerCase().trim()

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' })
        }

        const user = await loginModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' })
        }

        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid email or password.' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 60 * 60 * 1000
        })

        res.status(200).json({ message: 'Sign in successful.', user: { id: user._id, name: user.name, email: user.email } })
    } catch (err) {
        console.error('Sign in error:', err)
        res.status(500).json({ message: 'Sign in failed. Please try again.' })
    }
}

export const postLogout = (_req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    })
    res.status(200).json({ message: 'Logged out successfully.' })
}
