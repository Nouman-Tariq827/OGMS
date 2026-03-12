import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'

const CategoryScreen = () => {
  const { category } = useParams()
  const dispatch = useDispatch()
  
  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    if (category) {
      dispatch(listProducts('', 1, category))
    }
  }, [dispatch, category])

  return (
    <Container>
      {category ? (
        <>
          <h1>{category} Products</h1>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : products.length > 0 ? (
            <Row>
              {products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          ) : (
            <Message>No products found in this category.</Message>
          )}
        </>
      ) : (
        <Message>Please select a category from the dropdown to view products.</Message>
      )}
    </Container>
  )
}

export default CategoryScreen
