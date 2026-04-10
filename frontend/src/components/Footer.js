import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className="py-4 text-dark" style={{ backgroundColor: '#e7f6df' }}>
      <Container>
        <Row className="mb-3">
          <Col md={4} className="mb-3 mb-md-0">
            <h6 className="text-uppercase fw-bold mb-3">Grocery Store</h6>
            <p className="small mb-0">Your trusted online grocery marketplace</p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h6 className="text-uppercase fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a href="/about" className="text-decoration-none text-dark">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="text-decoration-none text-dark">
                  Contact
                </a>
              </li>
              <li className="mb-2">
                <a href="/privacy" className="text-decoration-none text-dark">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h6 className="text-uppercase fw-bold mb-3">Contact Info</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <i className="fas fa-map-marker-alt me-2"></i>
                Bahria Town Phase 8, Rawalpindi, Pakistan
              </li>
              <li className="mb-2">
                <i className="fas fa-phone me-2"></i>
                +92 3060869383
              </li>
              <li className="mb-2">
                <i className="fas fa-envelope me-2"></i>
                noumantariq827@gmail.com
              </li>
            </ul>
          </Col>
        </Row>
        <hr className="bg-light" />
        <Row className="mt-3">
          <Col className="text-center">
            <small className="text-muted">
              &copy; {new Date().getFullYear()} Grocery Store. All rights reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer

