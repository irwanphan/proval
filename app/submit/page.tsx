'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function SubmitProposalPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: 'Digital Gold Savings for Unbanked Communities',
    problem: 'Banyak masyarakat di daerah rural Indonesia belum memiliki akses ke tabungan emas yang aman dan terjangkau. Mereka masih menyimpan emas secara fisik dengan risiko tinggi kehilangan atau pencurian.',
    solution: 'Mengembangkan platform tabungan emas digital berbasis mobile yang terintegrasi dengan Pegadaian. Platform ini memungkinkan masyarakat menabung emas mulai dari Rp10.000 tanpa harus datang ke outlet, cukup melalui aplikasi dan jaringan agen lokal.',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'email') {
      if (!value.endsWith('@pegadaian.com')) {
        setEmailError('Email harus menggunakan domain @pegadaian.com');
      } else {
        setEmailError('');
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.endsWith('@pegadaian.com')) {
      setEmailError('Email harus menggunakan domain @pegadaian.com');
      return;
    }
    
    setLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => form.append(key, val));
      if (file) form.append('file', file);

      const res = await fetch('/api/submit', {
        method: 'POST',
        body: form
      });

      const result = await res.json();
      alert(result.message);
    } catch (error) {
      alert('Gagal submit proposal ' + error);
    } finally {
      setLoading(false);
      router.push('/dashboard');
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Link href="/dashboard" className="hover:text-gray-400 transition-colors duration-200"><ChevronLeft /></Link>
        Submit Proposal
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        Data default digunakan untuk kebutuhan pengujian, silahkan isi data yang sesuai untuk penggunaan yang sebenarnya atau simulasi lanjutannya.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="space-y-2 p-4 border rounded-md">
          <legend>Data Pengguna</legend>
          <small className="text-sm text-gray-500">
            Data pengguna digunakan untuk identifikasi pengguna dan untuk pengiriman hasil pengujian. Pada production, data pengguna diambil dari sesi login pengguna.
          </small>
          <label className="block">Nama</label>
          <input name="name" placeholder="Your Name" required value={formData.name} onChange={handleChange} className="w-full border p-2" />
          <label className="block">Email</label>
          <div className="space-y-1">
            <input 
              name="email" 
              type="email" 
              placeholder="nama@pegadaian.com" 
              pattern=".+@pegadaian\.com$"
              title="Gunakan email dengan domain @pegadaian.com"
              required 
              value={formData.email} 
              onChange={handleChange} 
              className={`w-full border p-2 ${emailError ? 'border-red-500' : ''}`}
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>
        </fieldset>
        <fieldset className="space-y-2 p-4 border rounded-md">
          <legend>Data Proposal</legend>
          <label className="block">Judul Proposal</label>
          <input name="title" placeholder="Proposal Title" required value={formData.title} onChange={handleChange} className="w-full border p-2" />
          <label className="block">Problem Statement</label>
          <textarea name="problem" placeholder="Problem Statement" required value={formData.problem} onChange={handleChange} className="w-full border p-2" />
          <label className="block">Proposed Solution</label>
          <textarea name="solution" placeholder="Proposed Solution" required value={formData.solution} onChange={handleChange} className="w-full border p-2" />
        </fieldset>
        <fieldset className="space-y-2 p-4 border rounded-md">
          <legend>File Pendukung</legend>
          <small className="text-sm text-gray-500">
            File yang diupload harus berupa file PDF. File bersifat opsional, jika tidak diisi maka akan dianggap proposal tidak memiliki file. 
          </small>
          <label className="block">File</label>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full border p-2" />
        </fieldset>
        <button type="submit" disabled={loading} 
          className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </main>
  );
}
