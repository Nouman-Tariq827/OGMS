import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { listUsers } from '../actions/userActions'
import { listOrders } from '../actions/orderActions'
import { listProducts } from '../actions/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import axios from 'axios'

const AdminDashboardScreen = ({ history }) => {
  const dispatch = useDispatch()
  const [totalProductCount, setTotalProductCount] = useState(0)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderList = useSelector((state) => state.orderList)
  const { loading: loadingOrders, error: errorOrders, orders } = orderList

  const productList = useSelector((state) => state.productList)
  const { loading: loadingProducts, error: errorProducts } = productList

  const userList = useSelector((state) => state.userList)
  const { loading: loadingUsers, error: errorUsers, users } = userList

  // Fetch total product count from backend
  const fetchTotalProductCount = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/products?pageNumber=1')
      if (data.pages && data.products) {
        // If there's only one page, use that count
        if (data.pages === 1) {
          setTotalProductCount(data.products.length)
        } else {
          // Fetch the last page to get exact count
          const { data: lastPageData } = await axios.get(`/api/products?pageNumber=${data.pages}`)
          setTotalProductCount((data.pages - 1) * 12 + lastPageData.products.length)
        }
      } else {
        setTotalProductCount(0)
      }
    } catch (error) {
      console.error('Error fetching total product count:', error)
      setTotalProductCount(0)
    }
  }, [])

  // Manual refresh function
  const refreshDashboard = useCallback(() => {
    dispatch(listUsers())
    dispatch(listOrders())
    dispatch(listProducts('', 1))
    // Fetch total product count after a delay
    setTimeout(fetchTotalProductCount, 500)
  }, [dispatch, fetchTotalProductCount])

  // Auto-refresh when component mounts or user returns to dashboard
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    } else {
      refreshDashboard()
    }
  }, [dispatch, history, userInfo, refreshDashboard])

  return (
    <>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h1 className='mb-0'><i className='fas fa-user-shield mr-2'></i> Admin Dashboard</h1>
        <Button variant='outline-primary' onClick={refreshDashboard}>
          <i className='fas fa-sync-alt mr-2'></i> Refresh Dashboard
        </Button>
      </div>

      <Row>
        <Col md={3} className='mb-3'>
          <Card className='shadow-sm h-100'>
            <Card.Body>
              <Card.Title><i className='fas fa-users mr-2'></i> User Management</Card.Title>
              {loadingUsers ? (
                <Loader />
              ) : errorUsers ? (
                <Message variant='danger'>{errorUsers}</Message>
              ) : (
                <Card.Text>
                  Manage user accounts and permissions
                  {users ? ` (${users.length} users)` : ''}
                </Card.Text>
              )}
              <LinkContainer to='/admin/userlist'>
                <Button variant='primary'>Go to Users</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className='mb-3'>
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
                  {` (${totalProductCount} total items)`}
                </Card.Text>
              )}
              <LinkContainer to='/admin/productlist'>
                <Button variant='success'>Go to Products</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className='mb-3'>
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
                  {orders ? ` (${orders.length} orders)` : ''}
                </Card.Text>
              )}
              <LinkContainer to='/admin/orderlist'>
                <Button variant='info'>Go to Orders</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className='mb-3'>
          <Card className='shadow-sm h-100'>
            <Card.Body>
              <Card.Title><i className='fas fa-chart-line mr-2'></i> Sales & Profit Management</Card.Title>
              <Card.Text>
                Track revenue, profit margins, and sales analytics
                with comprehensive reporting tools
              </Card.Text>
              <LinkContainer to='/admin/sales-profit'>
                <Button variant='warning'>Go to Analytics</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AdminDashboardScreen
