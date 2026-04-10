import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card, Tab, Nav } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { addToCart, removeFromCart } from '../actions/cartActions'
import { listMyOrders } from '../actions/orderActions'

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id
  const [key, setKey] = useState('cart')

  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems, shippingAddress, paymentMethod } = cart

  const orderListMy = useSelector((state) => state.orderListMy)
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    // Redirect to login if no user is logged in
    if (!userInfo) {
      history.push('/login')
      return
    }

    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty, userInfo, history])

  useEffect(() => {
    // Only fetch orders if user is logged in
    if (userInfo) {
      dispatch(listMyOrders())
    }
  }, [dispatch, userInfo])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  // Custom styles for quantity stepper
  const quantityStepperStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '4px',
    borderRadius: '6px'
  }

  const quantityButtonStyles = {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#495057',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  }

  const quantityButtonDisabledStyles = {
    backgroundColor: '#e9ecef',
    borderColor: '#e9ecef',
    color: '#6c757d',
    cursor: 'not-allowed',
    opacity: '0.6'
  }

  const quantityInputStyles = {
    width: '45px',
    height: '32px',
    textAlign: 'center',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#ffffff',
    color: '#495057'
  }

  // Filter orders that are not delivered yet and sort by date (most recent first)
  const undeliveredOrders = orders 
    ? orders
        .filter(order => !order.isDelivered)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : []

  const checkoutHandler = () => {
    // Check if user is logged in before proceeding to checkout
    if (!userInfo) {
      history.push('/login')
      return
    }

    // Check checkout progress and redirect to appropriate step
    if (!shippingAddress || !shippingAddress.address) {
      history.push('/shipping')
    } else if (!paymentMethod) {
      history.push('/payment')
    } else {
      history.push('/placeorder')
    }
  }

  return (
    <Row>
      <Col md={8}>
        <Tab.Container id="left-tabs-example" activeKey={key} onSelect={(k) => setKey(k)}>
          <Nav variant="pills" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="cart">
                <i className="fas fa-shopping-cart mr-2"></i>
                Shopping Cart ({cartItems.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="history">
                <i className="fas fa-history mr-2"></i>
                Shopping History ({undeliveredOrders.length})
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content eventKey="cart">
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <Message>
                Your cart is empty <Link to='/'>Go Back</Link>
              </Message>
            ) : (
              <ListGroup variant='flush'>
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={2}>Rs {item.price}</Col>
                      <Col md={2}>
                        <div style={quantityStepperStyles}>
                          <Button
                            variant='outline-secondary'
                            size='sm'
                            onClick={() => {
                              if (item.qty > 1) {
                                dispatch(addToCart(item.product, item.qty - 1))
                              }
                            }}
                            disabled={item.qty <= 1}
                            className="quantity-btn"
                            style={item.qty <= 1 ? {...quantityButtonStyles, ...quantityButtonDisabledStyles} : quantityButtonStyles}
                            onMouseEnter={(e) => {
                              if (item.qty > 1) {
                                e.target.style.backgroundColor = '#28a745'
                                e.target.style.borderColor = '#28a745'
                                e.target.style.color = '#ffffff'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (item.qty > 1) {
                                e.target.style.backgroundColor = '#ffffff'
                                e.target.style.borderColor = '#ced4da'
                                e.target.style.color = '#495057'
                              }
                            }}
                          >
                            -
                          </Button>
                          <Form.Control
                            type='text'
                            value={item.qty}
                            readOnly
                            className="text-center mx-2"
                            style={quantityInputStyles}
                          />
                          <Button
                            variant='outline-secondary'
                            size='sm'
                            onClick={() => {
                              if (item.qty < item.countInStock) {
                                dispatch(addToCart(item.product, item.qty + 1))
                              }
                            }}
                            disabled={item.qty >= item.countInStock}
                            className="quantity-btn"
                            style={item.qty >= item.countInStock ? {...quantityButtonStyles, ...quantityButtonDisabledStyles} : quantityButtonStyles}
                            onMouseEnter={(e) => {
                              if (item.qty < item.countInStock) {
                                e.target.style.backgroundColor = '#28a745'
                                e.target.style.borderColor = '#28a745'
                                e.target.style.color = '#ffffff'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (item.qty < item.countInStock) {
                                e.target.style.backgroundColor = '#ffffff'
                                e.target.style.borderColor = '#ced4da'
                                e.target.style.color = '#495057'
                              }
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </Col>
                      <Col md={2}>
                        <Button
                          type='button'
                          variant='light'
                          onClick={() => removeFromCartHandler(item.product)}
                        >
                          <i className='fas fa-trash'></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Tab.Content>

          <Tab.Content eventKey="history">
            <h1>Shopping History</h1>
            {loadingOrders ? (
              <Loader />
            ) : errorOrders ? (
              <Message variant='danger'>{errorOrders}</Message>
            ) : undeliveredOrders.length === 0 ? (
              <Message>
                You have no pending orders. <Link to='/'>Continue Shopping</Link>
              </Message>
            ) : (
              <ListGroup variant='flush'>
                {undeliveredOrders.map((order) => (
                  <ListGroup.Item key={order._id} className="mb-2">
                    <Row className="align-items-center">
                      <Col md={4}>
                        <strong>Order ID:</strong> {order._id}
                      </Col>
                      <Col md={4}>
                        <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-PK')}
                      </Col>
                      <Col md={4} className="text-right">
                        <Button
                          as={Link}
                          to={`/order/${order._id}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Tab.Content>
        </Tab.Container>
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              Rs 
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen

