import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table, Button, Row, Col, Modal } from 'react-bootstrap'
import { listAdminCatalogues, deleteCatalogue } from '../actions/catalogueActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

const CatalogueListScreen = ({ history }) => {
  const dispatch = useDispatch()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [catalogueToDelete, setCatalogueToDelete] = useState(null)

  const catalogueList = useSelector((state) => state.catalogueList)
  const { loading, error, catalogues } = catalogueList

  const catalogueDelete = useSelector((state) => state.catalogueDelete)
  const { loading: loadingDelete, error: errorDelete, success } = catalogueDelete

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listAdminCatalogues())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo, success])

  const deleteHandler = (id) => {
    setCatalogueToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    dispatch(deleteCatalogue(catalogueToDelete))
    setShowDeleteModal(false)
    setCatalogueToDelete(null)
  }

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Catalogues</h1>
        </Col>
        <Col className='text-right'>
          <Link to='/admin/catalogue/create'>
            <Button className='my-3'>
              <i className='fas fa-plus'></i> Create Catalogue
            </Button>
          </Link>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>DESCRIPTION</th>
                <th>PRODUCTS</th>
                <th>ACTIVE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {catalogues.map((catalogue) => (
                <tr key={catalogue._id}>
                  <td>{catalogue._id.substring(0, 8)}...</td>
                  <td>{catalogue.name}</td>
                  <td>{catalogue.description.substring(0, 50)}...</td>
                  <td>{catalogue.products.length}</td>
                  <td>
                    {catalogue.isActive ? (
                      <span className='badge bg-success'>Active</span>
                    ) : (
                      <span className='badge bg-danger'>Inactive</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/admin/catalogue/${catalogue._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </Link>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(catalogue._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this catalogue?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant='danger' onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CatalogueListScreen
