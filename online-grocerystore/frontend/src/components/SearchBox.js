import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('')
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      if (userInfo && userInfo.isAdmin) {
        history.push(`/admin/productlist?keyword=${encodeURIComponent(keyword)}`)
      } else {
        history.push(`/search/${keyword}`)
      }
    } else {
      if (userInfo && userInfo.isAdmin) {
        history.push('/admin/productlist')
      } else {
        history.push('/')
      }
    }
  }

  return (
    <Form onSubmit={submitHandler} inline className='search-form'>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search products…'
        className='search-input mr-sm-2 ml-sm-5'
      />
      <Button type='submit' variant='success' className='search-button'>
        Search
      </Button>
    </Form>
  )
}

export default SearchBox

