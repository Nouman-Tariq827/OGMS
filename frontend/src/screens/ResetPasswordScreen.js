import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { resetPassword } from '../actions/userActions'

const ResetPasswordScreen = ({ match, history }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const token = match.params.token

  const dispatch = useDispatch()

  const userResetPassword = useSelector((state) => state.userResetPassword)
  const { loading, error, success } = userResetPassword

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        history.push('/login')
      }, 3000)
    }
  }, [history, success])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(resetPassword(token, password))
    }
  }

  return (
    <FormContainer>
      <h1>Reset Password</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {success && (
        <Message variant='success'>
          Password reset successful! Redirecting to login in 3 seconds...
        </Message>
      )}
      {loading && <Loader />}

      {!success && (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='password'>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter new password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='confirmPassword'>
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm new password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='mt-3'>
            Reset Password
          </Button>
        </Form>
      )}
    </FormContainer>
  )
}

export default ResetPasswordScreen
