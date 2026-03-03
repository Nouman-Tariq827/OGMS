import React, { useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { listMyOrders } from '../actions/orderActions'
import { listProducts } from '../actions/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Product from '../components/Product'
import Paginate from '../components/Paginate'

const UserDashboardScreen = ({ history, match }) => {
  // 1. Get current page number for the product list
  const pageNumber = match.params.pageNumber || 1
  const dispatch = useDispatch()

  // 2. Access logged-in user info from the global state
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // 3. Access the user's order history
  const orderListMy = useSelector((state) => state.orderListMy)
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

  // 4. Access the full product list for display
  const productList = useSelector((state) => state.productList)
  const { loading: loadingProducts, error: errorProducts, products, page, pages } = productList

  // 5. This runs when the dashboard loads
  useEffect(() => {
    // If not logged in, go to login page
    if (!userInfo) {
      history.push('/login')
    } else if (userInfo.isAdmin) {
      // Admins should see the admin dashboard instead
      history.push('/admin/dashboard')
    } else {
      // Fetch the user's specific orders and all grocery products
      dispatch(listMyOrders())
      dispatch(listProducts('', pageNumber))
    }
  }, [history, userInfo, dispatch, pageNumber])

  return (
    <>
      <h1 className='mb-4'>Welcome back, {userInfo && userInfo.name}</h1>
      
      {/* Dashboard Top Section: Quick Links */}
      <Row className='mb-5'>
        <Col md={4} className='mb-3'>
          <Card className='shadow-sm h-100'>
            <Card.Body>
              <Card.Title><i className='fas fa-shopping-bag mr-2'></i> My Orders</Card.Title>
              {/* Show loading/error for orders */}
              {loadingOrders ? (
                <Loader />
              ) : errorOrders ? (
                <Message variant='danger'>{errorOrders}</Message>
              ) : (
                <Card.Text>
                  View and track your previous orders
                  {orders ? ` (${orders.length})` : ''}
                </Card.Text>
              )}
              <LinkContainer to='/profile'>
                <Button variant='primary'>Go to Orders</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className='mb-3'>
          <Card className='shadow-sm h-100'>
            <Card.Body>
              <Card.Title><i className='fas fa-user-edit mr-2'></i> Account Settings</Card.Title>
              <Card.Text>Update your profile and change password</Card.Text>
              <LinkContainer to='/profile'>
                <Button variant='secondary'>Edit Profile</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className='mb-3'>
          <Card className='shadow-sm h-100 text-white bg-success'>
            <Card.Body>
              <Card.Title><i className='fas fa-shopping-cart mr-2'></i> Shopping Cart</Card.Title>
              <Card.Text>Ready to checkout? View your cart items.</Card.Text>
              <LinkContainer to='/cart'>
                <Button variant='light'>Go to Cart</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Dashboard Bottom Section: Product List */}
      <section className='mb-5'>
        <h3>Available Grocery Products</h3>
        {loadingProducts ? (
          <Loader />
        ) : errorProducts ? (
          <Message variant='danger'>{errorProducts}</Message>
        ) : (
          <>
            <Row>
              {/* Loop through the products array and show each one */}
              {products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
            {/* Show page numbers for the product list */}
            <Paginate
              pages={pages}
              page={page}
              isAdmin={false}
              isDashboard={true}
            />
          </>
        )}
      </section>
    </>
  )
}

export default UserDashboardScreen
