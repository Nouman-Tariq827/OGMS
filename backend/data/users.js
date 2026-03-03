import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    cnic: '12345-6789012-3',
    phoneNumber: '0312-3456789',
    address: 'Admin House #1, Street 1',
    town: 'Gulberg',
    region: 'Lahore',
    postcode: '54000',
    country: 'Pakistan',
  },
  {
    name: 'Thrishna',
    email: 'thrishna@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    cnic: '22345-6789012-3',
    phoneNumber: '0321-3456789',
    address: 'User House #2, Street 2',
    town: 'DHA',
    region: 'Lahore',
    postcode: '54000',
    country: 'Pakistan',
  },
  {
    name: 'Ali',
    email: 'ali@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    cnic: '32345-6789012-3',
    phoneNumber: '0333-3456789',
    address: 'User House #3, Street 3',
    town: 'Model Town',
    region: 'Lahore',
    postcode: '54000',
    country: 'Pakistan',
  },
]

export default users

