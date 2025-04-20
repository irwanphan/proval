import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <main className="max-w-2xl">
        <h1 className="text-5xl font-bold mb-2">Proval_</h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-6">Proposal Evaluator</h2>
        
        <p className="text-lg text-gray-700 mb-8">
          Platform evaluasi proposal inovasi yang menggunakan AI untuk membantu menilai 
          dampak dan kelayakan ide Anda. Dapatkan feedback cepat dan objektif untuk 
          meningkatkan kualitas proposal.
        </p>

        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Lihat Dashboard
          <ArrowRight size={20} />
        </Link>
      </main>
    </div>
  );
}
