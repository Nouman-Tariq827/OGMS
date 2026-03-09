import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card } from 'react-bootstrap'

const CategoryScreen = () => {
  const categories = [
    { name: 'Hair Care', icon: 'fas fa-cut' },
    { name: 'Skin Care', icon: 'fas fa-hand-sparkles' },
    { name: 'Tea and Coffee', icon: 'fas fa-coffee' },
    { name: 'House Cleaning', icon: 'fas fa-broom' },
    { name: 'Dairy', icon: 'fas fa-cheese' },
    { name: 'Snacks & Beverages', icon: 'fas fa-cookie' },
    { name: 'Oil and Ghee', icon: 'fas fa-oil-can' },
    { name: 'Fruits and Vegetables', icon: 'fas fa-apple-alt' },
    { name: 'Meat', icon: 'fas fa-drumstick-bite' },
    { name: 'Pulses and Beans', icon: 'fas fa-seedling' },
    { name: 'Toothpaste', icon: 'fas fa-tooth' },
  ]

  return (
    <Container>
      <h1>Categories</h1>
      <Row>
        {categories.map((category, index) => (
          <Col key={index} sm={12} md={6} lg={4} className='mb-3'>
            <Link to={`/category/${category.name}`} className='text-decoration-none'>
              <Card className='text-center shadow-sm h-100 category-card'>
                <Card.Body>
                  <i
                    className={category.icon}
                    style={{ fontSize: '3rem', color: '#007bff' }}
                  ></i>
                  <Card.Title className='mt-3'>{category.name}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default CategoryScreen
