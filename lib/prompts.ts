export const evaluationPrompt = (judul: string, masalah: string, solusi: string) => `
Anda adalah evaluator proposal inovasi. Berikut adalah proposal yang perlu Anda nilai:
Judul: ${judul}
Rumusan Masalah: ${masalah}
Solusi: ${solusi}

1. Apakah ide ini termasuk breakthrough atau improvement?
2. Tolong berikan feedback 3-5 kalimat.
3. Berikan skor dampak terhadap OSL, NPL, NPS, LTV, dll. dalam format JSON.
`;
