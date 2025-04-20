import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function evaluateProposal({ title, problem, solution }: {
  title: string,
  problem: string,
  solution: string
}) {
  const prompt = `
Berikut adalah proposal inovasi Pegadaian:

Judul: ${title}
Rumusan Masalah: ${problem}
Solusi: ${solution}

Tugas Anda adalah:
1. Tentukan apakah ide ini termasuk "Breakthrough" atau "Improvement".
2. Berikan feedback singkat (2-3 kalimat).
3. Nilai proposal dari sisi dampak bisnis dengan format JSON berikut:

{
  "classification": "Breakthrough / Improvement",
  "feedback": "Isi feedback",
  "scores": {
    "osl": nilai antara 1-10,
    "npl": 1-10,
    "nps": 1-10,
    "ltv": 1-10,
    "retention": 1-10
  }
}
`;

  const chat = await openai.chat.completions.create({
    // model: "gpt-4-turbo",
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Anda adalah evaluator AI untuk proposal bisnis." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
  });

  const result = chat.choices[0].message.content;

  // Ekstrak JSON dari output GPT
  const jsonMatch = result?.match(/\{[\s\S]+\}/);
  try {
    const parsed = JSON.parse(jsonMatch?.[0] || '');
    return parsed;
  } catch (e) {
    console.error("Gagal parse JSON AI:", e);
    return {
      classification: "Improvement",
      feedback: "Tidak ada feedback valid",
      scores: { osl: 5, npl: 5, nps: 5, ltv: 5, retention: 5 }
    };
  }
}
