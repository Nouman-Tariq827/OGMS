import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Form, Button, Row, Col, Card, Table } from 'react-bootstrap'
import axios from 'axios'
import { listCatalogueDetails, updateCatalogue, createCatalogue } from '../actions/catalogueActions'
import { listProducts } from '../actions/productActions'
import { CATALOGUE_UPDATE_RESET, CATALOGUE_CREATE_RESET } from '../constants/catalogueConstants'
import Loader from '../components/Loader'
import Message from '../components/Message'

const CatalogueEditScreen = () => {
  const params = useParams()
  const history = useHistory()
  const catalogueId = params.id

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])

  const dispatch = useDispatch()

  const catalogueDetails = useSelector((state) => state.catalogueDetails)
  const { loading, error, catalogue } = catalogueDetails

  const catalogueUpdate = useSelector((state) => state.catalogueUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = catalogueUpdate

  const catalogueCreate = useSelector((state) => state.catalogueCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = catalogueCreate

  const productList = useSelector((state) => state.productList)
  const { products } = productList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: CATALOGUE_UPDATE_RESET })
      history.push('/admin/catalogues')
    }
    if (successCreate) {
      dispatch({ type: CATALOGUE_CREATE_RESET })
      history.push('/admin/catalogues')
    }
    if (catalogueId) {
      if (!catalogue || !catalogue.name || catalogue._id !== catalogueId) {
        dispatch(listCatalogueDetails(catalogueId))
      } else {
        setName(catalogue.name)
        setDescription(catalogue.description)
        setImage(catalogue.image)
        setIsActive(catalogue.isActive)
        setSelectedProducts(catalogue.products.map(p => p._id))
      }
    }
    dispatch(listProducts('', 1))
  }, [dispatch, history, catalogueId, catalogue, successUpdate, successCreate])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)

      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    if (catalogueId) {
      dispatch(
        updateCatalogue({
          _id: catalogueId,
          name,
          description,
          image,
          products: selectedProducts,
          isActive,
        })
      )
    } else {
      dispatch(
        createCatalogue({
          name,
          description,
          image,
          products: selectedProducts,
          isActive,
        })
      )
    }
  }

  const toggleProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  return (
    <>
      <Link to='/admin/catalogues' className='btn btn-light my-3'>
        Go Back
      </Link>
      <Row>
        <Col md={8}>
          <h1>{catalogueId ? 'Edit Catalogue' : 'Create Catalogue'}</h1>
          {loadingUpdate && <Loader />}
          {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
          {loadingCreate && <Loader />}
          {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
          
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='description'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={3}
                  placeholder='Enter description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='image'>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter image url'
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                ></Form.Control>
                <Form.File
                  id='image-file'
                  label='Choose File'
                  custom
                  onChange={uploadFileHandler}
                ></Form.File>
                {uploading && <Loader />}
              </Form.Group>

              <Form.Group controlId='isActive'>
                <Form.Check
                  type='checkbox'
                  label='Active'
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                ></Form.Check>
              </Form.Group>

              <Button type='submit' variant='primary'>
                {catalogueId ? 'Update' : 'Create'}
              </Button>
            </Form>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Select Products</Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflow: 'auto' }}>
              {products && products.length > 0 ? (
                <Table striped bordered hover responsive className='table-sm'>
                  <thead>
                    <tr>
                      <th>Include</th>
                      <th>Product</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <Form.Check
                            type='checkbox'
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => toggleProduct(product._id)}
                          />
                        </td>
                        <td>{product.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Message>No products available</Message>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CatalogueEditScreen
