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
  const initialProductName = urlParams.get('productName') || ''
  const pageNumber = match.params.pageNumber || 1
  
  // Get search keyword from URL parameter (from SearchBox)
  const searchKeyword = match.params.keyword || match.params.productName || ''
  
  // Use search keyword as product name if it exists
  const effectiveProductName = initialProductName || searchKeyword

  // Local state for filter values
  const [minPrice, setMinPrice] = useState(initialMinPrice)
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [productName, setProductName] = useState(effectiveProductName)

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
  ]

  const applyFilterHandler = () => {
    const filterParams = {}
    
    console.log('Frontend Filter State:', { selectedCategory, productName, minPrice, maxPrice })
    
    if (selectedCategory) {
      filterParams.category = selectedCategory
    }
    
    if (productName) {
      filterParams.productName = productName
    }
    
    if (minPrice) {
      filterParams.minPrice = minPrice
    }
    
    if (maxPrice) {
      filterParams.maxPrice = maxPrice
    }
    
    // Also handle search keyword from URL parameter
    if (searchKeyword) {
      filterParams.keyword = searchKeyword
    }
    
    // Convert filter object to query string
    const queryString = Object.keys(filterParams)
      .map(key => `${key}=${encodeURIComponent(filterParams[key])}`)
      .join('&')
    
    console.log('Frontend API Query String:', queryString)
    
    // Apply filter and navigate
    dispatch(listProducts('', '', '', queryString))
  }

  const clearFilterHandler = () => {
    setMinPrice('')
    setMaxPrice('')
    setSelectedCategory('')
    setProductName('')
    dispatch(listProducts('', '', '', ''))
  }

  return (
    <>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h1 className='mb-0'>Filter Products</h1>
      </div>
      
      <Card className='mb-4 shadow-sm' style={{ borderRadius: '12px' }}>
        <Card.Body style={{ padding: '20px' }}>
          <Row className='align-items-end g-3'>
            <Col xs={12} sm={6} md={3}>
              <Form.Group controlId='category'>
                <Form.Label className='small mb-1 text-muted'>Category</Form.Label>
                <Form.Control
                  as="select"
                  size="sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ borderRadius: '8px' }}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            
            <Col xs={12} sm={6} md={3}>
              <Form.Group controlId='productName'>
                <Form.Label className='small mb-1 text-muted'>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  placeholder="Search products..."
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Group>
            </Col>
            
            <Col xs={12} sm={6} md={3}>
              <Form.Group controlId='minPrice'>
                <Form.Label className='small mb-1 text-muted'>Min Price</Form.Label>
                <Form.Control
                  type="number"
                  size="sm"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Group>
            </Col>
            
            <Col xs={12} sm={6} md={3}>
              <Form.Group controlId='maxPrice'>
                <Form.Label className='small mb-1 text-muted'>Max Price</Form.Label>
                <Form.Control
                  type="number"
                  size="sm"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className='mt-3 d-flex justify-content-end'>
            <Col xs='auto'>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={applyFilterHandler} 
                style={{ borderRadius: '8px', padding: '6px 16px', fontSize: '0.85rem', marginRight: '20px' }}
              >
                <i className='fas fa-filter mr-1'></i> Apply Filter
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={clearFilterHandler}
                style={{ borderRadius: '8px', padding: '6px 16px', fontSize: '0.85rem' }}
              >
                <i className='fas fa-times mr-1'></i> Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
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
            keyword={location.search.split('=')[1]}
          />
        </>
      )}
    </>
  )
}

export default FilterScreen
