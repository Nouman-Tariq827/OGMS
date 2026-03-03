import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import crypto from 'crypto'

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body

  // 1. Find the user in the database by their email
  const user = await User.findOne({ email })

  // 2. If user exists and password matches (using the model's matchPassword method)
  if (user && (await user.matchPassword(password))) {
    // 3. Send back user details including a secure login token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      cnic: user.cnic,
      phoneNumber: user.phoneNumber,
      address: user.address,
      town: user.town,
      region: user.region,
      postcode: user.postcode,
      country: user.country,
      isAdmin: user.isAdmin,
      token: generateToken(user._id), // Create a JWT token for authentication
    })
  } else {
    // 4. If credentials don't match, send an error
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Register a new user (Signup)
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // Extract all registration data from the request body
  const {
    name,
    email,
    password,
    cnic,
    phoneNumber,
    address,
    town,
    region,
    postcode,
    country,
  } = req.body

  // 1. Check if a user with the same email already exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // 2. Create a new user in the database
  const user = await User.create({
    name,
    email,
    password, // Password will be hashed by the model's pre-save hook
    cnic,
    phoneNumber,
    address,
    town,
    region,
    postcode,
    country,
  })

  // 3. If creation is successful, send back the new user's data
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      cnic: user.cnic,
      phoneNumber: user.phoneNumber,
      address: user.address,
      town: user.town,
      region: user.region,
      postcode: user.postcode,
      country: user.country,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    // 4. If data is invalid, send an error
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.deleteOne()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Forgot Password - Generate reset token
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    res.status(404)
    throw new Error('User not found with this email')
  }

  // Get reset token from user model
  const resetToken = user.getResetPasswordToken()

  // Save the user with the reset token and expiration
  await user.save({ validateBeforeSave: false })

  // For prototype simplicity, we'll send the token back in response
  // In a real app, you would email this to the user
  res.status(200).json({
    success: true,
    message: 'Reset token generated (Simulated Email)',
    resetToken,
  })
})

// @desc    Reset Password - Set new password using token
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Hash the token from the URL to compare it with the one in the database
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  // Find user with matching token and ensure it hasn't expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    res.status(400)
    throw new Error('Invalid or expired reset token')
  }

  // Set new password (the pre-save hook will hash it automatically)
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
  })
})

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
}
