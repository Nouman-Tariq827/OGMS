import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import SearchBox from './SearchBox'
import FilterModal from './FilterModal'
import { logout } from '../actions/userActions'
import { FaBars, FaTimes } from 'react-icons/fa'

const categories = [
  'Hair Care',
  'Skin Care', 
  'Tea and Coffee',
  'House Cleaning',
  'Dairy',
  'Snacks & Beverages',
  'Oil and Ghee',
  'Fruits and Vegetables',
  'Meat',
  'Pulses and Beans',
  'Toothpaste'
]

const Header = () => {
  const dispatch = useDispatch()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }

  const handleCategoryClick = (category) => {
    // Navigate to category products page
    window.location.href = `/category/${category}`
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

            {/* Search Bar - Center (Increased Width & Offset Left) - hidden on mobile */}
            <div className='search-container d-none d-md-block' style={{ flex: '1.45', maxWidth: '500px', marginRight: 'auto', marginLeft: '2rem' }}>
              <Route render={({ history }) => <SearchBox history={history} />} />
            </div>

            {/* User Icons - Far Right - hidden on mobile */}
            <div className='header-icons d-none d-md-flex align-items-center justify-content-end' style={{ flex: '1' }}>
              {!(userInfo && userInfo.isAdmin) && (
                <LinkContainer to='/filter' className='mx-3 text-dark text-decoration-none'>
                  <div className='text-center cursor-pointer header-icon-box'>
                    <i className='fas fa-filter fa-lg mb-1 d-block'></i>
                    <small className='font-weight-bold'>Filter</small>
                  </div>
                </LinkContainer>
              )}
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
            {/* Hamburger Button - Mobile Only */}
            <div className='d-md-none'>
              <button
                className='hamburger-btn'
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label='Toggle menu'
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </Container>
      </div>
      <FilterModal show={isFilterOpen} handleClose={() => setIsFilterOpen(false)} />

      {/* Mobile Menu */}
      <div className={`mobile-menu-container ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className='mobile-menu-content'>
          {/* Search */}
          <div className='mobile-search-wrapper px-3 py-2'>
            <Route render={({ history }) => <SearchBox history={history} />} />
          </div>

          <hr className='my-1 mx-3' />

          {/* Nav Links */}
          <div className='mobile-nav-links'>
            {userInfo && userInfo.isAdmin ? (
              <>
                <LinkContainer to='/admin/userlist'>
                  <div className='mobile-nav-item' onClick={() => setMobileMenuOpen(false)}>Users</div>
                </LinkContainer>
                <LinkContainer to='/admin/productlist'>
                  <div className='mobile-nav-item' onClick={() => setMobileMenuOpen(false)}>Products</div>
                </LinkContainer>
                <LinkContainer to='/admin/catalogues'>
                  <div className='mobile-nav-item' onClick={() => setMobileMenuOpen(false)}>Catalogues</div>
                </LinkContainer>
                <LinkContainer to='/admin/orderlist'>
                  <div className='mobile-nav-item' onClick={() => setMobileMenuOpen(false)}>Orders</div>
                </LinkContainer>
                <LinkContainer to='/admin/sales-profit'>
                  <div className='mobile-nav-item' onClick={() => setMobileMenuOpen(false)}>Sales & Stock Management</div>
                </LinkContainer>
                <LinkContainer to='/admin/dashboard'>
                  <div className='mobile-nav-item' onClick={() => setMobileMenuOpen(false)}>
                    <i className='fas fa-tachometer-alt mr-2'></i>Dashboard
                  </div>
                </LinkContainer>
              </>
            ) : (
              <>
                <LinkContainer to='/' exact>
                  <div className='mobile-nav-item' onClick={() => setMobileMenuOpen(false)}>Home</div>
                </LinkContainer>
                <LinkContainer to='/catalogues'>
                  <div className='mobile-nav-item' onClick={() => setMobileMenuOpen(false)}>Catalogues</div>
                </LinkContainer>
                <div
                  className='mobile-nav-item'
                  onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                >
                  <span>Categories</span>
                  <span className={`mobile-arrow ${mobileCategoriesOpen ? 'open' : ''}`}>
                    <i className='fas fa-chevron-down'></i>
                  </span>
                </div>
                {mobileCategoriesOpen && (
                  <div className='mobile-category-sublist'>
                    {categories.map((category) => (
                      <div
                        key={category}
                        className='mobile-nav-item mobile-category-item'
                        onClick={() => {
                          window.location.href = `/category/${category}`
                          setMobileMenuOpen(false)
                          setMobileCategoriesOpen(false)
                        }}
                      >
                        <span className='category-indent'>{category}</span>
                      </div>
                    ))}
                  </div>
                )}
                <LinkContainer to='/about'>
                  <div className='mobile-nav-item' onClick={() => setMobileMenuOpen(false)}>About Us</div>
                </LinkContainer>
                <LinkContainer to='/contact'>
                  <div className='mobile-nav-item' onClick={() => setMobileMenuOpen(false)}>Contact Us</div>
                </LinkContainer>
              </>
            )}
          </div>

          <hr className='my-1 mx-3' />

          {/* Filter & Cart (non-admin only) */}
          {!(userInfo && userInfo.isAdmin) && (
            <div className='mobile-action-items'>
              <LinkContainer to='/filter'>
                <div className='mobile-nav-item' onClick={() => setMobileMenuOpen(false)}>
                  <i className='fas fa-filter mr-2'></i>Filter
                </div>
              </LinkContainer>
              <LinkContainer to='/cart'>
                <div className='mobile-nav-item' onClick={() => setMobileMenuOpen(false)}>
                  <i className='fas fa-shopping-cart mr-2'></i>Cart
                </div>
              </LinkContainer>
            </div>
          )}

          <hr className='my-1 mx-3' />

          {/* User / Sign In */}
          <div className='mobile-action-items'>
            {userInfo ? (
              <>
                <LinkContainer to='/profile'>
                  <div className='mobile-nav-item' onClick={() => setMobileMenuOpen(false)}>
                    <i className='fas fa-user mr-2'></i>{userInfo.name}
                  </div>
                </LinkContainer>
                <div
                  className='mobile-nav-item'
                  onClick={() => {
                    dispatch(logout())
                    setMobileMenuOpen(false)
                  }}
                >
                  <i className='fas fa-sign-out-alt mr-2'></i>Logout
                </div>
              </>
            ) : (
              <LinkContainer to='/login'>
                <div className='mobile-nav-item' onClick={() => setMobileMenuOpen(false)}>
                  <i className='fas fa-sign-in-alt mr-2'></i>Sign In / Register
                </div>
              </LinkContainer>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Navigation Links - hidden on mobile */}
      <Navbar bg='white' variant='light' expand='lg' className='py-0 shadow-sm nav-secondary-bar d-none d-md-block'>
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
                  <LinkContainer to='/admin/catalogues'>
                    <Nav.Link className='nav-item-link'>Catalogues</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <Nav.Link className='nav-item-link'>Orders</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/admin/sales-profit'>
                    <Nav.Link className='nav-item-link'>Sales & Stock Management</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/admin/dashboard'>
                    <Nav.Link className='nav-item-link text-info'><i className='fas fa-tachometer-alt mr-1'></i> Dashboard</Nav.Link>
                  </LinkContainer>
                </>
              ) : (
                <>
                  <LinkContainer to='/' exact>
                    <Nav.Link className='nav-item-link'>Home</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/catalogues'>
                    <Nav.Link className='nav-item-link'>Catalogues</Nav.Link>
                  </LinkContainer>
                  <NavDropdown 
                    title="Categories"
                    id='categories-dropdown'
                    show={isDropdownOpen}
                    onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {categories.map((category, index) => (
                      <NavDropdown.Item 
                        key={index}
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                  <LinkContainer to='/about'>
                    <Nav.Link className='nav-item-link'>About Us</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/contact'>
                    <Nav.Link className='nav-item-link'>Contact Us</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </div>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
