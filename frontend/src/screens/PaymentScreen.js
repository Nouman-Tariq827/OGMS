import React, { useState } from 'react'
import { Form, Button, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'
import { getEnabledPaymentMethods, getDefaultPaymentMethod } from '../config/paymentMethods'

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  if (!shippingAddress) {
    history.push('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState(getDefaultPaymentMethod())

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history.push('/placeorder')
  }

  const enabledPaymentMethods = getEnabledPaymentMethods()

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            {enabledPaymentMethods.map((method) => (
              <Card className="mb-3" key={method.id}>
                <Card.Body>
                  <Form.Check
                    type='radio'
                    label={
                      <div>
                        <strong>
                          <i className={`${method.icon} mr-2`}></i>
                          {method.name}
                        </strong>
                        <br />
                        <small className="text-muted">{method.description}</small>
                      </div>
                    }
                    id={method.id}
                    name='paymentMethod'
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  ></Form.Check>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen

