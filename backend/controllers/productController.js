import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'

// @desc    Fetch all products (Browse the catalogue)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 1000 // Number of products to show per page (increased to show all products)
  const page = Number(req.query.pageNumber) || 1 // Current page number from URL

  console.log('Backend - Received Query Parameters:', req.query)

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
    // Handle malformed parameter like "category=Hair Care" from "category=category=Hair Care"
    let categoryValue = req.query.category
    if (categoryValue.includes('category=')) {
      categoryValue = categoryValue.replace('category=', '')
    }
    console.log('Backend - Processing Category Filter:', categoryValue)
    searchFilter.category = categoryValue // Filter by exact category name
  }
  
  // Check if there is a product name filter in the URL
  if (req.query.productName) {
    // Handle malformed parameter like "productName=surf" from "category=productName=surf"
    let productNameValue = req.query.productName
    if (productNameValue.includes('productName=')) {
      productNameValue = productNameValue.replace('productName=', '')
    }
    console.log('Backend - Processing Product Name Filter:', productNameValue)
    // Use productName for regex search to avoid conflict with keyword
    searchFilter.name = {
      $regex: productNameValue, // Use regular expression for searching
      $options: 'i', // 'i' means case-insensitive
    }
  }
  
  // Check if there is a minimum price filter in the URL
  if (req.query.minPrice) {
    // Handle malformed parameter like "minPrice=900" from "category=minPrice=900"
    let minPriceValue = req.query.minPrice
    if (minPriceValue.includes('minPrice=')) {
      minPriceValue = minPriceValue.replace('minPrice=', '')
    }
    console.log('Backend - Processing Min Price Filter:', minPriceValue)
    searchFilter.price = {
      $gte: Number(minPriceValue) // Greater than or equal to min price
    }
  }
  
  // Check if there is a maximum price filter in the URL
  if (req.query.maxPrice) {
    // Handle malformed parameter like "maxPrice=1000" from "category=maxPrice=1000"
    let maxPriceValue = req.query.maxPrice
    if (maxPriceValue.includes('maxPrice=')) {
      maxPriceValue = maxPriceValue.replace('maxPrice=', '')
    }
    console.log('Backend - Processing Max Price Filter:', maxPriceValue)
    searchFilter.price = {
      ...searchFilter.price, // Keep existing price filter if any
      $lte: Number(maxPriceValue) // Less than or equal to max price
    }
  }

  console.log('Search filter:', searchFilter) // Debug log

  // 1. Count total number of products matching the filter
  const count = await Product.countDocuments(searchFilter)

  // 2. Fetch products based on filter and current page (pagination)
  const products = await Product.find(searchFilter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  
  console.log('Backend - Filtered Results Count:', products.length)
  console.log('Backend - Final Search Filter Used:', searchFilter)

  // 3. Send back the products along with pagination details
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get sales report
// @route   GET /api/products/reports/sales
// @access  Private/Admin
const getSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, period } = req.query
  
  let dateFilter = {}
  
  if (period === 'today') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dateFilter.createdAt = { $gte: today }
  } else if (period === 'week') {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    dateFilter.createdAt = { $gte: weekAgo }
  } else if (period === 'month') {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    dateFilter.createdAt = { $gte: monthAgo }
  } else if (startDate && endDate) {
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }
  
  const orders = await Order.find(dateFilter)
  
  console.log('Sales Report - Orders found:', orders.length)
  console.log('Sales Report - Date filter:', dateFilter)
  console.log('Sales Report - Orders:', orders.map(o => ({ id: o._id, totalPrice: o.totalPrice, createdAt: o.createdAt })))
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const totalOrders = orders.length
  const deliveredOrders = orders.filter(order => order.isDelivered).length
  const pendingOrders = orders.filter(order => !order.isDelivered).length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const deliveredRevenue = orders
    .filter(order => order.isDelivered)
    .reduce((sum, order) => sum + order.totalPrice, 0)
  const profit = deliveredRevenue * 0.3
  
  console.log('Sales Report - Calculated values:', {
    totalRevenue,
    totalOrders,
    deliveredOrders,
    pendingOrders,
    averageOrderValue,
    deliveredRevenue,
    profit
  })
  
  // Get best-selling products
  const productSales = {}
  orders.forEach(order => {
    order.orderItems.forEach(item => {
      if (!productSales[item.product]) {
        productSales[item.product] = { quantity: 0, revenue: 0 }
      }
      productSales[item.product].quantity += item.qty
      productSales[item.product].revenue += item.qty * item.price
    })
  })
  
  const bestSellingProducts = await Promise.all(
    Object.entries(productSales)
      .sort((a, b) => b[1].quantity - a[1].quantity)
      .slice(0, 10)
      .map(async ([productId, data]) => {
        const product = await Product.findById(productId)
        return {
          productId,
          name: product?.name || 'Unknown',
          quantity: data.quantity,
          revenue: data.revenue
        }
      })
  )
  
  res.json({
    totalRevenue,
    totalOrders,
    deliveredOrders,
    pendingOrders,
    averageOrderValue,
    profit,
    bestSellingProducts,
    period: period || (startDate && endDate ? 'custom' : 'all')
  })
})

