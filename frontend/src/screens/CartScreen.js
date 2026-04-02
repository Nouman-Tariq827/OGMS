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
                        <Form.Control
                          as='select'
                          value={item.qty}
                          onChange={(e) =>
                            dispatch(
                              addToCart(item.product, Number(e.target.value))
                            )
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
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
                        <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
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

