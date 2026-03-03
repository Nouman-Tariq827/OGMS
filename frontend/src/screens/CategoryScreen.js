import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'

const CategoryScreen = () => {
  const categories = [
    { name: 'Fruits & Vegetables', icon: 'fas fa-apple-alt' },
    { name: 'Dairy & Eggs', icon: 'fas fa-egg' },
    { name: 'Beverages', icon: 'fas fa-coffee' },
    { name: 'Snacks & Sweets', icon: 'fas fa-cookie-bite' },
    { name: 'Household Essentials', icon: 'fas fa-home' },
    { name: 'Personal Care', icon: 'fas fa-user-circle' },
  ]

  return (
    <Container>
      <h1>Categories</h1>
      <Row>
        {categories.map((category, index) => (
          <Col key={index} sm={12} md={6} lg={4} className='mb-3'>
            <Card className='text-center shadow-sm'>
              <Card.Body>
                <i
                  className={category.icon}
                  style={{ fontSize: '3rem', color: '#007bff' }}
                ></i>
                <Card.Title className='mt-3'>{category.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default CategoryScreen
