import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions'

const CategoryProductsScreen = ({ match }) => {
  // Extract category name and page number from URL
  const category = match.params.categoryName
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  // Get products from Redux store
  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  // Fetch products when component loads or when category/page changes
  useEffect(() => {
    dispatch(listProducts('', pageNumber, category)) // Pass empty keyword and category
  }, [dispatch, category, pageNumber])

  return (
    <>
      {/* Set page title and metadata */}
      <Meta title={`${category} - Online Grocery Store`} />

      {/* Breadcrumb navigation */}
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <Link to='/'>Home</Link>
          </li>
          <li className='breadcrumb-item active'>{category}</li>
        </ol>
      </nav>

      <h1>{category}</h1>
      <p className='lead'>
        Browse our selection of {category.toLowerCase()} products.
      </p>

      {/* Show loading spinner */}
      {loading ? (
        <Loader />
      ) : error ? (
        /* Show error message */
        <Message variant='danger'>{error}</Message>
      ) : products.length === 0 ? (
        /* Show no products message */
        <Message variant='info'>
          No products found in this category.
        </Message>
      ) : (
        /* Show products in grid */
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          {/* Show pagination if multiple pages */}
          <Paginate
            pages={pages}
            page={page}
            category={category ? category : ''}
          />
        </>
      )}
    </>
  )
}

export default CategoryProductsScreen
