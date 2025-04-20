'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Proposal = {
  id: string;
  title: string;
  status: string;
  aiScore: {
    classification: string;
    scoreJson: {
      osl: number;
      npl: number;
      nps: number;
      ltv: number;
      retention: number;
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

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard Peserta</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Judul</th>
              <th className="p-2">Status</th>
              <th className="p-2">Klasifikasi</th>
              <th className="p-2">OSL</th>
              <th className="p-2">NPL</th>
              <th className="p-2">NPS</th>
              <th className="p-2">LTV</th>
              <th className="p-2">Retention</th>
              <th className="p-2">Feedback</th>
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
                <td className="p-2">{p.aiScore ? p.aiScore.classification || '-' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="bg-blue-600 text-white px-4 py-2" onClick={() => router.push('/submit')}>submit proposal</button>
    </main>
  );
}
