// pages/setup-2fa.tsx
// 'use client'

// import React, { useState, useEffect } from 'react';
// import QRCode from 'react-qr-code';

// interface Setup2FAProps {}

// function Setup2FA() {
//     const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
//     const [secret, setSecret] = useState<string>('');
//     const [otp, setOTP] = useState<string>('');

//     useEffect(() => {
//         // Define an async function inside useEffect
//         const fetchQRCode = async () => {
//             try {
//                 const response = await fetch('http://localhost:5000/generate-qrcode');
//                 const data = await response.json();
//                 setSecret(data.secret);
//                 setQrCodeDataUrl(data.qrCodeDataUrl);
//             } catch (error) {
//                 console.error('Error fetching QR code data:', error);
//             }
//         };
    
//         // Call the async function
//         fetchQRCode();
//     }, []);
    

//     return (
//         <div>
//             <h2>Setup Two-Factor Authentication</h2>
//             <div className="qr-code-container"> {/* Add a container div */}
//                 {/* {qrCodeDataUrl && <QRCode value={qrCodeDataUrl} />} */}
//                 {qrCodeDataUrl && <img src={qrCodeDataUrl} alt="Scan this QR code with your 2FA app" />}
                
//             </div>
//             <p>Scan the QR code with your authenticator app and enter the OTP below.</p>
//         </div>

//     );
// };

// export default Setup2FA;
'use client'
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function QRCodeDisplay() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const[otp, setOtp]= useState('');
  const[verification, setVerification]= useState('');
  const router = useRouter(); // Extract empid from the URL's query parameters
  const searchParams= useSearchParams();
  
  useEffect(() => {
    async function fetchQRCode() {
        const empid  = searchParams.get('empid');
        if (!empid) {
            console.error('empid is required to generate QR code.');
            return;
          }
        try{
            const response = await fetch(`http://localhost:5000/generate-qrcode?empid=${empid}`);
            const data = await response.json();
            setQrCodeUrl(data.qrCodeURL);
        }catch(error){
            console.error('Failed to fetch QR Code: ', error);
        }
      
    }

    fetchQRCode();
  }, []);

  const handleSubmit= async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const empid = searchParams.get('empid');
    const otpInputElement = document.getElementById('otpInput') as HTMLInputElement;
    const otp = otpInputElement?.value;
    console.log('verifyotp', empid)

    try{
        const response= await fetch('http://localhost:5000/verify-otp',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ empid, otp })
        });
        const data = await response.json();

        if (response.ok) {
            setVerification('OTP verification successful');
        } else {
            setVerification(`Error: ${data.error}`);
        }
    } catch (error) {
        setVerification('Failed to verify OTP');
    }

    };

return (
<div>
    <h2>Setup Two-Factor Authentication</h2>
    <div className="qr-code-container">
        {qrCodeUrl && <img src={qrCodeUrl} alt="Scan this QR code with your 2FA app" />}
    </div>

    <p>Scan the QR code with your authenticator app and enter the OTP below.</p>

    <form onSubmit={handleSubmit}>
        <input 
            type="text" 
            id="otpInput" 
            placeholder="Enter OTP" 
            maxLength={6}
            required
        />
        <button type="submit">Submit OTP</button>
    </form>
    {verification && <p>{verification}</p>}
</div>


);
};

export default QRCodeDisplay;
