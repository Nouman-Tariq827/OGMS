# Database Backup Instructions

This folder contains MongoDB backup files for assignment submission.

## Folder Structure:
```
database_backup/
└── grocerystore/
    ├── users.bson
    ├── products.bson
    └── README.md
```

## How to Generate Real .bson Files:

### Prerequisites:
- MongoDB must be installed and running
- Your application should have some data in the database

### Steps to Generate Backup:

1. **Open Command Prompt/Terminal**

2. **Navigate to your project root directory:**
   ```bash
   cd c:\Users\Dell\Desktop\Project\online-grocerystore
   ```

3. **Run mongodump command to backup users collection:**
   ```bash
   mongodump --db grocerystore --collection users --out database_backup/
   ```

4. **Run mongodump command to backup products collection:**
   ```bash
   mongodump --db grocerystore --collection products --out database_backup/
   ```

### Alternative Single Command:
```bash
mongodump --db grocerystore --out database_backup/
```

This will backup all collections from your database.

### Important Notes:
- Replace `grocerystore` with your actual database name if different
- The .bson files will be overwritten with real data from your database
- Make sure your MongoDB server is running before executing these commands
- The backup files are safe for LMS submission and contain only your database structure and data

## How to Restore Backup (if needed):
```bash
mongorestore --db grocerystore --collection users database_backup/grocerystore/users.bson
mongorestore --db grocerystore --collection products database_backup/grocerystore/products.bson
```
