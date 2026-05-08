import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Card, Button, Table, Form, Tabs, Tab, Alert } from 'react-bootstrap'
import { listOrders } from '../actions/orderActions'
import axios from 'axios'
import Message from '../components/Message'
import Loader from '../components/Loader'

const SalesProfitScreen = ({ history }) => {
  const dispatch = useDispatch()
  const [dateFilter, setDateFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [key, setKey] = useState('sales')
  const [salesReport, setSalesReport] = useState(null)
  const [stockReport, setStockReport] = useState(null)
  const [loadingSales, setLoadingSales] = useState(false)
  const [loadingStock, setLoadingStock] = useState(false)
  const [errorSales, setErrorSales] = useState(null)
  const [errorStock, setErrorStock] = useState(null)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const fetchSalesReport = async () => {
    setLoadingSales(true)
    setErrorSales(null)
    try {
      let query = ''
      if (dateFilter !== 'all') {
        query += `period=${dateFilter}`
      } else if (startDate && endDate) {
        query += `startDate=${startDate}&endDate=${endDate}`
      }
      
      const { data } = await axios.get(`/api/products/reports/sales?${query}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      })
      setSalesReport(data)
    } catch (error) {
      console.error('Sales Report Error:', error)
      setErrorSales(error.response?.data?.message || error.message)
    } finally {
      setLoadingSales(false)
    }
  }

  const fetchStockReport = async () => {
    setLoadingStock(true)
    setErrorStock(null)
    try {
      const { data } = await axios.get('/api/products/reports/stock', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      })
      setStockReport(data)
    } catch (error) {
      console.error('Stock Report Error:', error)
      setErrorStock(error.response?.data?.message || error.message)
    } finally {
      setLoadingStock(false)
    }
  }

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    } else {
      fetchSalesReport()
      fetchStockReport()
      dispatch(listOrders())
    }
  }, [dispatch, history, userInfo, dateFilter, startDate, endDate])
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount)
  }

  return (
    <>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h1 className='mb-0'><i className='fas fa-chart-line mr-2'></i> Sales & Stock Management</h1>
        <Button variant='outline-primary' onClick={() => {
          fetchSalesReport()
          fetchStockReport()
          dispatch(listOrders())
        }}>
          <i className='fas fa-sync-alt mr-2'></i> Refresh Data
        </Button>
      </div>

      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className='mb-4' style={{ marginBottom: '2rem' }}>
        <Tab eventKey="sales" title={
          <span style={{ 
            padding: '8px 16px', 
            borderRadius: '8px',
            backgroundColor: key === 'sales' ? '#28a745' : '#e9ecef',
            color: key === 'sales' ? '#ffffff' : '#495057',
            fontWeight: '600',
            display: 'inline-block',
            marginRight: '8px',
            border: key === 'sales' ? '2px solid #28a745' : '2px solid #ced4da',
            transition: 'all 0.3s ease'
          }}>
            <i className='fas fa-chart-line mr-2'></i>
            Sales Reports
          </span>
        }>
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

          {loadingSales ? (
            <Loader />
          ) : errorSales ? (
            <Message variant='danger'>{errorSales}</Message>
          ) : salesReport ? (
            <>
              {/* Metrics Cards */}
              <Row className='mb-4'>
                <Col md={3} className='mb-3'>
                  <Card className='shadow-sm h-100 bg-primary text-white'>
                    <Card.Body>
                      <Card.Title><i className='fas fa-dollar-sign mr-2'></i>Total Revenue</Card.Title>
                      <h2 className='mb-0 text-white'>{formatCurrency(salesReport.totalRevenue)}</h2>
                      <small>From all orders</small>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={3} className='mb-3'>
                  <Card className='shadow-sm h-100 bg-success text-white'>
                    <Card.Body>
                      <Card.Title><i className='fas fa-chart-pie mr-2'></i>Estimated Profit</Card.Title>
                      <h2 className='mb-0'>{formatCurrency(salesReport.profit)}</h2>
                      <small>~30% margin</small>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={3} className='mb-3'>
                  <Card className='shadow-sm h-100 bg-info text-white'>
                    <Card.Body>
                      <Card.Title><i className='fas fa-shopping-cart mr-2'></i>Total Orders</Card.Title>
                      <h2 className='mb-0'>{salesReport.totalOrders}</h2>
                      <small>{salesReport.deliveredOrders} delivered, {salesReport.pendingOrders} pending</small>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={3} className='mb-3'>
                  <Card className='shadow-sm h-100 bg-warning text-white'>
                    <Card.Body>
                      <Card.Title><i className='fas fa-calculator mr-2'></i>Avg Order Value</Card.Title>
                      <h2 className='mb-0'>{formatCurrency(salesReport.averageOrderValue)}</h2>
                      <small>Per order</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Best Selling Products */}
              {salesReport.bestSellingProducts && salesReport.bestSellingProducts.length > 0 && (
                <Card className='mb-4'>
                  <Card.Body>
                    <Card.Title><i className='fas fa-trophy mr-2'></i>Best Selling Products</Card.Title>
                    <Table striped bordered hover responsive className='table-sm'>
                      <thead>
                        <tr>
                          <th>PRODUCT</th>
                          <th>QUANTITY SOLD</th>
                          <th>REVENUE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesReport.bestSellingProducts.map((product, index) => (
                          <tr key={product.productId}>
                            <td>
                              <strong>#{index + 1}</strong> {product.name}
                            </td>
                            <td>{product.quantity}</td>
                            <td>{formatCurrency(product.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
            </>
          ) : null}
        </Tab>

        <Tab eventKey="stock" title={
          <span style={{ 
            padding: '8px 16px', 
            borderRadius: '8px',
            backgroundColor: key === 'stock' ? '#28a745' : '#e9ecef',
            color: key === 'stock' ? '#ffffff' : '#495057',
            fontWeight: '600',
            display: 'inline-block',
            marginLeft: '8px',
            border: key === 'stock' ? '2px solid #28a745' : '2px solid #ced4da',
            transition: 'all 0.3s ease'
          }}>
            <i className='fas fa-boxes mr-2'></i>
            Stock Reports
          </span>
        }>
          {loadingStock ? (
            <Loader />
          ) : errorStock ? (
            <Message variant='danger'>{errorStock}</Message>
          ) : stockReport ? (
            <>
              {/* Stock Metrics Cards */}
              <Row className='mb-4'>
                <Col md={3} className='mb-3'>
                  <Card className='shadow-sm h-100 bg-primary text-white'>
                    <Card.Body>
                      <Card.Title><i className='fas fa-boxes mr-2'></i>Total Products</Card.Title>
                      <h2 className='mb-0 text-white'>{stockReport.totalProducts}</h2>
                      <small>All products in inventory</small>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={3} className='mb-3'>
                  <Card className='shadow-sm h-100 bg-success text-white'>
                    <Card.Body>
                      <Card.Title><i className='fas fa-check-circle mr-2'></i>In Stock</Card.Title>
                      <h2 className='mb-0'>{stockReport.inStockProducts}</h2>
                      <small>Available products</small>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={3} className='mb-3'>
                  <Card className='shadow-sm h-100 bg-warning text-white'>
                    <Card.Body>
                      <Card.Title>
                        <i className='fas fa-exclamation-triangle mr-2'></i>
                        Low Stock
                      </Card.Title>
                      <h2 className='mb-0 text-white'>{stockReport.lowStockProducts || 0}</h2>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={3} className='mb-3'>
                  <Card className='shadow-sm h-100 bg-danger text-white'>
                    <Card.Body>
                      <Card.Title><i className='fas fa-times-circle mr-2'></i>Out of Stock</Card.Title>
                      <h2 className='mb-0'>{stockReport.outOfStockProducts || 0}</h2>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className='mb-4'>
                <Col md={6} className='mb-3'>
                  <Card className='shadow-sm h-100'>
                    <Card.Body>
                      <Card.Title><i className='fas fa-warehouse mr-2'></i>Total Stock Value</Card.Title>
                      <h2 className='text-primary'>{formatCurrency(stockReport.stockValue)}</h2>
                      <small>Total inventory value</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className='mb-3'>
                  <Card className='shadow-sm h-100'>
                    <Card.Body>
                      <Card.Title><i className='fas fa-cubes mr-2'></i>Total Items in Stock</Card.Title>
                      <h2 className='text-primary'>{stockReport.totalStock}</h2>
                      <small>Individual items across all products</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Low Stock Alert */}
              {(stockReport.lowStockProducts > 0 || stockReport.outOfStockProducts > 0) && (
                <Card className='mb-4 border-warning'>
                  <Card.Body>
                    <Card.Title className='text-warning'><i className='fas fa-exclamation-triangle mr-2'></i>Stock Alert</Card.Title>
                    <Alert variant='warning'>
                      Products requiring attention
                    </Alert>
                    <Table striped bordered hover responsive className='table-sm'>
                      <thead>
                        <tr>
                          <th>PRODUCT</th>
                          <th>CATEGORY</th>
                          <th>STOCK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockReport.lowStockProductsData && stockReport.lowStockProductsData.map((product) => (
                          <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td><strong className='text-warning'>{product.countInStock}</strong></td>
                          </tr>
                        ))}
                        {stockReport.outOfStockProductsData && stockReport.outOfStockProductsData.map((product) => (
                          <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td><strong className='text-danger'>0</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}

              {/* Out of Stock Alert */}
              {stockReport.outOfStockProducts.length > 0 && (
                <Card className='mb-4 border-danger'>
                  <Card.Body>
                    <Card.Title className='text-danger'><i className='fas fa-times-circle mr-2'></i>Out of Stock</Card.Title>
                    <Alert variant='danger'>
                      {stockReport.outOfStockProducts.length} products are completely out of stock
                    </Alert>
                    <Table striped bordered hover responsive className='table-sm'>
                      <thead>
                        <tr>
                          <th>PRODUCT</th>
                          <th>CATEGORY</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockReport.outOfStockProducts.map((product) => (
                          <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}

              {/* Stock by Products */}
              <Card className='mb-4'>
                <Card.Body>
                  <Card.Title><i className='fas fa-boxes mr-2'></i>Stock by Products</Card.Title>
                  <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                      <tr>
                        <th>PRODUCT</th>
                        <th>CATEGORY</th>
                        <th>STOCK</th>
                        <th>VALUE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockReport.allProducts && stockReport.allProducts.map((product) => {
                        const isLowStock = product.countInStock > 0 && product.countInStock <= 10;
                        const isOutOfStock = product.countInStock === 0;
                        
                        return (
                          <tr 
                            key={product._id} 
                            style={{ 
                              backgroundColor: isOutOfStock ? '#f8d7da' : isLowStock ? '#fff3cd' : 'transparent'
                            }}
                          >
                            <td>
                              {isOutOfStock && <i className='fas fa-times-circle text-danger mr-2'></i>}
                              {isLowStock && <i className='fas fa-exclamation-triangle text-warning mr-2'></i>}
                              {!isOutOfStock && !isLowStock && <i className='fas fa-check-circle text-success mr-2'></i>}
                              {product.name}
                            </td>
                            <td>{product.category}</td>
                            <td>
                              {isOutOfStock ? (
                                <strong className='text-danger'>0</strong>
                              ) : isLowStock ? (
                                <strong className='text-warning'>{product.countInStock}</strong>
                              ) : (
                                <strong className='text-success'>{product.countInStock}</strong>
                              )}
                            </td>
                            <td>{formatCurrency(product.countInStock * product.price)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
          ) : null}
        </Tab>
      </Tabs>
    </>
  )
}

export default SalesProfitScreen
