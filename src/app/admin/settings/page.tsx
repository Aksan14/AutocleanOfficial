"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettings() {
  const router = useRouter();
  const [tab, setTab] = useState("create");
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Pengaturan Admin</h1>
        <div className="flex space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${tab === "create" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-800"}`}
            onClick={() => setTab("create")}
          >
            Buat User Baru
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${tab === "password" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-800"}`}
            onClick={() => setTab("password")}
          >
            Ubah Password
          </button>
        </div>
        {tab === "create" ? <CreateUserForm /> : <ChangePasswordForm />}
      </div>
    </div>
  );
}
function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    // Ambil email dari localStorage
    let email = "";
    if (typeof window !== "undefined") {
      email = window.localStorage.getItem("user") || "";
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/user/changepassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword
        })
      });
      const json = await res.json();
      if (json.code === 200) {
        setMessage("Password berhasil diubah!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(json.message || "Gagal mengubah password");
      }
    } catch (err) {
      setMessage("Gagal mengubah password");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">Password Lama</label>
        <input
          type="password"
          id="oldPassword"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          required
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          required
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Mengubah..." : "Ubah Password"}
      </button>
      {message && <p className="mt-4 text-sm text-center text-green-600">{message}</p>}
    </form>
  );
}

function CreateUserForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/user/createusers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (json.code === 200) {
        setMessage("User berhasil dibuat!");
        setEmail("");
        setPassword("");
      } else {
        setMessage(json.message || "Gagal membuat user");
      }
    } catch (err) {
      setMessage("Gagal membuat user");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Membuat..." : "Buat User"}
      </button>
      {message && <p className="mt-4 text-sm text-center text-green-600">{message}</p>}
    </form>
  );
}

