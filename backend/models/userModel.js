import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// Schema defines the structure of the data in the MongoDB collection
const userSchema = mongoose.Schema(
  {
    // The user's full name
    name: {
      type: String,
      required: true,
    },
    // The user's unique email address (used for login)
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Required identification number (CNIC)
    cnic: {
      type: String,
      required: true,
    },
    // The user's phone number for contact
    phoneNumber: {
      type: String,
      required: true,
    },
    // Full home address of the user
    address: {
      type: String,
      required: true,
    },
    // Specific town or area
    town: {
      type: String,
      required: true,
    },
    // Larger administrative region
    region: {
      type: String,
      required: true,
    },
    // Postal or Zip code for the location
    postcode: {
      type: String,
      required: true,
    },
    // Country of residence
    country: {
      type: String,
      required: true,
    },
    // Encrypted password (handled before saving)
    password: {
      type: String,
      required: true,
    },
    // Flag to check if the user is an administrator
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    // Token used for resetting password
    resetPasswordToken: String,
    // Expiration date for the reset token
    resetPasswordExpire: Date,
  },
  {
    // Automatically creates 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
)

// This method compares the entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// This runs BEFORE a user is saved to the database to hash their password
userSchema.pre('save', async function (next) {
  // If the password field hasn't changed, just move to the next step
  if (!this.isModified('password')) {
    next()
  }

  // Generate a 'salt' to securely hash the password
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate a random 20-character string (the reset token)
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash the token and set it to the resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  // Set the expiration time to 10 minutes from now
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  // Return the plain token (this is what will be sent to the user's email)
  return resetToken
}

const User = mongoose.model('User', userSchema)

export default User
