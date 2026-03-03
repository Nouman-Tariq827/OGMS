import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { forgotPassword } from '../actions/userActions'

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('')

  const dispatch = useDispatch()

  const userForgotPassword = useSelector((state) => state.userForgotPassword)
  const { loading, error, success, message } = userForgotPassword

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(forgotPassword(email))
  }

  return (
    <FormContainer>
      <h1>Forgot Password</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {success && <Message variant='success'>{message}</Message>}
      {loading && <Loader />}
      
      {!success && (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='mt-3'>
            Send Reset Link
          </Button>
        </Form>
      )}
    </FormContainer>
  )
}

export default ForgotPasswordScreen
