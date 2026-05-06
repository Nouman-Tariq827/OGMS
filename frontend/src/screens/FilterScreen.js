import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Card, Form, Button } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import { listProducts } from '../actions/productActions'

const FilterScreen = ({ match, location }) => {
  const dispatch = useDispatch()
  
  // Parse URL parameters for initial filter values
  const urlParams = new URLSearchParams(location.search)
  const initialCategory = urlParams.get('category') || ''
  const initialMinPrice = urlParams.get('minPrice') || ''
  const initialMaxPrice = urlParams.get('maxPrice') || ''
  const pageNumber = match.params.pageNumber || 1

  // Local state for filter values
  const [minPrice, setMinPrice] = useState(initialMinPrice)
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  const categories = [
    'Hair Care',
    'Skin Care', 
    'Tea and Coffee',
    'House Cleaning',
    'Dairy',
    'Snacks & Beverages',
    'Oil and Ghee',
    'Fruits and Vegetables',
    'Meat',
    'Pulses and Beans',
    'Toothpaste'
  ]

  const applyFilterHandler = () => {
    // Build filter object
    let filterParams = {}
    
    if (selectedCategory) {
      filterParams.category = selectedCategory
    }
    
    if (minPrice) {
      filterParams.minPrice = minPrice
    }
    
    if (maxPrice) {
      filterParams.maxPrice = maxPrice
    }
    
    // Convert filter object to query string
    const queryString = Object.keys(filterParams)
      .map(key => `${key}=${encodeURIComponent(filterParams[key])}`)
      .join('&')
    
    // Apply filter and navigate
    dispatch(listProducts('', 1, queryString))
  }

  const clearFilterHandler = () => {
    setMinPrice('')
    setMaxPrice('')
    setSelectedCategory('')
    dispatch(listProducts('', 1))
  }

  return (
    <>
      <h1>Filter Products</h1>
      <Row className='mb-3'>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Category</Card.Title>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Control>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Min Price</Card.Title>
              <Form.Control
                type="number"
                placeholder="Minimum price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Max Price</Card.Title>
              <Form.Control
                type="number"
                placeholder="Maximum price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className='mt-3'>
        <Col md={6}>
          <Button variant="primary" onClick={applyFilterHandler}>
            Apply Filter
          </Button>
        </Col>
        <Col md={6}>
          <Button variant="secondary" onClick={clearFilterHandler}>
            Clear Filter
          </Button>
        </Col>
      </Row>

      <hr className='my-4' />

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : products.length === 0 ? (
        <Message variant='info'>
          No products found matching your filter criteria.
        </Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={''}
            category={selectedCategory ? selectedCategory : ''}
          />
        </>
      )}
    </>
  )
}

export default FilterScreen
