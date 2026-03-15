import loginModel from '../Models/login.js'
import jwt from 'jsonwebtoken'
import transporter from '../services/emailService.js'

export const postRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' })
        }
        if (!email.includes('@')) {
            return res.status(400).json({ message: 'Please provide a valid email address.' })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' })
        }

        const existing = await loginModel.findOne({ email })
        if (existing) {
            return res.status(409).json({ message: 'An account with this email already exists.' })
        }

        const user = new loginModel({ name, email, password })
        await user.save()

        const mail = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to our Grocery Shopping App',
            text: `Welcome to our shopping app! You have successfully created an account with email: ${email}`
        }
        await transporter.sendMail(mail)

        res.status(201).json({ message: 'Account created successfully.', user: { id: user._id, name: user.name, email: user.email } })
    } catch (err) {
        console.error('Registration error:', err)
        res.status(500).json({ message: 'Could not create account. Please try again.' })
    }
}

export const postSignIn = async (req, res) => {
    try {
        const { email, password } = req.body

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

export const postLogout = (req, res) => {
    res.clearCookie('token')
    res.status(200).json({ message: 'Logged out successfully.' })
}
