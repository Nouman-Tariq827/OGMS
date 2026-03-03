import React from 'react'
import { Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'

const Header = () => {
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <header>
      {/* Top Row: Logo, Search, and Icons */}
      <div className='bg-white py-3 border-bottom main-header'>
        <Container fluid className='px-md-5'>
          <div className='d-flex align-items-center justify-content-between'>
            {/* Logo - Far Left */}
            <div className='logo-container' style={{ flex: '1' }}>
              {userInfo ? (
                userInfo.isAdmin ? (
                  <LinkContainer to='/admin/dashboard'>
                    <Navbar.Brand className='font-weight-bold text-success m-0 brand-logo'>
                      <i className='fas fa-leaf mr-2'></i>
                      Online Grocery Store
                    </Navbar.Brand>
                  </LinkContainer>
                ) : (
                  <LinkContainer to='/user/dashboard'>
                    <Navbar.Brand className='font-weight-bold text-success m-0 brand-logo'>
                      <i className='fas fa-leaf mr-2'></i>
                      Online Grocery Store
                    </Navbar.Brand>
                  </LinkContainer>
                )
              ) : (
                <LinkContainer to='/'>
                  <Navbar.Brand className='font-weight-bold text-success m-0 brand-logo'>
                    <i className='fas fa-leaf mr-2'></i>
                    Online Grocery Store
                  </Navbar.Brand>
                </LinkContainer>
              )}
            </div>

            {/* Search Bar - Center (Increased Width & Offset Left) */}
            <div className='search-container' style={{ flex: '1.45', maxWidth: '500px', marginRight: 'auto', marginLeft: '2rem' }}>
              <Route render={({ history }) => <SearchBox history={history} />} />
            </div>

            {/* User Icons - Far Right */}
            <div className='header-icons d-flex align-items-center justify-content-end' style={{ flex: '1' }}>
              {!(userInfo && userInfo.isAdmin) && (
                <LinkContainer to='/cart' className='mx-3 text-dark text-decoration-none'>
                  <div className='text-center cursor-pointer header-icon-box'>
                    <i className='fas fa-shopping-cart fa-lg mb-1 d-block'></i>
                    <small className='font-weight-bold'>Cart</small>
                  </div>
                </LinkContainer>
              )}
              {userInfo ? (
                <NavDropdown 
                  title={
                    <div className='text-center d-inline-block text-dark header-icon-box'>
                      <i className='fas fa-user fa-lg mb-1 d-block'></i>
                      <small className='font-weight-bold'>{userInfo.name.split(' ')[0]}</small>
                    </div>
                  } 
                  id='username' 
                  className='no-caret'
                >
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login' className='mx-2 text-dark text-decoration-none'>
                  <div className='text-center cursor-pointer header-icon-box'>
                    <i className='fas fa-user-circle fa-lg mb-1 d-block'></i>
                    <small className='font-weight-bold'>Sign In</small>
                  </div>
                </LinkContainer>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Row: Navigation Links */}
      <Navbar bg='white' variant='light' expand='lg' className='py-0 shadow-sm nav-secondary-bar'>
        <Container fluid className='px-md-5'>
          <div className='d-flex align-items-center w-100'>
            <Nav className='mr-auto d-flex flex-row align-items-center'>
              {userInfo && userInfo.isAdmin ? (
                <>
                  <LinkContainer to='/admin/userlist'>
                    <Nav.Link className='nav-item-link'>Users</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <Nav.Link className='nav-item-link'>Products</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <Nav.Link className='nav-item-link'>Orders</Nav.Link>
                  </LinkContainer>
                </>
              ) : (
                <>
                  <LinkContainer to='/' exact>
                <Nav.Link className='nav-item-link'>Home</Nav.Link>
              </LinkContainer>
                  <LinkContainer to='/category'>
                    <Nav.Link className='nav-item-link'>Category</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/about'>
                    <Nav.Link className='nav-item-link'>About Us</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/contact'>
                    <Nav.Link className='nav-item-link'>Contact Us</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
            
            {userInfo && userInfo.isAdmin && (
              <Nav className='ml-auto'>
                <LinkContainer to='/admin/dashboard'>
                  <Nav.Link className='nav-item-link text-info'><i className='fas fa-tachometer-alt mr-1'></i> Dashboard</Nav.Link>
                </LinkContainer>
              </Nav>
            )}
          </div>
        </Container>
      </Navbar>
    </header>
  )
}
export default Header

