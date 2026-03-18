import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'

const AboutScreen = () => {
  return (
    <Container className='py-5'>
      <div className='text-center mb-5'>
        <h1 className='display-4 fw-bold mb-4'>About Us</h1>
        <p className='lead text-muted mb-4'>
          Your Trusted Online Grocery Store Since 2020
        </p>
      </div>

      <Row className='g-4'>
        <Col md={4} className='mb-4'>
          <Card className='h-100 text-center shadow-sm border-0'>
            <Card.Body className='p-4'>
              <div className='mb-3'>
                <i className='fas fa-store fa-3x text-primary mb-3'></i>
              </div>
              <Card.Title className='fw-bold'>Our Mission</Card.Title>
              <Card.Text className='text-muted'>
                To provide fresh, high-quality groceries at affordable prices while making your shopping experience convenient and enjoyable.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className='mb-4'>
          <Card className='h-100 text-center shadow-sm border-0'>
            <Card.Body className='p-4'>
              <div className='mb-3'>
                <i className='fas fa-truck fa-3x text-success mb-3'></i>
              </div>
              <Card.Title className='fw-bold'>Fast Delivery</Card.Title>
              <Card.Text className='text-muted'>
                Quick and reliable delivery service to get your groceries right to your doorstep.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className='mb-4'>
          <Card className='h-100 text-center shadow-sm border-0'>
            <Card.Body className='p-4'>
              <div className='mb-3'>
                <i className='fas fa-shield-alt fa-3x text-info mb-3'></i>
              </div>
              <Card.Title className='fw-bold'>Quality Assurance</Card.Title>
              <Card.Text className='text-muted'>
                We carefully select and inspect all products to ensure the highest quality standards.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className='g-4 mt-4'>
        <Col md={6} className='mb-4'>
          <Card className='shadow-sm border-0'>
            <Card.Body className='p-4'>
              <Card.Title className='fw-bold'>
                <i className='fas fa-clock text-warning mr-2'></i>
                Our Story
              </Card.Title>
              <Card.Text>
                Founded in 2020, we started as a small family business with a simple goal: to make fresh groceries accessible to everyone. Today, we're proud to serve thousands of customers with the same commitment to quality and service that we had on day one.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className='mb-4'>
          <Card className='shadow-sm border-0'>
            <Card.Body className='p-4'>
              <Card.Title className='fw-bold'>
                <i className='fas fa-users text-primary mr-2'></i>
                Our Team
              </Card.Title>
              <Card.Text>
                Our dedicated team works around the clock to ensure you get the best products and service. From our delivery drivers to our customer support, we're here to make your grocery shopping experience exceptional.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className='mt-5'>
        <Col className='text-center'>
          <Card className='border-0 bg-light'>
            <Card.Body className='p-4'>
              <Card.Title className='fw-bold text-primary mb-3'>
                <i className='fas fa-heart text-danger mr-2'></i>
                Why Choose Us?
              </Card.Title>
              <Row>
                <Col md={4} className='mb-3'>
                  <div className='text-center'>
                    <i className='fas fa-check-circle fa-2x text-success mb-2'></i>
                    <h6 className='fw-bold'>Fresh Products</h6>
                    <p className='text-muted small'>Daily fresh deliveries</p>
                  </div>
                </Col>
                <Col md={4} className='mb-3'>
                  <div className='text-center'>
                    <i className='fas fa-dollar-sign fa-2x text-warning mb-2'></i>
                    <h6 className='fw-bold'>Best Prices</h6>
                    <p className='text-muted small'>Competitive pricing</p>
                  </div>
                </Col>
                <Col md={4} className='mb-3'>
                  <div className='text-center'>
                    <i className='fas fa-headset fa-2x text-info mb-2'></i>
                    <h6 className='fw-bold'>24/7 Support</h6>
                    <p className='text-muted small'>Always here to help</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AboutScreen
