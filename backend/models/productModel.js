import mongoose from 'mongoose'

// Schema for customer reviews on products
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // Name of the reviewer
    rating: { type: Number, required: true }, // Rating given by reviewer
    comment: { type: String, required: true }, // Review text
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User who wrote the review
    },
  },
  {
    timestamps: true,
  }
)

// Main schema for grocery products in the store
const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Admin user who added this product
    },
    name: {
      type: String,
      required: true, // Product name (e.g., "Apples")
    },
    image: {
      type: String,
      required: true, // Path to product image
    },
    brand: {
      type: String,
      required: true, // Manufacturer or brand name
    },
    category: {
      type: String,
      required: true, // Type of grocery (e.g., "Fruits", "Dairy")
    },
    description: {
      type: String,
      required: true, // Detailed product description
    },
    reviews: [reviewSchema], // Array of review objects
    rating: {
      type: Number,
      required: true,
      default: 0, // Average rating
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0, // Total count of reviews
    },
    price: {
      type: Number,
      required: true,
      default: 0, // Price in Rupees
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0, // Number of items available
    },
  },
  {
    timestamps: true, // Automatically track created/updated times
  }
)

const Product = mongoose.model('Product', productSchema)

export default Product