// @desc    Get stock report
// @route   GET /api/products/reports/stock
// @access  Private/Admin
const getStockReport = asyncHandler(async (req, res) => {
  console.log('Stock Report Endpoint Called')
  const products = await Product.find({})
  console.log('Stock Report - Total products found:', products.length)
  
  const lowStockThreshold = 10
  const lowStockProducts = products.filter(p => p.countInStock > 0 && p.countInStock <= lowStockThreshold)
  const outOfStockProducts = products.filter(p => p.countInStock === 0)
  const inStockProducts = products.filter(p => p.countInStock > lowStockThreshold)
  
  console.log('Stock Report - Low Stock Products:', lowStockProducts.length)
  console.log('Stock Report - Out of Stock Products:', outOfStockProducts.length)
  console.log('Stock Report - Low Stock Details:', lowStockProducts.map(p => ({ name: p.name, countInStock: p.countInStock })))
  console.log('Stock Report - Out of Stock Details:', outOfStockProducts.map(p => ({ name: p.name, countInStock: p.countInStock })))
  
  const totalStock = products.reduce((sum, p) => sum + p.countInStock, 0)
  const stockValue = products.reduce((sum, p) => sum + (p.countInStock * p.price), 0)
  
  const stockByCategory = {}
  products.forEach(product => {
    if (!stockByCategory[product.category]) {
      stockByCategory[product.category] = { count: 0, stock: 0, value: 0 }
    }
    stockByCategory[product.category].count += 1
    stockByCategory[product.category].stock += product.countInStock
    stockByCategory[product.category].value += product.countInStock * product.price
  })
  
  console.log('Stock Report - Total Products:', products.length)
  console.log('Stock Report - Low Stock Products:', lowStockProducts.length)
  console.log('Stock Report - Out of Stock Products:', outOfStockProducts.length)
  console.log('Stock Report - Low Stock Details:', lowStockProducts.map(p => ({ name: p.name, countInStock: p.countInStock })))
  console.log('Stock Report - Out of Stock Details:', outOfStockProducts.map(p => ({ name: p.name, countInStock: p.countInStock })))
  
  res.json({
    totalProducts: products.length,
    inStockProducts: inStockProducts.length,
    lowStockProducts: lowStockProducts.length,
    outOfStockProducts: outOfStockProducts.length,
    totalStock,
    stockValue,
    allProducts: products.map(p => ({
      _id: p._id,
      name: p.name,
      countInStock: p.countInStock,
      category: p.category,
      price: p.price
    })),
    lowStockProductsData: lowStockProducts.map(p => ({
      _id: p._id,
      name: p.name,
      countInStock: p.countInStock,
      category: p.category
    })),
    outOfStockProductsData: outOfStockProducts.map(p => ({
      _id: p._id,
      name: p.name,
      category: p.category
    })),
    stockByCategory
  })
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

  // Validate required fields
  if (!rating || !comment || comment.trim() === '') {
    res.status(400)
    throw new Error('Rating and comment are required')
  }

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
      comment: comment.trim(),
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
  getSalesReport,
  getStockReport,
}
