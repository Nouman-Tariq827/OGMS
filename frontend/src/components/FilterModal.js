import React from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'

const FilterModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="text-white">
          <i className="fas fa-filter me-2"></i>
          Filter Products
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="search">
                <Form.Label className="fw-bold text-primary">
                  <i className="fas fa-search me-2"></i>
                  Search Products
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  className="shadow-sm"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="category">
                <Form.Label className="fw-bold text-primary">
                  <i className="fas fa-list me-2"></i>
                  Category
                </Form.Label>
                <Form.Control as="select" className="shadow-sm">
                  <option value="">All Categories</option>
                  <option value="fruits">Fruits</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="dairy">Dairy</option>
                  <option value="meat">Meat</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="minPrice">
                <Form.Label className="fw-bold text-primary">
                  <i className="fas fa-dollar-sign me-2"></i>
                  Min Price
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Minimum price"
                  className="shadow-sm"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="maxPrice">
                <Form.Label className="fw-bold text-primary">
                  <i className="fas fa-dollar-sign me-2"></i>
                  Max Price
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Maximum price"
                  className="shadow-sm"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="name">
                <Form.Label className="fw-bold text-primary">
                  <i className="fas fa-tag me-2"></i>
                  Product Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name..."
                  className="shadow-sm"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <div className="d-flex justify-content-between w-100">
          <Button variant="outline-secondary" onClick={handleClose}>
            <i className="fas fa-times me-2"></i>
            Close
          </Button>
          <Button variant="primary" className="ms-2">
            <i className="fas fa-check me-2"></i>
            Apply Filters
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default FilterModal
