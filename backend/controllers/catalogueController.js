import asyncHandler from 'express-async-handler'
import Catalogue from '../models/catalogueModel.js'
import Product from '../models/productModel.js'

// @desc    Get all catalogues (public - only active)
// @route   GET /api/catalogues
// @access  Public
const getCatalogues = asyncHandler(async (req, res) => {
  const catalogues = await Catalogue.find({ isActive: true }).populate('products')
  res.json(catalogues)
})

// @desc    Get all catalogues (admin - includes inactive)
// @route   GET /api/catalogues/admin/all
// @access  Private/Admin
const getAdminCatalogues = asyncHandler(async (req, res) => {
  const catalogues = await Catalogue.find({}).populate('products')
  res.json(catalogues)
})

// @desc    Get single catalogue by ID
// @route   GET /api/catalogues/:id
// @access  Public
const getCatalogueById = asyncHandler(async (req, res) => {
  const catalogue = await Catalogue.findById(req.params.id).populate('products')
  
  if (catalogue) {
    res.json(catalogue)
  } else {
    res.status(404)
    throw new Error('Catalogue not found')
  }
})

// @desc    Create new catalogue
// @route   POST /api/catalogues
// @access  Private/Admin
const createCatalogue = asyncHandler(async (req, res) => {
  const { name, description, image, products } = req.body
  
  const catalogue = new Catalogue({
    user: req.user._id,
    name,
    description,
    image,
    products: products || [],
  })
  
  const createdCatalogue = await catalogue.save()
  res.status(201).json(createdCatalogue)
})

// @desc    Update catalogue
// @route   PUT /api/catalogues/:id
// @access  Private/Admin
const updateCatalogue = asyncHandler(async (req, res) => {
  const { name, description, image, products, isActive } = req.body
  
  const catalogue = await Catalogue.findById(req.params.id)
  
  if (catalogue) {
    catalogue.name = name || catalogue.name
    catalogue.description = description || catalogue.description
    catalogue.image = image || catalogue.image
    catalogue.products = products || catalogue.products
    catalogue.isActive = isActive !== undefined ? isActive : catalogue.isActive
    
    const updatedCatalogue = await catalogue.save()
    res.json(updatedCatalogue)
  } else {
    res.status(404)
    throw new Error('Catalogue not found')
  }
})

// @desc    Delete catalogue
// @route   DELETE /api/catalogues/:id
// @access  Private/Admin
const deleteCatalogue = asyncHandler(async (req, res) => {
  const catalogue = await Catalogue.findById(req.params.id)
  
  if (catalogue) {
    await catalogue.deleteOne()
    res.json({ message: 'Catalogue removed' })
  } else {
    res.status(404)
    throw new Error('Catalogue not found')
  }
})

// @desc    Add product to catalogue
// @route   PUT /api/catalogues/:id/products/:productId
// @access  Private/Admin
const addProductToCatalogue = asyncHandler(async (req, res) => {
  const catalogue = await Catalogue.findById(req.params.id)
  const product = await Product.findById(req.params.productId)
  
  if (!catalogue) {
    res.status(404)
    throw new Error('Catalogue not found')
  }
  
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }
  
  if (!catalogue.products.includes(product._id)) {
    catalogue.products.push(product._id)
    await catalogue.save()
  }
  
  const updatedCatalogue = await Catalogue.findById(catalogue._id).populate('products')
  res.json(updatedCatalogue)
})

// @desc    Remove product from catalogue
// @route   DELETE /api/catalogues/:id/products/:productId
// @access  Private/Admin
const removeProductFromCatalogue = asyncHandler(async (req, res) => {
  const catalogue = await Catalogue.findById(req.params.id)
  
  if (!catalogue) {
    res.status(404)
    throw new Error('Catalogue not found')
  }
  
  catalogue.products = catalogue.products.filter(
    productId => productId.toString() !== req.params.productId
  )
  
  await catalogue.save()
  const updatedCatalogue = await Catalogue.findById(catalogue._id).populate('products')
  res.json(updatedCatalogue)
})

export {
  getCatalogues,
  getAdminCatalogues,
  getCatalogueById,
  createCatalogue,
  updateCatalogue,
  deleteCatalogue,
  addProductToCatalogue,
  removeProductFromCatalogue,
}
