// const express = require('express');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const MySQLStore = require('express-mysql-session')(session);
// const { Sequelize, DataTypes } = require('sequelize');
// const speakeasy = require('speakeasy');
// const cors = require('cors')

// const app = express();
// const PORT = process.env.PORT || 5000; // Choose a port for your backend server

// app.use(cors());
// // Middleware to parse JSON bodies
// app.use(bodyParser.json());

// // Configure session middleware
// const sessionStore = new MySQLStore({
//   // Replace with your MySQL database configuration
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: 'Parkar@123',
//   database: 'hrms'
// });

// app.use(session({
//   secret: 'your_secret_key', // Replace with a secret key for session encryption
//   store: sessionStore,
//   resave: false,
//   saveUninitialized: false
// }));

// // Connect to MySQL database
// const sequelize = new Sequelize('hrms', 'root', 'Parkar@123', {
//   host: 'localhost',
//   dialect: 'mysql'
// });

// // Define Login model to match the existing Login table
// const Login = sequelize.define('Login', {
//   empid: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   role: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   secret: {
//     type: DataTypes.STRING,
//     allowNull: true
//   }
// }, {
//   tableName: 'Login', // Specify the table name explicitly to match the existing Login table
//   timestamps: false // If the table does not have createdAt and updatedAt columns, disable timestamps
// });

// // API route to handle login
// app.post('/api/login', async (req, res) => {
//   console.log(req.body);
//   const { empid, password } = req.body;
  
//   try {
//     const user = await Login.findOne({ where: { empid, password } });
//     if (user) {
//       // Default role to 1 if not present
//       let role = user.role? user.role : 1;
      
//       // Store user's role in session
//       req.session.empid = user.empid;
//       req.session.role = role;
//       console.log('Session empid set:', req.session.empid);
//       res.status(200).json({ message: 'Login successful', role: role });
//     } else {
//       res.status(401).json({ error: 'Invalid empid or password' });
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



// API route to setup 2FA and return QR code data and secret key
// app.get('/api/2fa/setup', async (req, res) => {
//   console.log('Empid stored in the session:',req.session.empid);
//   try {
//     // Generate a new secret key for the user
//     const secret = speakeasy.generateSecret({ length: 20 });

//     // Update the user's record with the secret key
//     await Login.update({ secret: secret.base32 }, { where: { empid: req.session.empid } });

//     // Generate QR code data URL
//     const qrCodeDataUrl = `otpauth://totp/HRMS:${req.session.empid}?secret=${encodeURIComponent(secret.base32)}`;

//     // Return the QR code data URL and the secret key
//     res.status(200).json({ qrCodeDataUrl, secret: secret.base32 });
//   } catch (error) {
//     console.error('Error setting up 2FA:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // API route to verify OTP
// app.post('/api/2fa/verify', async (req, res) => {
//   const { otp } = req.body;

//   try {
//     const user = await Login.findOne({secret: secret.base32}, { where: { empid: req.session.empid } });

//     if (!user) {
//       return res.status(401).json({ error: 'User not found' });
//     }

//     const verified = speakeasy.totp.verify({
//       secret: user.secret,
//       encoding: 'base32',
//       token: otp,
//       window: 1 // Allow for time drift of up to 30 seconds
//     });

//     if (verified) {
//       await Login.update({ otpVerified: true }, { where: { empid: req.session.empid } });
//       res.status(200).json({ message: 'OTP verified successfully' });
//     } else {
//       res.status(401).json({ error: 'Invalid OTP' });
//     }
//   } catch (error) {
//     console.error('Error verifying OTP:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.get('/debug/session', (req, res) => {
//   console.log('Session:', req.session);
//   // res.send('Session content logged to console.');
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Parkar@123',
  database: 'hrms',
};

// Initialize Sequelize
// const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
//   host: dbConfig.host,
//   dialect: 'mysql',
// });

// // Define the Employee model
// const Employee = sequelize.define('Employee', {
//   empid: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   role: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//   },
// }, {
//   tableName: 'employeedetails',
//   timestamps: false,
// });

// // Middleware to parse JSON bodies
// app.use(bodyParser.json());
// app.use(cors());

// // Route to handle login
// app.post('/login', async (req, res) => {
//   const { empid, password } = req.body;

//   try {
//     // Query the database to find the employee
//     const [rows] = await Employee.findAll({
//       where: {
//         empid: empid,
//         password: password,
//       },
//     });

//     if (rows.length > 0) {
//       // Login successful, redirect to setup-2FA page
//       res.status(200).json({ message: 'Login successful', role: rows[0].role });
//     } else {
//       // Invalid credentials
//       res.status(401).json({ error: 'Invalid empid or password' });
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });



// Connect to the database
async function connect() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the database.');
  } catch (err) {
    console.error('Failed to connect to the database.', err);
  }
  return connection;
}

connect();

