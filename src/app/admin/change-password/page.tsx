'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Fungsi untuk decode JWT dan ambil payload
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function ChangePassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Ambil token dari localStorage
  let userId = '';
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('adminToken');
    if (token) {
      const payload = parseJwt(token);
      userId = payload?.nra || '';
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/user/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${window.localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({
          id: userId,
          password,
        }),
      });
      const json = await res.json();
      if (res.ok && json.code === 200) {
        setSuccess('Password berhasil diupdate!');
        setPassword('');
      } else {
        setError(json.message || 'Gagal update password.');
      }
    } catch (err) {
      setError('Gagal update password, silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Update Password</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
        <div className="mb-4">
          <label className="block mb-2">Password Baru</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          disabled={loading}
        >
          {loading ? 'Mengupdate...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
