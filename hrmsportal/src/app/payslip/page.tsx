'use client'
import React, { useState } from 'react';

// Define an interface for the formData state
interface FormData {
  employeeId: string;
  basicPay: string;
  taxDeductions: string;
  month: string;
  year: string;
  HRA: string;
  deductions: string;
  netPay: string;
}

const PayslipForm: React.FC = () => {
  // Use the FormData interface to type the formData state
  const [formData, setFormData] = useState<FormData>({
    employeeId: '',
    basicPay: '',
    taxDeductions: '',
    month: '',
    year: '',
    HRA: '',
    deductions: '',
    netPay: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
     ...formData,
      [name]: value,
    });

    if (name === 'basicPay' || name === 'taxDeductions') {
      calculateFields();
    }
  };

  const calculateFields = () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const HRA = Number(formData.basicPay) * 0.1;
    const deductions = Number(formData.taxDeductions);
    const netPay = Number(formData.basicPay) - deductions;

    setFormData({
     ...formData,
      month: month.toString(),
      year: year.toString(),
      HRA: HRA.toString(),
      deductions: deductions.toString(),
      netPay: netPay.toString(),
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform form validation here
    if (!formData.employeeId ||!formData.basicPay ||!formData.taxDeductions) {
      console.error('Please fill in all required fields.');
      return;
    }

    // Submit the form data to the backend
    fetch('http://localhost:3001/submit-payslip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
   .then(response => response.text())
   .then(data => console.log(data))
   .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="employeeId"
        value={formData.employeeId}
        onChange={handleInputChange}
        placeholder="Employee ID"
      />
      <input
        type="text"
        name="basicPay"
        value={formData.basicPay}
        onChange={handleInputChange}
        placeholder="Basic Pay"
      />
      <input
        type="text"
        name="taxDeductions"
        value={formData.taxDeductions}
        onChange={handleInputChange}
        placeholder="Tax Deductions"
      />
      <p>Month: {formData.month}</p>
      <p>Year: {formData.year}</p>
      <p>HRA: {formData.HRA}</p>
      <p>Deductions: {formData.deductions}</p>
      <p>Net Pay: {formData.netPay}</p>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PayslipForm;
