# 🛒 Online Grocery Management Store - MERN Stack E-commerce

![GitHub repo size](https://img.shields.io/github/repo-size/Nouman-Tariq827/OGMS)
![GitHub language count](https://img.shields.io/github/languages/count/Nouman-Tariq827/OGMS)
![GitHub last commit](https://img.shields.io/github/last-commit/Nouman-Tariq827/OGMS)
![GitHub issues](https://img.shields.io/github/issues/Nouman-Tariq827/OGMS)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Nouman-Tariq827/OGMS)

A modern, feature-rich e-commerce platform for online grocery shopping built with the MERN stack. This application provides a complete shopping experience with advanced features including product search, category-based navigation, user reviews, shopping cart, multiple payment methods, and comprehensive admin panel.

### Quick Access
- **Admin Login:** `admin@example.com` / `123456`
- **User Login:** `zrar@gmail.com` / `123456`
- **Payment:** Cash on Delivery (COD) - Pay when you receive your order

## Key Features

### Customer Features
- **Product Browsing:** Advanced search with keyword filtering
- **Category Navigation:** Dropdown-based category selection
- **Product Details:** Detailed product pages with reviews and ratings
- **Shopping Cart:** Advanced quantity stepper with real-time updates
- **User Reviews:** Rate and review purchased products
- **Order Tracking:** View order history with recent orders first
- **Multiple Payment Methods:** Cash on Delivery (COD) as primary, ready for JazzCash/Easypaisa
- **Responsive Design:** Optimized for desktop (2560px), laptop (1440px, 1024px), and mobile devices

### Admin Features
- **Dashboard Analytics:** Real-time statistics and metrics
- **Sales & Profit Management:** Advanced date filtering, revenue tracking, and order analysis
- **Product Management:** CRUD operations with image upload
- **Order Management:** View, update, and manage orders with recent orders first
- **User Management:** User administration and role management
- **Category Management:** Organize products by categories
- **Review Moderation:** Manage customer reviews

### UI/UX Features
- **Modern Design:** Clean, professional interface with custom footer
- **Hero Slider:** Responsive carousel with optimized image display
- **Product Cards:** Hover effects and animations with proper image scaling
- **Pagination:** Efficient navigation through large datasets
- **Search Integration:** Real-time product search
- **Loading States:** Professional loading indicators
- **Error Handling:** User-friendly error messages

## Tech Stack

### Frontend
- **React 18:** Modern React with functional components
- **Redux Toolkit:** State management
- **React Router:** Client-side routing
- **React Bootstrap:** UI framework
- **Font Awesome:** Icons and visual elements
- **Axios:** HTTP client for API calls

### Backend
- **Node.js:** JavaScript runtime
- **Express.js:** Web framework
- **MongoDB:** NoSQL database
- **Mongoose:** Object modeling for MongoDB
- **JWT:** Authentication and authorization
- **Bcrypt:** Password hashing

### Development Tools
- **ESLint:** Code linting and formatting
- **Git:** Version control
- **VS Code:** Recommended IDE

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nouman-Tariq827/OGMS.git
   cd OGMS
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   npm install
   
   # Frontend dependencies
   cd frontend
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the application**
   ```bash
   # Start backend server
   npm run dev
   
   # In a new terminal, start frontend
   cd frontend
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```bash
OGMS/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── utils/          # Utility functions
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── screens/       # Page components
│   │   ├── actions/       # Redux actions
│   │   ├── reducers/      # Redux reducers
│   │   ├── config/        # Configuration files
│   │   └── constants/     # App constants
│   └── public/           # Static assets
└── README.md
```

## Payment Methods

### Primary Payment Method
- **Cash on Delivery (COD):** Default and primary payment method
  - Pay when you receive your order
  - Orders marked as paid when delivered
  - Simple and secure payment process

### Future Ready
- **JazzCash:** Mobile wallet integration (template ready)
- **Easypaisa:** Mobile wallet integration (template ready)

## Recent Improvements

### Order Management Enhancements
- **Descending Order Display:** Both admin and user dashboards show recent orders first
- **Improved User Experience:** Easy to track latest orders and purchases
- **Consistent Sorting:** All order lists follow newest-to-oldest pattern

### Sales & Profit Management
- **Advanced Date Filtering:** Filter orders by delivered date (Today, Week, Month, Custom Range)
- **Real-time Order Tracking:** Shows both order placed and delivered dates
- **Professional Table Layout:** Clear column headers with complete order information
- **Accurate Revenue Tracking:** Metrics calculated from delivered orders only
- **Manual Refresh Control:** User-controlled data updates

### UI/UX Enhancements
- **Responsive Design:** Optimized for all screen sizes including laptops (1024px, 1440px)
- **Hero Slider Optimization:** Fixed image zoom issues on different screen sizes
- **Product Image Display:** Improved image scaling with `object-fit: contain`
- **Professional Footer:** Modern footer with contact information and quick links
- **Advanced Cart Controls:** Quantity stepper with hover states and disabled states

### Code Quality Improvements
- **Clean Codebase:** Removed 152 lines of unused code including serviceWorker
- **ESLint Compliance:** Fixed all warnings and unreachable code issues
- **Performance Optimization:** Optimized React components and state management
- **Production Ready:** Clean build with no warnings (124.86 kB JS + 24.82 kB CSS)

## Configuration

### Environment Variables
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ogms
JWT_SECRET=your_secret_key_here
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Nouman Tariq**
- GitHub: [@Nouman-Tariq827](https://github.com/Nouman-Tariq827)
- Email: noumantariq827@gmail.com
- LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/nouman-tariq-b279022b4/)

---

Star this repository if it helped you!

Share this project with others who might find it useful!
