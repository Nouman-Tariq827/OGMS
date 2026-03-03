import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Rating from './Rating'

const Product = ({ product }) => {
  const history = useHistory()
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const addToCartHandler = () => {
    if (!userInfo) {
      // If user is not logged in, prompt to register/login
      if (window.confirm('Please Sign In or Register to add items to your cart.')) {
        history.push('/login?redirect=/')
      }
    } else {
      // If logged in, proceed to cart
      history.push(`/cart/${product._id}?qty=1`)
    }
  }

  return (
    <Card className='my-3 p-3 rounded shadow-sm h-100 product-card'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>

      <Card.Body className='d-flex flex-column'>
        <Link to={`/product/${product._id}`} className='text-decoration-none'>
          <Card.Title as='div' className='product-title mb-2'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div' className='mb-2'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <div className='mt-auto'>
          <Card.Text as='h4' className='mb-3 font-weight-bold'>
            Rs {product.price}
          </Card.Text>

          <Button
            onClick={addToCartHandler}
            className='btn-block btn-premium-cart'
            disabled={product.countInStock === 0}
          >
            {product.countInStock > 0 ? (
              <>
                <i className='fas fa-shopping-cart'></i> Add Cart
              </>
            ) : (
              'Out of Stock'
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default Product