// Middleware to parse JSON bodies
app.use(express.json());

const crypto = require('crypto');
const QRCode = require('qrcode');
const otpauth = require('otpauth');

function generateSecretKey() {
      let base64Key = crypto.randomBytes(16).toString('base64');
    base64Key = base64Key.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const validBase32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let validKey = '';
    for (let char of base64Key) {
          if (validBase32Chars.includes(char)) {
              validKey += char;
        }
    }
    return validKey.slice(0, 22);
}

async function generateQRCode(secretKey, empid) {
     try {
         const totp = new otpauth.TOTP({
             secret: secretKey,
             issuer: 'GoogleAuthenticator',
           label: `YourLabel - ${empid}`,
           algorithm: 'SHA1',
           digits: 6,
           period: 30,
       });
       const otpAuthUri = totp.toString();
        const qrCodeDataURL = await QRCode.toDataURL(otpAuthUri);
        return qrCodeDataURL;
   } catch (error) {
         console.error('Failed to generate QR code:', error);
        throw error;
   }
}


// Login API
app.post('/login', async (req, res) => {
  const { empid, password } = req.body;
  try {
    const connection = await connect(); // Reuse the same connection if possible
    const [rows] = await connection.execute(
      'SELECT * FROM employeedetails WHERE empid =? AND password =?',
      [empid, password]
    );

    if (rows.length > 0) {
      // Login successful, send appropriate response
      const secretKey = generateSecretKey();
      await connection.execute(
        'UPDATE employeedetails SET secret_key = ? WHERE empid = ?',
        [secretKey, empid]
    );
      res.status(200).json({ message: 'Login successful', user: rows[0], secretKey}); // Adjust according to your needs
      await connection.execute(
        'INSERT INTO Login(empid, timestamp, wasSuccessful, otpVerified) VALUES (?, NOW(),?,?)',
        [empid, true, false]
      );
    } else {
      // Invalid credentials
      res.status(401).json({ error: 'Invalid empid or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// const crypto = require('crypto');
// const QRCode = require('qrcode');
// const otpauth = require('otpauth'); // Ensure this is the latest version

// // function generateSecretKey() {
// //   return crypto.randomBytes(16).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').slice(0, 22);
// // }

// function generateSecretKey() {
//   // Generate a 128-bit secret key and convert it to a Base64 string
//   let base64Key = crypto.randomBytes(16).toString('base64');
//   // Replace '+' with '-', '/' with '_', and remove padding '=' characters
//   base64Key = base64Key.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
//   // Ensure the key is a valid Base32 string by filtering out invalid characters
//   const validBase32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
//   let validKey = '';
//   for (let char of base64Key) {
//     if (validBase32Chars.includes(char)) {
//       validKey += char;
//     }
//   }
//   // Return the first 22 characters of the valid key
//   return validKey.slice(0, 22);
// }


// async function generateQRCode(secretKey) {
//   try {
//     // Correctly instantiate a TOTP object using the new otpauth API
//     const totp = new otpauth.TOTP({
//       secret: secretKey,
//       issuer: 'GoogleAuthenticator',
//       label: 'YourLabel',
//       algorithm: 'SHA1',
//       digits: 6,
//       period: 30,
//     });

//     // Generate the QR code from the OTP URI
//     const qrCodeDataURL = await QRCode.toDataURL(totp.uri());
//     return qrCodeDataURL;
//   } catch (error) {
//     console.error('Failed to generate QR code:', error);
//     throw error;
//   }
// }

// app.get('/generate-qrcode', async (req, res) => {
//   console.log('API called');
//   const secretKey = generateSecretKey();
//   const qrCodeDataURL = await generateQRCode(secretKey);
//   res.json({ qrCodeURL: qrCodeDataURL });
// });


// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });




// app.get('/generate-qrcode', async (req, res) => {
//       console.log('API called');
//     try {
//           const secretKey = generateSecretKey();
//           const qrCodeDataURL = await generateQRCode(secretKey);
//           res.json({ qrCodeURL: qrCodeDataURL });
//     } catch (error) {
//           res.status(500).json({ error: 'Failed to generate QR code' });
//     }
// });


/********************************************************************************************/
// app.get('/generate-qrcode', async (req, res) => {
//   const { empid } = req.query;
//   console.log(`Received empid: ${empid}`);

//   if (!empid) {
//     return res.status(400).json({ error: 'Missing empid parameter' });
//   }
//   try {
//     const connection = await connect();
//     const [rows] = await connection.execute(
//         'SELECT secret_key FROM employeedetails WHERE empid = ?',
//         [empid]
//     );

//     if (rows.length > 0) {
//         const secretKey = rows[0].secret_key;
//         const qrCodeDataURL = await generateQRCode(secretKey, empid);
//         res.json({ qrCodeURL: qrCodeDataURL });
//     } else {
//         res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     console.error('Failed to generate QR code:', error);
//     res.status(500).json({ error: 'Failed to generate QR code' });
//   }
//   });

//   // Verify OTP API
//   app.post('/verify-otp', async (req, res) => {
//     console.log("Received request:", req.body); // Log the incoming request
//     const { empid, otp } = req.body;
  
//     try {
//       const connection = await connect();
//       const [rows] = await connection.execute(
//           'SELECT secret_key FROM employeedetails WHERE empid =?',
//           [empid]
//       );
  
//       if (rows.length > 0) {
//           const secret = rows[0].secret_key;
//           console.log("Using secret key:", secret); // Log the secret key used for validation
  
//           const totp = new otpauth.TOTP({ secret, algorithm: 'SHA1', digits: 6, period: 30 });
//           const isValid = totp.validate({ token: otp });

//           console.log("Generated OTP:", totp.generate()); // Log the generated OTP for comparison
//           console.log("Validation result:", isValid);

//           if (isValid!== null) {
//               console.log("OTP is valid"); // Log successful validation
//               res.json({ success: true });
//               await connection.execute(
//                 'UPDATE login SET otpVerified = ? WHERE empid = ? ORDER BY timestamp DESC LIMIT 1',
//                 [true, empid]
//             );
//           } else {
//               console.log("OTP is invalid"); // Log failed validation
//               res.status(400).json({ error: 'Invalid OTP' });
//           }
//       } else {
//           res.status(404).json({ error: 'User not found' });
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
/******************************************************************* */   

app.get('/generate-qrcode', async (req, res) => {
  const { empid } = req.query;
  console.log(`Received empid: ${empid}`);

  if (!empid) {
      return res.status(400).json({ error: 'Missing empid parameter' });
  }
  try {
      const connection = await connect();
      // Check if the employee's session/device is already authenticated
      const isAuthenticatedQuery = 'SELECT otpVerified FROM login WHERE empid =?';
      const [isAuthenticatedRow] = await connection.execute(isAuthenticatedQuery, [empid]);

      if (isAuthenticatedRow[0].otpVerified===1) {
          // Employee's session/device is already authenticated
          res.json({ message: 'No QR code needed, employee has already logged in and is authenticated.' });
      } else {
          // Employee's session/device is not authenticated
          const [employeeRows] = await connection.execute(
              'SELECT secret_key FROM employeedetails WHERE empid =?',
              [empid]
          );

          if (employeeRows.length > 0) {
              const secretKey = employeeRows[0].secret_key;
              // Generate QR code since the employee hasn't logged in before or the session/device isn't authenticated
              const qrCodeDataURL = await generateQRCode(secretKey, empid);
              res.json({ qrCodeURL: qrCodeDataURL });
          } else {
              res.status(404).json({ error: 'Employee not found' });
          }
      }
  } catch (error) {
      console.error('Failed to generate QR code:', error);
      res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { empid, otp } = req.body;
  console.log("Received request:", req.body); // Log the incoming request

  try {
      const connection = await connect();
      // Query to select the secret_key and otpAttempts from the login table
      const [loginRows] = await connection.execute(
          `SELECT ed.secret_key, l.otpAttempts
          FROM employeedetails AS ed
          JOIN login AS l ON ed.empid = l.empid
          WHERE ed.empid =?
          `,
          [empid]
      );

      if (loginRows.length > 0) {
          const secret = loginRows[0].secret_key;
          console.log("secret ",secret)
          const currentOtpAttempts = loginRows[0].otpAttempts;

          const totp = new otpauth.TOTP({ secret, algorithm: 'SHA1', digits: 6, period: 30 });
          const isValid = totp.validate({ token: otp });

          console.log("Generated OTP:", totp.generate()); // Log the generated OTP for comparison
          console.log("Validation result:", isValid);

          if (isValid!== null) {
              console.log("OTP is valid"); // Log successful validation
              res.json({ success: true });
          } else {
              console.log("OTP is invalid"); // Log failed validation
              // Increment otpAttempts if the OTP is invalid
              await connection.execute(
                  'UPDATE login SET otpAttempts = otpAttempts + 1 WHERE empid =?',
                  [empid]
              );

              // Reset otpAttempts if it exceeds a certain threshold
              if (currentOtpAttempts >= 3) {
                  await connection.execute(
                      'UPDATE login SET otpAttempts = 0 WHERE empid =?',
                      [empid]
                  );
                  // Optionally, trigger a new QR code generation here

                  // Or inform the user that they need to scan a new QR code
                  res.json({ message: 'Too many unsuccessful attempts. Please scan a new QR code.' });
              } else {
                  res.status(400).json({ error: 'Invalid OTP' });
              }
          }
      } else {
          res.status(404).json({ error: 'User not found' });
      }
  } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(PORT, () => {

console.log(`Server is running on http://localhost:${PORT}`);

});