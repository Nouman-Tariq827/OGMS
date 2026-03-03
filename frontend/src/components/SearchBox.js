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
      setKeyword('') // Clear the search bar after search
    } else {
      if (userInfo && userInfo.isAdmin) {
        history.push('/admin/productlist')
      } else {
        history.push('/')
      }
    }
  }

  return (
    <Form onSubmit={submitHandler} inline className='search-form position-relative'>
      <i className='fas fa-search position-absolute text-muted' style={{ left: '15px', zIndex: 10 }}></i>
      <Form.Control
        type='text'
        name='q'
        value={keyword} // Bind value to state to allow clearing
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search for products, brands and more...'
        className='search-input pl-5'
      />
    </Form>
  )
}

export default SearchBox

