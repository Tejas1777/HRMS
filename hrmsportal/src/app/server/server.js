// require('dotenv').config();
// console.log(process.env.DB_HOST); // Should output 'localhost'

// const mysql = require('mysql');
// const db = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "Parkar@123",
//     database: "hrms"
// });

// db.connect((err) => {
//     if (err) {
//         console.error('Database connection error:', err.stack);
//         return;
//     }
//     console.log('Connected to the database.');
// });



// const express = require('express');
// const { toDataURL } = require('qrcode');

// const app = express();
// const port = process.env.PORT || 3000;

// app.get('/generate-qr/:secret', async (req, res) => {
//     const { secret } = req.params;
//     try {
//         // Generate a QR code from the secret key
//         const qrCodeUrl = await toDataURL(secret);
        
//         // Send the QR code URL as a response
//         res.send(`<img src="${qrCodeUrl}" alt="QR Code">`);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Failed to generate QR code.');
//     }
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { Sequelize, DataTypes } = require('sequelize');
const speakeasy = require('speakeasy');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const sessionStore = new MySQLStore({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Parkar@123',
  database: 'hrms'
});

app.use(session({
  secret: 'your_secret_key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

const sequelize = new Sequelize('hrms', 'root', 'Parkar@123', {
  host: 'localhost',
  dialect: 'mysql'
});

// Define EmployeeDetails model to match the existing employeedetails table
const EmployeeDetails = sequelize.define('EmployeeDetails', {
  empid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'employeedetails',
  timestamps: false
});

// API route to handle login
app.post('/api/login', async (req, res) => {
  console.log(req.body);
  const { empid, password } = req.body;
  
  try {
    const user = await EmployeeDetails.findOne({ where: { empid, password } });
    if (user) {
      // Default role to 1 if not present
      let role = user.role? user.role : 1;
      
      // Store user's role in session
      req.session.empid = user.empid;
      req.session.role = role;
      console.log('Session empid set:', req.session.empid);
      res.status(200).json({ message: 'Login successful', role: role });
    } else {
      res.status(401).json({ error: 'Invalid empid or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });