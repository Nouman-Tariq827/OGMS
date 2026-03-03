import React from 'react'
import { Container, Row, Col, ListGroup } from 'react-bootstrap'

const ContactScreen = () => {
  return (
    <Container>
      <h1>Contact Us</h1>
      <p>
        Have any questions? Feel free to reach out to us. We're here to help you!
      </p>
      <Row className='mt-4'>
        <Col md={6}>
          <h3>Contact Details</h3>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <i className='fas fa-phone-alt mr-2'></i> Phone: +92 3060869383
            </ListGroup.Item>
            <ListGroup.Item>
              <i className='fas fa-envelope mr-2'></i> Email:
              noumantariq827@gmail.com
            </ListGroup.Item>
            <ListGroup.Item>
              <i className='fas fa-map-marker-alt mr-2'></i> Address: House no 553 St 45 Umar Block Bahria Town,Rawalpindi
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={6}>
          <h3>Business Hours</h3>
          <ListGroup variant='flush'>
            <ListGroup.Item>Monday - Friday: 9 AM - 9 PM</ListGroup.Item>
            <ListGroup.Item>Saturday - Sunday: 10 AM - 6 PM</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default ContactScreen
