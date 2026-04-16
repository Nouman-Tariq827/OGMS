import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Card, Button, Table, Form } from 'react-bootstrap'
import { listOrders } from '../actions/orderActions'
import Message from '../components/Message'
import Loader from '../components/Loader'

const SalesProfitScreen = ({ history }) => {
  const dispatch = useDispatch()
  const [dateFilter, setDateFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const orderList = useSelector((state) => state.orderList)
  const { loading, error, orders } = orderList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    } else {
      dispatch(listOrders())
    }
  }, [dispatch, history, userInfo])

  // Auto-refresh orders periodically to get latest data
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(listOrders())
    }, 30000) // Refresh every 30 seconds
    
    return () => clearInterval(interval)
  }, [dispatch])

  // Calculate sales and profit metrics
  const calculateMetrics = () => {
    if (!orders) return {
      totalRevenue: 0,
      totalOrders: 0,
      deliveredOrders: 0,
      pendingOrders: 0,
      averageOrderValue: 0,
      profit: 0
    }

    const filteredOrders = filterOrdersByDate(orders)
    const delivered = filteredOrders.filter(order => order.isDelivered)
    const pending = filteredOrders.filter(order => !order.isDelivered)

    // Total revenue from ALL orders (both delivered and pending)
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0)
    const totalOrders = filteredOrders.length
    const deliveredOrders = delivered.length
    const pendingOrders = pending.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    // Assuming 30% profit margin on delivered orders only
    const deliveredRevenue = delivered.reduce((sum, order) => sum + order.totalPrice, 0)
    const profit = deliveredRevenue * 0.3

    return {
      totalRevenue,
      totalOrders,
      deliveredOrders,
      pendingOrders,
      averageOrderValue,
      profit
    }
  }

  const filterOrdersByDate = (orders) => {
    if (!orders) return []
    
    const now = new Date()
    let filteredOrders = orders
    
    if (dateFilter === 'all') {
      filteredOrders = orders
    } else if (dateFilter === 'today') {
      // Show orders delivered today (more inclusive) - handle timezone issues
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Start of day
      today.setHours(23, 59, 59, 999) // End of day
      filteredOrders = orders.filter(order => {
        const deliveredDate = order.isDelivered ? new Date(order.deliveredAt) : null
        if (deliveredDate) {
          const deliveredDateOnly = new Date(deliveredDate.getFullYear(), deliveredDate.getMonth(), deliveredDate.getDate())
          const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
          return deliveredDateOnly.getTime() >= todayOnly.getTime() && deliveredDateOnly.getTime() <= todayOnly.getTime() + 24 * 60 * 60 * 1000
        }
        return false
      })
      console.log('Today filter - Orders found:', filteredOrders.length, 'Total orders:', orders.length)
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredOrders = orders.filter(order => {
        const deliveredDate = order.isDelivered ? new Date(order.deliveredAt) : null
        if (deliveredDate) {
          return deliveredDate >= weekAgo
        }
        return false
        const orderDate = new Date(order.createdAt)
        return orderDate >= weekAgo
      })
      console.log('Week filter - Orders found:', filteredOrders.length, 'Total orders:', orders.length)
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= monthAgo
      })
    } else if (dateFilter === 'custom') {
      if (startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        filteredOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt)
          return orderDate >= start && orderDate <= end
        })
      } else {
        filteredOrders = orders
      }
    } else {
      filteredOrders = orders
    }
    
    // Sort by date (most recent first)
    return filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const metrics = calculateMetrics()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h1 className='mb-0'><i className='fas fa-chart-line mr-2'></i> Sales & Profit Management</h1>
        <Button variant='outline-primary' onClick={() => dispatch(listOrders())}>
          <i className='fas fa-sync-alt mr-2'></i> Refresh Data
        </Button>
      </div>

      {/* Date Filter */}
      <Card className='mb-4'>
        <Card.Body>
          <Card.Title><i className='fas fa-filter mr-2'></i>Filter by Date</Card.Title>
          <Row className='align-items-end'>
            <Col md={3}>
              <Form.Group controlId='dateFilter'>
                <Form.Label>Period</Form.Label>
                <Form.Control 
                  as='select' 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value='all'>All Time</option>
                  <option value='today'>Today</option>
                  <option value='week'>Last 7 Days</option>
                  <option value='month'>Last 30 Days</option>
                  <option value='custom'>Custom Range</option>
                </Form.Control>
              </Form.Group>
            </Col>
            {dateFilter === 'custom' && (
              <>
                <Col md={3}>
                  <Form.Group controlId='startDate'>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control 
                      type='date' 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId='endDate'>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control 
                      type='date' 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Metrics Cards */}
      <Row className='mb-4'>
        <Col md={3} className='mb-3'>
          <Card className='shadow-sm h-100 bg-primary text-white'>
            <Card.Body>
              <Card.Title><i className='fas fa-dollar-sign mr-2'></i>Total Revenue</Card.Title>
              <h2 className='mb-0'>{formatCurrency(metrics.totalRevenue)}</h2>
              <small>From all orders (delivered + pending)</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className='mb-3'>
          <Card className='shadow-sm h-100 bg-success text-white'>
            <Card.Body>
              <Card.Title><i className='fas fa-chart-pie mr-2'></i>Estimated Profit</Card.Title>
              <h2 className='mb-0'>{formatCurrency(metrics.profit)}</h2>
              <small>~30% margin</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className='mb-3'>
          <Card className='shadow-sm h-100 bg-info text-white'>
            <Card.Body>
              <Card.Title><i className='fas fa-shopping-cart mr-2'></i>Total Orders</Card.Title>
              <h2 className='mb-0'>{metrics.totalOrders}</h2>
              <small>{metrics.deliveredOrders} delivered, {metrics.pendingOrders} pending</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className='mb-3'>
          <Card className='shadow-sm h-100 bg-warning text-white'>
            <Card.Body>
              <Card.Title><i className='fas fa-calculator mr-2'></i>Avg Order Value</Card.Title>
              <h2 className='mb-0'>{formatCurrency(metrics.averageOrderValue)}</h2>
              <small>Per delivered order</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Table */}
      <Card>
        <Card.Body>
          <Card.Title><i className='fas fa-list mr-2'></i>Recent Orders</Card.Title>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : (
            <Table striped bordered hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>ORDER PLACED DATE</th>
                  <th>CUSTOMER</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                  <th>DELIVERED DATE</th>
                </tr>
              </thead>
              <tbody>
                {filterOrdersByDate(orders).slice(0, 50).map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.user ? order.user.name : 'N/A'}</td>
                    <td>{formatCurrency(order.totalPrice)}</td>
                    <td>
                      {order.isDelivered ? (
                        <span className='badge bg-success'>Delivered</span>
                      ) : (
                        <span className='badge bg-warning'>Pending</span>
                      )}
                    </td>
                    <td>{order.isDelivered ? formatDate(order.deliveredAt) : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </>
  )
}

export default SalesProfitScreen
