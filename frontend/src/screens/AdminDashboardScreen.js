import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Card, Button, Nav } from 'react-bootstrap'
import { listUsers } from '../actions/userActions'
import { listOrders } from '../actions/orderActions'
import { listProducts } from '../actions/productActions'
import { LinkContainer } from 'react-router-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'

const AdminDashboardScreen = ({ history }) => {
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderList = useSelector((state) => state.orderList)
  const { loading: loadingOrders, error: errorOrders, orders } = orderList

  const productList = useSelector((state) => state.productList)
  const { loading: loadingProducts, error: errorProducts, products } = productList

  const userList = useSelector((state) => state.userList)
  const { loading: loadingUsers, error: errorUsers, users } = userList

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    } else {
      dispatch(listUsers())
      dispatch(listOrders())
      dispatch(listProducts('', 1))
    }
  }, [dispatch, history, userInfo])

  return (
    <>
      <h1 className='mb-4'><i className='fas fa-user-shield mr-2'></i> Admin Dashboard</h1>

      <Row>
        <Col md={4} className='mb-3'>
          <Card className='shadow-sm h-100'>
            <Card.Body>
              <Card.Title><i className='fas fa-users mr-2'></i> User Management</Card.Title>
              {loadingUsers ? (
                <Loader />
              ) : errorUsers ? (
                <Message variant='danger'>{errorUsers}</Message>
              ) : (
                <Card.Text>
                  Manage registered users and permissions
                  {users ? ` (${users.length})` : ''}
                </Card.Text>
              )}
              <LinkContainer to='/admin/userlist'>
                <Button variant='primary'>Go to Users</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className='mb-3'>
          <Card className='shadow-sm h-100'>
            <Card.Body>
              <Card.Title><i className='fas fa-boxes mr-2'></i> Product Management</Card.Title>
              {loadingProducts ? (
                <Loader />
              ) : errorProducts ? (
                <Message variant='danger'>{errorProducts}</Message>
              ) : (
                <Card.Text>
                  Manage store catalogue and inventory
                  {products ? ` (${products.length} items)` : ''}
                </Card.Text>
              )}
              <LinkContainer to='/admin/productlist'>
                <Button variant='success'>Go to Products</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className='mb-3'>
          <Card className='shadow-sm h-100'>
            <Card.Body>
              <Card.Title><i className='fas fa-receipt mr-2'></i> Order Management</Card.Title>
              {loadingOrders ? (
                <Loader />
              ) : errorOrders ? (
                <Message variant='danger'>{errorOrders}</Message>
              ) : (
                <Card.Text>
                  Review and fulfill customer orders
                  {orders ? ` (${orders.length})` : ''}
                </Card.Text>
              )}
              <LinkContainer to='/admin/orderlist'>
                <Button variant='warning'>Go to Orders</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AdminDashboardScreen
