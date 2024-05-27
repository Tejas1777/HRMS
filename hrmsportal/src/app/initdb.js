const mysql = require('mysql2/promise');

const createDatabaseAndTables = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Parkar@123'
  });

  try {
    // Create the database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS hrms');

    // Connect to the newly created database
    await connection.changeUser({ database: 'hrms' });

    // Create the EmployeeDetails table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS EmployeeDetails (
          empid VARCHAR(20) PRIMARY KEY,
          firstname VARCHAR(20),
          lastname VARCHAR(20),
          email VARCHAR(30),
          departmentid VARCHAR(10),
          positionid VARCHAR(20),
          salary DECIMAL(18, 2),
          contact VARCHAR(20),
          role INT,
          address VARCHAR(50),
          DOJ DATE
      )
    `);

    console.log("EmployeeDetails table created successfully.");

    // Create the empPayslipData table with a foreign key
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS empPayslipData (
          id INT AUTO_INCREMENT PRIMARY KEY,
          empid VARCHAR(50) NOT NULL,
          month VARCHAR(3) NOT NULL,
          year VARCHAR(4) NOT NULL UNIQUE,
          grossPay DECIMAL(18, 2) NOT NULL,
          HRA DECIMAL(18, 2) NOT NULL,
          deductions DECIMAL(18, 2) NOT NULL,
          netPay DECIMAL(18, 2) NOT NULL,
          FOREIGN KEY (empid) REFERENCES EmployeeDetails(empid)
      )
    `);

    console.log("empPayslipData table created successfully.");
  } catch (error) {
    console.error("Error creating database or tables:", error);
  } finally {
    await connection.end();
  }
};

createDatabaseAndTables();
