import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'

const LoginScreen = ({ location, history }) => {
  // 1. Component State to keep track of user input
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  // 2. Access login information from the Redux global state
  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  // 3. Find out where the user should go after logging in
  const redirect = location.search ? location.search.split('=')[1] : '/'

  // 4. This effect runs when 'userInfo' or 'redirect' changes
  useEffect(() => {
    // If the user is already logged in, redirect them immediately
    if (userInfo) {
      if (redirect === '/') {
        // Redirect based on user role (Admin vs Regular User)
        if (userInfo.isAdmin) {
          history.push('/admin/dashboard')
        } else {
          history.push('/user/dashboard')
        }
      } else {
        // Redirect to a specific page if requested (e.g., /shipping)
        history.push(redirect)
      }
    }
  }, [history, userInfo, redirect])

  // 5. This runs when the "Sign In" button is clicked
  const submitHandler = (e) => {
    e.preventDefault() // Prevent the page from refreshing
    // Dispatch the 'login' action to the backend
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {/* Show an error alert if login fails */}
      {error && <Message variant='danger'>{error}</Message>}
      {/* Show a spinner while logging in */}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update 'email' state on change
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update 'password' state on change
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mr-3'>
          Sign In
        </Button>
        <Link to='/forgotpassword'>Forgot Password?</Link>
      </Form>

      {/* Link to the Registration page for new users */}
      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen

