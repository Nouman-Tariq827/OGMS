import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { listCatalogueDetails } from '../actions/catalogueActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Product from '../components/Product'

const CatalogueDetailScreen = () => {
  const params = useParams()
  const dispatch = useDispatch()

  const catalogueDetails = useSelector((state) => state.catalogueDetails)
  const { loading, error, catalogue } = catalogueDetails

  useEffect(() => {
    dispatch(listCatalogueDetails(params.id))
  }, [dispatch, params.id])

  return (
    <>
      <Link to='/catalogues' className='btn btn-light my-3'>
        Go Back to Catalogues
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : catalogue ? (
        <>
          <Card className='mb-4'>
            <Card.Img 
              variant='top' 
              src={catalogue.image} 
              alt={catalogue.name}
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title as='h1'>{catalogue.name}</Card.Title>
              <Card.Text>{catalogue.description}</Card.Text>
              <Card.Text>
                <strong>Products in this catalogue: {catalogue.products?.length || 0}</strong>
              </Card.Text>
            </Card.Body>
          </Card>

          <h2>Products in this Catalogue</h2>
          {!catalogue.products || catalogue.products.length === 0 ? (
            <Message>No products in this catalogue</Message>
          ) : (
            <Row>
              {catalogue.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='mb-4'>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}
        </>
      ) : (
        <Message>Catalogue not found</Message>
      )}
    </>
  )
}

export default CatalogueDetailScreen
