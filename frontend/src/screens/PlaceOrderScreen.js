import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { getPaymentMethodDisplayName } from '../config/paymentMethods'

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)

  const cart = useSelector((state) => state.cart)

  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error, loading } = orderCreate

  useEffect(() => {
    if (success && order) {
      setShowModal(true)
      // Auto-redirect after 5 seconds
      setTimeout(() => {
        history.push(`/order/${order._id}`)
        dispatch({ type: ORDER_CREATE_RESET })
      }, 5000)
    }
    // eslint-disable-next-line
  }, [history, success, order, dispatch])

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    )
  }

  const handleCloseModal = () => {
    setShowModal(false)
    if (order) {
      history.push(`/order/${order._id}`)
      dispatch({ type: ORDER_CREATE_RESET })
    }
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
              <p>
                <strong>Phone:</strong>
                {cart.shippingAddress.phone}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {getPaymentMethodDisplayName(cart.paymentMethod)}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x Rs {item.price} = Rs {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>Rs {cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>Rs {cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>Rs {cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>Rs {cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0 || loading}
                  onClick={placeOrderHandler}
                >
                  {loading ? <Loader /> : 'Place Order'}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Order Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-success">
            <i className="fas fa-check-circle mr-2"></i>
            Order Placed Successfully!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-4">
              <i className="fas fa-shopping-cart fa-3x text-success mb-3"></i>
              <h4>Thank you for your order!</h4>
            </div>
            
            {order && (
              <Card className="text-left mb-3">
                <Card.Body>
                  <h6 className="mb-3">
                    <i className="fas fa-receipt mr-2"></i>
                    Order Details
                  </h6>
                  <Row className="mb-2">
                    <Col sm={6}><strong>Order ID:</strong></Col>
                    <Col sm={6}>{order._id}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={6}><strong>Total Amount:</strong></Col>
                    <Col sm={6}>Rs {order.totalPrice}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={6}><strong>Payment Method:</strong></Col>
                    <Col sm={6}>{getPaymentMethodDisplayName(order.paymentMethod)}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={6}><strong>Status:</strong></Col>
                    <Col sm={6}>
                      <span className="badge badge-info">
                        <i className="fas fa-clock mr-1"></i>
                        Processing
                      </span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {order && order.paymentMethod === 'COD' && (
              <Message variant="info">
                <i className="fas fa-money-bill-wave mr-2"></i>
                <strong>Cash on Delivery:</strong> Please pay Rs {order.totalPrice} when your order arrives.
              </Message>
            )}

            <p className="text-muted mb-0">
              <small>
                <i className="fas fa-info-circle mr-1"></i>
                You will be redirected to your order details page in 5 seconds...
              </small>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseModal}>
            View Order Details
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PlaceOrderScreen
