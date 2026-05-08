import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { listCatalogues } from '../actions/catalogueActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

const CatalogueScreen = () => {
  const dispatch = useDispatch()

  const catalogueList = useSelector((state) => state.catalogueList)
  const { loading, error, catalogues } = catalogueList

  useEffect(() => {
    dispatch(listCatalogues())
  }, [dispatch])

  return (
    <>
      <h1>Our Catalogues</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {catalogues.map((catalogue) => (
              <Col key={catalogue._id} sm={12} md={6} lg={4} className='mb-4'>
                <Card className='h-100'>
                  <Card.Img
                    variant='top'
                    src={catalogue.image}
                    alt={catalogue.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{catalogue.name}</Card.Title>
                    <Card.Text>{catalogue.description.substring(0, 100)}...</Card.Text>
                    <Card.Text>
                      <small className='text-muted'>{catalogue.products.length} products</small>
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Link to={`/catalogue/${catalogue._id}`}>
                      <Button variant='primary' className='btn-block'>
                        View Catalogue
                      </Button>
                    </Link>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  )
}

export default CatalogueScreen
