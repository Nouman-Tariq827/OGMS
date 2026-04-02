# Online Grocery Management System - Technical Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Frontend Architecture](#frontend-architecture)
6. [Backend Architecture](#backend-architecture)
7. [Authentication & Security](#authentication--security)
8. [Payment System](#payment-system)
9. [Key Features](#key-features)
10. [API Endpoints](#api-endpoints)
11. [State Management](#state-management)
12. [Deployment](#deployment)
13. [Code Structure](#code-structure)
14. [Viva Preparation Questions](#viva-preparation-questions)

---

## 🎯 Project Overview

### **Project Name**: Online Grocery Management System (OGMS)
### **Type**: Full-stack E-commerce Web Application
### **Purpose**: Digital grocery store with COD payment system
### **Target Users**: Customers, Admin, Delivery Personnel

### **Core Functionality:**
- 🛒 Product browsing and shopping cart
- 👤 User authentication and authorization
- 💳 Cash on Delivery (COD) payment system
- 📦 Order management and tracking
- 📊 Admin dashboard for product/order management
- 📱 Responsive design for all devices

---

## 🛠️ Technology Stack

### **Frontend Technologies**
```
React 17.0.2          - UI Library & Component Framework
React Router 5.2.0    - Client-side Routing
React Redux 7.2.1     - State Management
React Bootstrap 1.6.8  - UI Component Library
Redux Thunk 2.3.0      - Async Action Middleware
Axios 1.6.0           - HTTP Client for API Calls
```

### **Backend Technologies**
```
Node.js               - JavaScript Runtime Environment
Express 4.17.1        - Web Application Framework
MongoDB               - NoSQL Database
Mongoose 6.0.0        - MongoDB Object Modeling
JWT (jsonwebtoken)    - Authentication Tokens
bcryptjs              - Password Hashing
dotenv                - Environment Variables
```

### **Development Tools**
```
npm                   - Package Manager
Redux DevTools        - State Debugging
Git                   - Version Control
VS Code               - Code Editor
```

---

## 🏗️ Architecture

### **High-Level Architecture**
```
┌─────────────────┐    HTTP Requests    ┌─────────────────┐
│   React App     │ ◄──────────────────► │   Express API   │
│  (Frontend)     │                     │   (Backend)      │
└─────────────────┘                     └─────────────────┘
         │                                      │
         │                                      │
    Redux Store                            MongoDB
    (State Mgmt)                          (Database)
```

### **Component Architecture**
```
src/
├── components/          # Reusable UI Components
├── screens/            # Page Components
├── actions/            # Redux Actions
├── reducers/           # Redux Reducers
├── constants/          # Action Constants
├── config/             # Configuration Files
└── store.js           # Redux Store Configuration
```

---

## 🗄️ Database Schema

### **User Model**
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  isAdmin: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### **Product Model**
```javascript
{
  name: String (required),
  image: String (required),
  description: String (required),
  brand: String,
  category: String (required),
  price: Number (required),
  countInStock: Number (required),
  rating: Number (default: 0),
  numReviews: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### **Order Model**
```javascript
{
  user: ObjectId (ref: 'User'),
  orderItems: [{
    name: String,
    qty: Number,
    image: String,
    price: Number,
    product: ObjectId (ref: 'Product')
  }],
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String
  },
  paymentMethod: String,
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  isPaid: Boolean (default: false),
  paidAt: Date,
  isDelivered: Boolean (default: false),
  deliveredAt: Date,
  createdAt: Date
}
```

---

## 🎨 Frontend Architecture

### **Component Hierarchy**
```
App.js
├── Header.js
├── Footer.js
└── Screens/
    ├── HomeScreen.js
    ├── ProductScreen.js
    ├── CartScreen.js
    ├── LoginScreen.js
    ├── RegisterScreen.js
    ├── ShippingScreen.js
    ├── PaymentScreen.js
    ├── PlaceOrderScreen.js
    ├── OrderScreen.js
    └── Admin Screens/
        ├── ProductListScreen.js
        ├── UserListScreen.js
        ├── OrderListScreen.js
        └── AdminDashboardScreen.js
```

### **Key Components**
- **Header.js**: Navigation, search, user menu
- **Product.js**: Product card component
- **CartScreen.js**: Shopping cart with history tabs
- **CheckoutSteps.js**: Progress indicator
- **HeroSlider.js**: Homepage carousel

### **State Management Flow**
```
User Action → Dispatch Action → API Call → Update Redux State → Component Re-render
```

---

## 🔧 Backend Architecture

### **Directory Structure**
```
backend/
├── controllers/        # Business Logic
├── models/            # Database Models
├── routes/            # API Routes
├── middleware/        # Custom Middleware
├── config/            # Configuration
├── utils/             # Utility Functions
└── server.js          # Server Entry Point
```

### **Controller Pattern**
```javascript
// Example: Product Controller
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ message: 'Product not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}
```

### **Middleware Stack**
```
Request → authMiddleware → errorHandler → Controller → Response
```

---

## 🔐 Authentication & Security

### **JWT Authentication Flow**
```
1. User submits login credentials
2. Backend validates credentials
3. Backend generates JWT token (24hr expiry)
4. Token stored in localStorage
5. Token sent with API requests
6. Backend validates token for protected routes
```

### **Security Features**
- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: 24-hour expiration with auto-logout
- **Route Protection**: Middleware for admin-only routes
- **Input Validation**: Form validation on frontend & backend
- **CORS**: Cross-origin resource sharing configured
- **Environment Variables**: Sensitive data in .env file

### **Token Validation**
```javascript
// Frontend token validation
const validateToken = (userInfo) => {
  if (!userInfo || !userInfo.token) return null
  
  try {
    const tokenPayload = JSON.parse(atob(userInfo.token.split('.')[1]))
    const currentTime = Date.now() / 1000
    
    if (tokenPayload.exp < currentTime) {
      localStorage.removeItem('userInfo')
      return null
    }
    return userInfo
  } catch (error) {
    localStorage.removeItem('userInfo')
    return null
  }
}
```

---

## 💳 Payment System

### **Cash on Delivery (COD) Implementation**
- **Primary Payment Method**: COD is the default and only payment method
- **Payment Flow**: Order created → Delivery → Cash collection → Mark as paid
- **Configuration**: Scalable system ready for future payment methods

### **Payment Configuration**
```javascript
// paymentMethods.js
export const paymentMethods = {
  COD: {
    id: 'COD',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: 'fas fa-money-bill-wave',
    enabled: true,
    default: true
  }
}
```

### **Order Confirmation**
- **Modal System**: Success confirmation with order details
- **Auto-redirect**: 5-second countdown to order details
- **Status Display**: Processing status with COD instructions

---

## 🚀 Key Features

### **1. Shopping Cart with History**
- **Tab Interface**: Cart items & shopping history
- **Smart Redirect**: Checkout progress tracking
- **Order Filtering**: Only undelivered orders shown
- **Real-time Updates**: Live order status

### **2. Admin Dashboard**
- **Product Management**: CRUD operations for products
- **User Management**: View and manage users
- **Order Management**: Track and update orders
- **Responsive Design**: Mobile-friendly admin interface

### **3. Search & Filtering**
- **Product Search**: Keyword-based search
- **Category Filtering**: Browse by categories
- **Pagination**: Efficient data loading
- **Real-time Results**: Instant search feedback

### **4. Order Management**
- **Order Tracking**: Real-time status updates
- **Delivery Management**: Mark orders as delivered
- **Payment Tracking**: COD payment status
- **Customer Communication**: Order details and contact info

---

## 📡 API Endpoints

### **Authentication Routes**
```
POST /api/users/login          - User login
POST /api/users/register       - User registration
POST /api/users/logout        - User logout
GET  /api/users/profile        - Get user profile
PUT  /api/users/profile        - Update user profile
POST /api/users/forgotpassword - Forgot password
POST /api/users/resetpassword  - Reset password
```

### **Product Routes**
```
GET    /api/products           - Get all products
GET    /api/products/:id       - Get single product
POST   /api/products           - Create product (admin)
PUT    /api/products/:id       - Update product (admin)
DELETE /api/products/:id       - Delete product (admin)
GET    /api/products/top        - Get top-rated products
```

### **Order Routes**
```
POST   /api/orders             - Create new order
GET    /api/orders/:id         - Get order by ID
PUT    /api/orders/:id/pay     - Mark order as paid
PUT    /api/orders/:id/deliver - Mark order as delivered
GET    /api/orders/myorders    - Get user's orders
GET    /api/orders             - Get all orders (admin)
```

### **User Management (Admin)**
```
GET    /api/users              - Get all users
DELETE /api/users/:id          - Delete user
GET    /api/users/:id          - Get user by ID
PUT    /api/users/:id          - Update user
```

---

## 🔄 State Management

### **Redux Store Structure**
```javascript
{
  productList: { products, loading, error },
  productDetails: { product, loading, error },
  cart: { cartItems, shippingAddress, paymentMethod },
  userLogin: { userInfo, loading, error },
  orderCreate: { order, loading, error, success },
  orderDetails: { order, loading, error },
  orderListMy: { orders, loading, error },
  // ... other reducers
}
```

### **Action Types**
```javascript
// Product Actions
PRODUCT_LIST_REQUEST
PRODUCT_LIST_SUCCESS
PRODUCT_LIST_FAIL

// Cart Actions
CART_ADD_ITEM
CART_REMOVE_ITEM
CART_SAVE_SHIPPING_ADDRESS

// Order Actions
ORDER_CREATE_REQUEST
ORDER_CREATE_SUCCESS
ORDER_CREATE_FAIL
```

### **Async Actions with Thunk**
```javascript
export const listProducts = (keyword, pageNumber) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST })
    const { data } = await axios.get(
      `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
    )
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_FAIL, payload: error })
  }
}
```

---

## 🚀 Deployment

### **Environment Setup**
```bash
# Backend Environment
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ogms
JWT_SECRET=your_jwt_secret_key

# Frontend Environment (optional)
REACT_APP_API_URL=http://localhost:5000
```

### **Development Server**
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start
```

### **Production Deployment**
```bash
# Backend Production
npm start

# Frontend Build
npm run build
# Serve build folder with static server
```

---

## 📁 Code Structure

### **Frontend File Organization**
```
frontend/src/
├── components/
│   ├── Header.js
│   ├── Footer.js
│   ├── Product.js
│   ├── Cart.js
│   ├── SearchBox.js
│   └── ...
├── screens/
│   ├── HomeScreen.js
│   ├── ProductScreen.js
│   ├── CartScreen.js
│   ├── LoginScreen.js
│   └── ...
├── actions/
│   ├── productActions.js
│   ├── userActions.js
│   ├── cartActions.js
│   └── orderActions.js
├── reducers/
│   ├── productReducers.js
│   ├── userReducers.js
│   ├── cartReducers.js
│   └── orderReducers.js
├── constants/
│   ├── productConstants.js
│   ├── userConstants.js
│   └── orderConstants.js
├── config/
│   └── paymentMethods.js
└── store.js
```

### **Backend File Organization**
```
backend/
├── controllers/
│   ├── productController.js
│   ├── userController.js
│   ├── orderController.js
│   └── ...
├── models/
│   ├── productModel.js
│   ├── userModel.js
│   └── orderModel.js
├── routes/
│   ├── productRoutes.js
│   ├── userRoutes.js
│   └── orderRoutes.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js
├── config/
│   └── db.js
├── utils/
│   └── generateToken.js
└── server.js
```

---

## 🎓 Viva Preparation Questions

### **General Questions**
1. **What is the purpose of this application?**
   - Answer: An online grocery store that allows customers to browse products, add to cart, and place orders with cash on delivery payment.

2. **What technologies did you use and why?**
   - Answer: MERN stack (MongoDB, Express, React, Node.js) for full-stack JavaScript development, Redux for state management, JWT for authentication.

3. **What is the architecture of your application?**
   - Answer: Client-server architecture with React frontend, Express backend, MongoDB database, and RESTful API communication.

### **Frontend Questions**
4. **How do you manage state in your React application?**
   - Answer: Using Redux with Redux Thunk for async actions. Centralized store with reducers for different state slices.

5. **What is the purpose of Redux in your application?**
   - Answer: Centralized state management for cart items, user authentication, products, and orders across components.

6. **How do you handle routing in your application?**
   - Answer: React Router with client-side routing, protected routes for authenticated users, and admin-only routes.

7. **What is the purpose of components in React?**
   - Answer: Reusable UI building blocks that manage their own state and props, following component-based architecture.

### **Backend Questions**
8. **What is the role of Express.js in your application?**
   - Answer: Web framework for creating RESTful APIs, handling HTTP requests, middleware, and routing.

9. **How do you handle authentication in your application?**
   - Answer: JWT tokens for authentication, bcryptjs for password hashing, and middleware for route protection.

10. **What is MongoDB and why did you choose it?**
    - Answer: NoSQL database for flexible schema, good for e-commerce applications with varied data structures.

11. **How do you validate user input?**
    - Answer: Frontend form validation, backend validation using Mongoose schemas, and error handling.

### **Database Questions**
12. **What are the main collections in your database?**
    - Answer: Users, Products, and Orders collections with relationships between them.

13. **How do you handle relationships between data?**
    - Answer: Using MongoDB references (ObjectId) to link orders to users and products.

14. **What is the purpose of Mongoose?**
    - Answer: Object modeling for MongoDB, schema validation, and helper methods for database operations.

### **Security Questions**
15. **How do you secure user passwords?**
    - Answer: Using bcryptjs to hash passwords with salt rounds before storing in database.

16. **What is JWT and how do you use it?**
    - Answer: JSON Web Tokens for stateless authentication, containing user info with expiration.

17. **How do you protect admin routes?**
    - Answer: Authentication middleware that checks for valid JWT and admin privileges.

### **Feature-Specific Questions**
18. **How does your shopping cart work?**
    - Answer: Redux state management for cart items, localStorage persistence, and real-time updates.

19. **What is your payment system and how does it work?**
    - Answer: Cash on Delivery (COD) system where orders are marked as paid upon delivery.

20. **How do you handle order management?**
    - Answer: Order creation, status tracking, delivery management, and payment status updates.

### **Technical Implementation Questions**
21. **How do you handle API calls in your application?**
    - Answer: Using Axios for HTTP requests, Redux Thunk for async actions, and error handling.

22. **What is the purpose of middleware in Express?**
    - Answer: Functions that run during request-response cycle for authentication, validation, and error handling.

23. **How do you handle errors in your application?**
    - Answer: Global error handler, try-catch blocks, and user-friendly error messages.

### **Advanced Questions**
24. **How would you scale this application?**
    - Answer: Database indexing, caching, load balancing, microservices architecture, and CDN implementation.

25. **What testing strategies would you implement?**
    - Answer: Unit testing with Jest, integration testing, E2E testing with Cypress, and API testing.

26. **How would you optimize performance?**
    - Answer: Code splitting, lazy loading, image optimization, database indexing, and caching strategies.

### **Project Management Questions**
27. **What challenges did you face during development?**
    - Answer: Authentication flow, state management complexity, responsive design, and API integration.

28. **How did you approach the development process?**
    - Answer: Agile methodology, feature-by-feature development, testing, and iterative improvements.

29. **What features would you add in the future?**
    - Answer: Multiple payment methods, real-time notifications, advanced search, mobile app, and analytics dashboard.

---

## 🎯 Key Points to Remember

### **For Technical Viva:**
- Explain the MERN stack architecture clearly
- Demonstrate understanding of React component lifecycle
- Show knowledge of Redux state management
- Explain JWT authentication flow
- Describe database relationships and queries
- Discuss security measures implemented

### **For Project Demonstration:**
- Show complete user journey from browsing to checkout
- Demonstrate admin panel functionality
- Explain payment system (COD) implementation
- Show responsive design on different devices
- Explain error handling and user feedback

### **For Code Review:**
- Clean, modular code structure
- Proper error handling
- Security best practices
- Performance considerations
- Scalability potential

---

## 📚 Additional Resources

### **Documentation Links:**
- [React Documentation](https://reactjs.org/docs/)
- [Redux Documentation](https://redux.js.org/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Documentation](https://jwt.io/)

### **Best Practices:**
- Code organization and structure
- Security implementation
- Performance optimization
- Error handling strategies
- Testing methodologies

---

**Good luck with your viva! 🎓 This documentation covers all aspects of your application. Focus on understanding the architecture and being able to explain your implementation decisions clearly.**
