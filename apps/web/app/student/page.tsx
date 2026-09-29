'use client';

import { useState } from 'react';

interface Student {
  id: string;
  name: string;
  code: string;
  mobile: string;
  seat: string;
  shift: string;
  membership: {
    status: string;
    expiresAt: string;
  };
  paymentDue: number;
  internetStatus: string;
  registeredDevices: Array<{ id: string; type: string; name: string }>;
}

export default function StudentPortal() {
  const [loginStep, setLoginStep] = useState<'mobile' | 'otp' | 'profile'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [student, setStudent] = useState<Student | null>(null);

  const handleRequestOtp = async () => {
    try {
      const response = await fetch('/api/v1/auth/otp/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await response.json();
      if (data.success) {
        setLoginStep('otp');
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch('/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await response.json();
      if (data.success) {
        setLoginStep('profile');
        // In production: fetch student profile using authenticated session
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  if (loginStep === 'mobile') {
    return (
      <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'system-ui' }}>
        <h1>Student Portal</h1>
        <div style={{ border: '1px solid #ddd', padding: '2rem', borderRadius: 8 }}>
          <label>Mobile Number:</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="+91 98765 43210"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.5rem',
              marginBottom: '1rem',
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          />
          <button
            onClick={handleRequestOtp}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Get OTP
          </button>
        </div>
      </div>
    );
  }

  if (loginStep === 'otp') {
    return (
      <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'system-ui' }}>
        <h1>Verify OTP</h1>
        <div style={{ border: '1px solid #ddd', padding: '2rem', borderRadius: 8 }}>
          <p>OTP sent to {mobile}</p>
          <label>Enter OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="000000"
            maxLength={6}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.5rem',
              marginBottom: '1rem',
              borderRadius: 4,
              border: '1px solid #ccc',
              fontSize: '1.5rem',
              textAlign: 'center',
              letterSpacing: '0.5rem',
            }}
          />
          <button
            onClick={handleVerifyOtp}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Verify
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem', fontFamily: 'system-ui' }}>
      <h1>Welcome Rahul</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8 }}>
          <div style={{ color: '#666', fontSize: '0.875rem' }}>Seat</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>A12</div>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8 }}>
          <div style={{ color: '#666', fontSize: '0.875rem' }}>Shift</div>
          <div style={{ fontSize: '1rem' }}>08:00 AM - 02:00 PM</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8 }}>
          <div style={{ color: '#666', fontSize: '0.875rem' }}>Membership</div>
          <div style={{ fontSize: '1rem' }}>Active until 10 Oct</div>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8 }}>
          <div style={{ color: '#666', fontSize: '0.875rem' }}>Payment Due</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>₹0</div>
        </div>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8, marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>Internet Status</h3>
        <div
          style={{
            padding: '1rem',
            background: '#dcfce7',
            borderRadius: 4,
            color: '#166534',
            fontWeight: 600,
          }}
        >
          ✓ Active
        </div>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>Registered Devices</h3>
        <ul style={{ paddingLeft: 18 }}>
          <li>📱 Phone</li>
          <li>💻 Laptop</li>
        </ul>
      </div>
    </div>
  );
}
