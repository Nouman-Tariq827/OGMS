import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'

const RegisterScreen = ({ location, history }) => {
  // 1. Component State to hold the registration form inputs
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cnic, setCnic] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [town, setTown] = useState('')
  const [region, setRegion] = useState('')
  const [postcode, setPostcode] = useState('')
  const [country, setCountry] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null) // State for form validation messages

  const dispatch = useDispatch()

  // 2. Get registration status from global store (Redux)
  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister

  // 3. Find out the redirect destination (default to home)
  const redirect = location.search ? location.search.split('=')[1] : '/'

  // 4. Redirect the user automatically if they are already logged in
  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  // 5. This function clears all input fields (Reset Button)
  const resetHandler = () => {
    setName('')
    setEmail('')
    setCnic('')
    setPhoneNumber('')
    setAddress('')
    setTown('')
    setRegion('')
    setPostcode('')
    setCountry('')
    setPassword('')
    setConfirmPassword('')
    setMessage(null)
  }

  // 6. This function handles the form submission (Register Button)
  const submitHandler = (e) => {
    e.preventDefault()
    // 6a. Basic validation to check if passwords match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      // 6b. Send all user data to the backend via Redux action
      dispatch(
        register({
          name,
          email,
          cnic,
          phoneNumber,
          address,
          town,
          region,
          postcode,
          country,
          password,
        })
      )
    }
  }

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {/* Show validation errors if passwords don't match */}
      {message && <Message variant='danger'>{message}</Message>}
      {/* Show server errors if registration fails */}
      {error && <Message variant='danger'>{error}</Message>}
      {/* Show a loading spinner during submission */}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        {/* Form is organized into Rows and Columns for better layout */}
        <Row>
          <Col md={6}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='cnic'>
              <Form.Label>CNIC</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter CNIC'
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
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
          </Col>
          <Col md={6}>
            <Form.Group controlId='phoneNumber'>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter phone number'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group controlId='town'>
              <Form.Label>Town</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter town'
                value={town}
                onChange={(e) => setTown(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='region'>
              <Form.Label>Region</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter region'
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId='postcode'>
              <Form.Label>Postcode/Zip</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter postcode'
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='country'>
              <Form.Label>Country</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter country'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Button type='submit' variant='primary' className='mr-2'>
          Register
        </Button>
        <Button type='button' variant='secondary' onClick={resetHandler}>
          Reset
        </Button>
      </Form>

      {/* Redirect back to Login page if already registered */}
      <Row className='py-3'>
        <Col>
          Have an Account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
