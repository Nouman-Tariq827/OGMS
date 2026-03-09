import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct, createProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET, PRODUCT_CREATE_RESET } from '../constants/productConstants'

const ProductEditScreen = ({ match, history, location }) => {
  const productId = match.params.id
  const params = new URLSearchParams(location.search)
  const returnUrl = params.get('page') || 1

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  const productCreate = useSelector((state) => state.productCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      setSuccessMessage('Product has been updated successfully.')
      setTimeout(() => {
        setSuccessMessage('')
        history.push(`/admin/productlist/page/${returnUrl}`)
      }, 2000) // Stay on page for 2 seconds before redirecting
    } else if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET })
      setSuccessMessage('Product has been created successfully.')
      setTimeout(() => {
        setSuccessMessage('')
        history.push('/admin/productlist')
      }, 2000) // Stay on page for 2 seconds before redirecting
    } else {
      if (productId && (!product.name || product._id !== productId)) {
        dispatch(listProductDetails(productId))
      } else if (product.name) {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [dispatch, history, productId, product, successUpdate, successCreate])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)

      setImage(data)
      setUploading(false)
    } catch (error) {
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    if (productId) {
      // Update existing product
      dispatch(
        updateProduct({
          _id: productId,
          name,
          price,
          image,
          brand,
          category,
          description,
          countInStock,
        })
      )
    } else {
      // Create new product
      dispatch(
        createProduct({
          name,
          price,
          image,
          brand,
          category,
          description,
          countInStock,
        })
      )
    }
  }

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>{productId ? 'Edit Product' : 'Create Product'}</h1>
        {successMessage && <Message variant='success'>{successMessage}</Message>}
        {loadingUpdate && <Loader />}
        {loadingCreate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.File
                id='image-file'
                label='Choose File'
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as='select'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=''>Select a category...</option>
                <option value='Hair Care'>Hair Care</option>
                <option value='Skin Care'>Skin Care</option>
                <option value='Tea and Coffee'>Tea and Coffee</option>
                <option value='House Cleaning'>House Cleaning</option>
                <option value='Dairy'>Dairy</option>
                <option value='Snacks & Beverages'>Snacks & Beverages</option>
                <option value='Oil and Ghee'>Oil and Ghee</option>
                <option value='Fruits and Vegetables'>Fruits and Vegetables</option>
                <option value='Meat'>Meat</option>
                <option value='Pulses and Beans'>Pulses and Beans</option>
                <option value='Toothpaste'>Toothpaste</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              {productId ? 'Update' : 'Create'}
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen
