'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from 'context/AuthContext';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const router = useRouter();
  const { setToken } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('http://localhost:8000/signup/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Signup successful! Redirecting...');
      // Optional: Auto login
      const loginRes = await fetch('http://localhost:8000/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });

      const loginData = await loginRes.json();
      setToken(loginData.access);
      router.push('/dashboard');
    } else {
      setMessage(data.error || 'Signup failed');
    }
  }

  return (
    <div className="signForm">
      <form onSubmit={handleSubmit} className="p-4 bg-light rounded">
        <h2>Sign Up</h2>

        <input type="text" placeholder="Name" required
          onChange={(e) => setFormData({ ...formData, username: e.target.value })} />

        <input type="email" placeholder="Email" required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

        <input type="password" placeholder="Password" required
          onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

        <button type="submit">Sign Up</button>
        {message && <p>{message}</p>}
      </form>
      <Link href="/"><button>Close</button></Link>
    </div>
  );
}
