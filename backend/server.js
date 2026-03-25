import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()
dotenv.config({ path: path.join(path.resolve(), 'backend', '.env') })

connectDB()

// Initialize express app
const app = express()

// Security Middleware to protect the app
app.use(helmet())
app.use(cors()) // Allow cross-origin requests
app.use(mongoSanitize()) // Prevent MongoDB injection attacks

// Show API requests in the console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Allow the app to accept JSON data in the request body
app.use(express.json())

// Route Middlewares: Direct requests to the correct route files
app.use('/api/products', productRoutes) // Routes for grocery items
app.use('/api/users', userRoutes) // Routes for user authentication and profile
app.use('/api/orders', orderRoutes) // Routes for managing orders
app.use('/api/upload', uploadRoutes) // Routes for uploading product images

// Handle file uploads (making the 'uploads' folder public)
const rootDir = path.resolve()
const uploadDir = rootDir.endsWith('backend') 
  ? path.join(rootDir, 'uploads') 
  : path.join(rootDir, 'backend', 'uploads')

app.use('/uploads', express.static(uploadDir))

// Serve the frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  // Simple check to see if API is working
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

// Error Handling Middlewares (always at the bottom)
app.use(notFound) // Handle 404 Not Found errors
app.use(errorHandler) // Handle all other application errors

// Start the server
const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
)
