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

## ✨ Key Features

### 🛍️ Customer Features
- **Product Browsing:** Advanced search with keyword filtering
- **Category Navigation:** Dropdown-based category selection
- **Product Details:** Detailed product pages with reviews and ratings
- **Shopping Cart:** Add/remove items with quantity management
- **User Reviews:** Rate and review purchased products
- **Order Tracking:** View order history and status
- **Multiple Payment Methods:** Cash on Delivery (COD) as primary, ready for JazzCash/Easypaisa
- **Responsive Design:** Mobile-first responsive UI

### 👨‍💼 Admin Features
- **Dashboard Analytics:** Real-time statistics and metrics
- **Product Management:** CRUD operations with image upload
- **Order Management:** View, update, and manage orders
- **User Management:** User administration and role management
- **Category Management:** Organize products by categories
- **Review Moderation:** Manage customer reviews

### 🎨 UI/UX Features
- **Modern Design:** Clean, professional interface
- **Hero Slider:** Animated carousel with custom controls
- **Product Cards:** Hover effects and animations
- **Pagination:** Efficient navigation through large datasets
- **Search Integration:** Real-time product search
- **Loading States:** Professional loading indicators
- **Error Handling:** User-friendly error messages

## 🛠️ Tech Stack

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

## 🚀 Getting Started

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

## 📁 Project Structure

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

## 💳 Payment Methods

The application uses a scalable payment system architecture:

### Primary Payment Method
- **Cash on Delivery (COD):** Default and primary payment method
  - Pay when you receive your order
  - Orders marked as paid when delivered
  - Simple and secure payment process

### Future Ready
- **JazzCash:** Mobile wallet integration (template ready)
- **Easypaisa:** Mobile wallet integration (template ready)

### Payment Architecture
Payment methods are configured in `frontend/src/config/paymentMethods.js`:
- Easy to enable/disable payment methods
- Scalable for future payment integrations
- Clean separation of payment logic
- COD orders automatically marked as paid on delivery

## 🎯 Key Features Demo

### Product Management
- Advanced search with keyword filtering
- Category-based navigation
- Product ratings and reviews
- Image gallery for products
- Stock management

### Shopping Experience
- Smooth cart management
- Multiple payment options
- Order tracking
- User authentication
- Responsive design

### Admin Dashboard
- Real-time analytics
- Product CRUD operations
- Order management
- User administration
- Revenue tracking

## 🔧 Configuration

### Environment Variables
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ogms
JWT_SECRET=your_secret_key_here
```

### Payment Methods Configuration
Payment methods are configured in `frontend/src/config/paymentMethods.js`:
- Enable/disable payment methods
- Configure payment method properties
- Set default payment method
- Define payment behavior

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection:** Ensure MongoDB is running and URI is correct
2. **Port Conflicts:** Change PORT in .env if 5000 is occupied
3. **CORS Issues:** Check frontend API URL configuration
4. **Payment Issues:** COD orders are marked as paid when delivered

### Development Tips
- Use `npm run dev` for hot reloading
- Check browser console for debugging
- Verify MongoDB connection in backend logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nouman Tariq**
- GitHub: [@Nouman-Tariq827](https://github.com/Nouman-Tariq827)
- Email: noumantariq827@gmail.com
- LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/nouman-tariq-b279022b4/)

## 🙏 Acknowledgments

- React Bootstrap team for the amazing UI framework
- Font Awesome for the icon library
- MERN stack community for the robust ecosystem
- Open source contributors and reviewers

---

⭐ **Star this repository if it helped you!**

🚀 **Share this project with others who might find it useful!**
