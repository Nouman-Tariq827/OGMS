import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import HeroSlider from '../components/HeroSlider'
import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions'

const HomeScreen = ({ match }) => {
  // Extract search keyword and page number from the URL
  const keyword = match.params.keyword
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  // 1. Get the list of products from our global store (Redux)
  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  // 2. This runs when the page loads or when keyword/page changes
  useEffect(() => {
    // Tell the backend to fetch products based on search or page
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      {/* Set the page title and metadata */}
      <Meta />

      {/* Show the hero slider only on the main page (no search keyword) */}
      {!keyword ? (
        <HeroSlider />
      ) : (
        <Link to='/' className='btn btn-light'>
          Go Back
        </Link>
      )}

      <h1>Online Grocery Management Store</h1>
      <p className='lead'>
        Welcome to our Online Grocery Management Store. We provide high-quality
        grocery products right at your doorstep. Shop from a wide range of
        categories including fresh vegetables, fruits, dairy, and household
        essentials.
      </p>

      <h2>Latest Products</h2>

      {/* Show a loading spinner if we are waiting for data */}
      {loading ? (
        <Loader />
      ) : error ? (
        /* Show an error message if something went wrong */
        <Message variant='danger'>{error}</Message>
      ) : (
        /* Otherwise, show the products in a responsive grid */
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          {/* Show pagination buttons if there are multiple pages */}
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  )
}

export default HomeScreen

