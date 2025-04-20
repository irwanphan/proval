'use client'

import { useState } from 'react'

export default function SubmitProposalPage() {
  const [formData, setFormData] = useState({
    name: 'Irwan Phan',
    email: 'irwanphan@pegadaian.com',
    title: 'Digital Gold Savings for Unbanked Communities',
    problem: 'Banyak masyarakat di daerah rural Indonesia belum memiliki akses ke tabungan emas yang aman dan terjangkau. Mereka masih menyimpan emas secara fisik dengan risiko tinggi kehilangan atau pencurian.',
    solution: 'Mengembangkan platform tabungan emas digital berbasis mobile yang terintegrasi dengan Pegadaian. Platform ini memungkinkan masyarakat menabung emas mulai dari Rp10.000 tanpa harus datang ke outlet, cukup melalui aplikasi dan jaringan agen lokal.',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => form.append(key, val));
    if (file) form.append('file', file);

    const res = await fetch('/api/submit', {
      method: 'POST',
      body: form
    });

    const result = await res.json();
    alert(result.message);
    setLoading(false);
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit Proposal</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Your Name" required value={formData.name} onChange={handleChange} className="w-full border p-2" />
        <input name="email" placeholder="Your Email" required value={formData.email} onChange={handleChange} className="w-full border p-2" />
        <input name="title" placeholder="Proposal Title" required value={formData.title} onChange={handleChange} className="w-full border p-2" />
        <textarea name="problem" placeholder="Problem Statement" required value={formData.problem} onChange={handleChange} className="w-full border p-2" />
        <textarea name="solution" placeholder="Proposed Solution" required value={formData.solution} onChange={handleChange} className="w-full border p-2" />
        <input type="file" required onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full border p-2" />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </main>
  );
}
