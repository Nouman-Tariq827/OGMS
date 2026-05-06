import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const FilterModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Filter Products</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="search">
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search products..."
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control as="select">
              <option value="">All Categories</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="dairy">Dairy</option>
              <option value="meat">Meat</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="minPrice">
            <Form.Label>Min Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Min price"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="maxPrice">
            <Form.Label>Max Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Max price"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Product name..."
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default FilterModal
