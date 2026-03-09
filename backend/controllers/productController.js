import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Fetch all products (Browse the catalogue)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12 // Number of products to show per page (12 = 3 rows of 4 cards)
  const page = Number(req.query.pageNumber) || 1 // Current page number from URL

  // Build search filter
  let searchFilter = {}
  
  // Check if there is a search 'keyword' in the URL
  if (req.query.keyword) {
    searchFilter.name = {
      $regex: req.query.keyword, // Use regular expression for searching
      $options: 'i', // 'i' means case-insensitive
    }
  }
  
  // Check if there is a category filter in the URL
  if (req.query.category) {
    searchFilter.category = req.query.category // Filter by exact category name
  }

  console.log('Search filter:', searchFilter) // Debug log

  // 1. Count total number of products matching the filter
  const count = await Product.countDocuments(searchFilter)

  // 2. Fetch products based on filter and current page (pagination)
  const products = await Product.find(searchFilter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  // 3. Send back the products along with pagination details
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // Find a product by its unique database ID
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product) // Send back product if found
  } else {
    res.status(404) // Send 404 if not found
    throw new Error('Product not found')
  }
})

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  // Find the product to be deleted
  const product = await Product.findById(req.params.id)

  if (product) {
    // 1. Delete the product from the database
    await product.deleteOne()
    res.json({ message: 'Product removed successfully' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // Get product data from the request body
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body

  // Create a new product with the provided data
  const product = new Product({
    name: name || 'Sample Product',
    price: price || 0,
    user: req.user._id, // Assign to the logged-in admin
    image: image || '/uploads/sample.jpg',
    brand: brand || 'Grocery Brand',
    category: category || 'Food',
    countInStock: countInStock || 0,
    numReviews: 0,
    description: description || 'Enter product description here...',
  })

  // Save the new product to the database
  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Update an existing product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  // Get updated data from the request body
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body

  // 1. Find the product by ID
  const product = await Product.findById(req.params.id)

  if (product) {
    // 2. Update the product fields with new data
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    // 3. Save the updated product
    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)

  res.json(products)
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
}
