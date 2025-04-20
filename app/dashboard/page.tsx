'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileDown } from 'lucide-react';
import Link from 'next/link';
type Proposal = {
  id: string;
  title: string;
  status: string;
  documentUrl: string;
  aiScore: {
    classification: string;
    scoreJson: {
      osl: number;
      npl: number;
      nps: number;
      ltv: number;
      retention: number;
      feedback: string;
    };
    createdAt: string;
  } | null;
};

export default function DashboardPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    fetch('/api/proposals')
      .then((res) => res.json())
      .then((data) => {
        setProposals(data.proposals);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Dashboard Peserta</h1>
        <Link href="/" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">About This Project</Link>
      </div>
      {proposals.length === 0 ? (
        <p>No proposals found</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-sm text-left">Judul</th>
              <th className="p-2 text-sm">Status</th>
              <th className="p-2 text-sm">Klasifikasi</th>
              <th className="p-2 text-sm">OSL</th>
              <th className="p-2 text-sm">NPL</th>
              <th className="p-2 text-sm">NPS</th>
              <th className="p-2 text-sm">LTV</th>
              <th className="p-2 text-sm">Retention</th>
              <th className="p-2 text-sm">File Pendukung</th>
              <th className="p-2 text-sm">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.status}</td>
                <td className="p-2">{p.aiScore?.classification || '-'}</td>
                <td className="p-2">{p.aiScore?.scoreJson.osl ?? '-'}</td>
                <td className="p-2">{p.aiScore?.scoreJson.npl ?? '-'}</td>
                <td className="p-2">{p.aiScore?.scoreJson.nps ?? '-'}</td>
                <td className="p-2">{p.aiScore?.scoreJson.ltv ?? '-'}</td>
                <td className="p-2">{p.aiScore?.scoreJson.retention ?? '-'}</td>
                <td className="p-2 text-center">
                  {p.documentUrl ? (
                    <a 
                      href={p.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      title={`Download file: ${p.documentUrl}`}
                      onClick={(e) => {
                        if (!p.documentUrl.startsWith('http')) {
                          e.preventDefault();
                          alert('Invalid URL: ' + p.documentUrl);
                        }
                      }}
                    >
                      <FileDown size={18} />
                    </a>
                  ) : (
                    <span className="text-gray-400" title="No file uploaded">-</span>
                  )}
                </td>
                <td className="p-2">
                  <p className='text-xs'>
                    {p.aiScore?.scoreJson.feedback ?? '-'}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="bg-blue-600 text-white px-4 py-2 mt-4 hover:bg-blue-700 rounded-md transition-colors duration-300" onClick={() => router.push('/submit')}>submit proposal</button>
    </main>
  );
}
