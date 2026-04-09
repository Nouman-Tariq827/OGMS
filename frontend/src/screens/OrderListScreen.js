import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listOrders, payOrder } from '../actions/orderActions'
import { ORDER_PAID_RESET } from '../constants/orderConstants'

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch()

  const orderList = useSelector((state) => state.orderList)
  const { loading, error, orders } = orderList

  const orderPaid = useSelector((state) => state.orderPaid)
  const { loading: loadingPaid, success: successPaid } = orderPaid

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo])

  useEffect(() => {
    if (successPaid) {
      dispatch({ type: ORDER_PAID_RESET })
      dispatch(listOrders())
    }
  }, [dispatch, successPaid])

  const payOrderHandler = (order) => {
    if (window.confirm('Are you sure you want to mark this order as paid?')) {
      dispatch(payOrder(order))
    }
  }

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{new Date(order.createdAt).toLocaleDateString('en-PK')}</td>
                <td>Rs {order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    <span className='badge bg-success'>
                      Paid on {new Date(order.paidAt).toLocaleDateString('en-PK')}
                    </span>
                  ) : (
                    <Button
                      variant='primary'
                      size='sm'
                      onClick={() => payOrderHandler(order)}
                      disabled={loadingPaid}
                    >
                      {loadingPaid ? 'Marking...' : 'Mark as Paid'}
                    </Button>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    new Date(order.deliveredAt).toLocaleDateString('en-PK')
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default OrderListScreen

