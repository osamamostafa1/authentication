const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')

const app = express()

/////////////////////////////////////////// security
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const hpp = require('hpp')
const rateLimit = require('express-rate-limit')
const cors = require('cors')


// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Privent XSS attacks
app.use(xss())

// Prevent http param pollution
app.use(hpp())

// Rate limiting request
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10mins
    max: 1000
})
app.use(limiter)

// Enable CORS
app.use(cors())

///////////////////////////////////////////security

// Body parser
app.use(express.json())

// Load env vars & database
dotenv.config({ path: './config/config.env' })
const connectDb = require('./config/db')

// path router
const authRouter = require('./routes/auth.routes')
const userRouter = require('./routes/user.routes')

// path middleware
const errorHandler = require('./middleware/error')

// connect Database
connectDb()

// Routers
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)

// Error middleware It is must be come after Router
app.use(errorHandler)

//Port
const PORT = process.env.PORT || 5000

// npm start or npm run dev
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))