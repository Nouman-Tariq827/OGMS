# 🗄️ Database Migration Instructions

## 📋 Overview
Your OGMS database has been successfully exported! Here's what you need to do to migrate it to your second PC.

## 📦 What's Been Exported

### **Database: grocerystore**
- ✅ **products.json** - 26 products (12,377 bytes)
- ✅ **users.json** - 3 users (1,541 bytes)  
- ✅ **orders.json** - 24 orders (18,687 bytes)

### **Location of Files**
```
C:\Users\Dell\Desktop\Project\online-grocerystore\backend\database-backup\
├── products.json    (26 products)
├── users.json       (3 users)
└── orders.json      (24 orders)
```

## 🚀 Migration Steps

### **Step 1: Transfer Files to Second PC**

Copy the entire `database-backup` folder to your second PC using:
- **USB Drive** (Recommended)
- **Cloud Storage** (Google Drive, Dropbox)
- **Network Transfer**

### **Step 2: Setup on Second PC**

1. **Clone the repository** (if not already done)
2. **Install dependencies**: `npm install`
3. **Start MongoDB service**
4. **Copy the `database-backup` folder** to the backend directory

### **Step 3: Import Database**

On the second PC, run:

```bash
# Navigate to backend directory
cd backend

# Run the import script
node import-database.cjs
```

### **Step 4: Verify Import**

After import, verify the data:

```bash
# Check if data was imported
node check-db.cjs

# Or start the app and verify:
npm start
# Visit http://localhost:5000
# Check products, users, and orders
```

## 📁 Files to Transfer

### **Required Files:**
1. **database-backup/** folder containing:
   - products.json
   - users.json  
   - orders.json

2. **Migration Scripts:**
   - import-database.cjs
   - check-db.cjs

### **Optional Files:**
- uploads/ folder (product images)
- .env file (if exists)

## 🔧 Alternative Import Methods

### **Method 1: Using MongoDB Compass**
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Create database `grocerystore`
4. Import each JSON file to corresponding collections

### **Method 2: Using mongoimport (if available)**
```bash
mongoimport --db grocerystore --collection products --file products.json --jsonArray
mongoimport --db grocerystore --collection users --file users.json --jsonArray  
mongoimport --db grocerystore --collection orders --file orders.json --jsonArray
```

## 🎯 Database Structure

### **Products Collection** (26 items)
- name, description, price, category
- brand, image, rating, numReviews
- countInStock

### **Users Collection** (3 users)
- name, email, password (hashed)
- address, phone, isAdmin

### **Orders Collection** (24 orders)
- orderItems, shippingAddress
- paymentMethod, totalPrice
- isPaid, isDelivered

## ⚠️ Important Notes

### **Before Migration:**
1. **Stop the application** on both PCs
2. **Backup existing data** on second PC (if any)
3. **Ensure MongoDB is running** on second PC

### **After Migration:**
1. **Test all functionality** - login, add to cart, place orders
2. **Check product images** - copy uploads folder if needed
3. **Verify admin access** with imported admin account

### **Troubleshooting:**
- If import fails, check MongoDB connection
- Ensure the `database-backup` folder is in the backend directory
- Check file permissions on the second PC

## 🚀 Quick Commands Summary

### **On Source PC (already done):**
```bash
✅ Export completed: node export-database.cjs
```

### **On Target PC:**
```bash
# 1. Copy database-backup folder to backend/
# 2. Run import
node import-database.cjs

# 3. Verify
node check-db.cjs

# 4. Start application
npm start
```

## 📞 Support

If you encounter issues:
1. Check MongoDB is running: `net start MongoDB`
2. Verify file paths and permissions
3. Check the import script output for errors
4. Ensure the database name is `grocerystore`

---

**Your database is ready for migration! 🎉**
