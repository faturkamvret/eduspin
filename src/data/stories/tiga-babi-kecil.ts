import type { Story } from '@/types';

/**
 * Tiga Babi Kecil — public-domain English folk tale (first published 1843).
 * Adapted for ages 2-6. Theme: kerja keras, sebab-akibat, ketekunan.
 */
export const STORY_TIGA_BABI_KECIL: Story = {
  id: 'tiga-babi-kecil',
  title: 'Tiga Babi Kecil',
  tagline: 'Tiga babi yang membangun rumah berbeda',
  coverEmoji: '🐷',
  ageMin: 2,
  ageMax: 6,
  themeGradient:
    'linear-gradient(135deg, #ffc6d4 0%, #fda4af 50%, #fb7185 100%)',
  chapters: [
    {
      id: 'bab-1',
      title: 'Bab 1: Tiga Babi Kakak Beradik',
      illustration: '🐷',
      narration: [
        'Dahulu kala, ada tiga babi kecil yang hidup bersama ibu mereka.',
        'Suatu hari, ibu mereka berkata, "Sudah saatnya kalian membangun rumah sendiri-sendiri."',
        'Ketiga babi itu pun berangkat dengan riang.',
        'Mereka harus membangun rumah yang kuat untuk melindungi diri.',
      ],
      questions: [
        {
          id: 'tb1-q1',
          prompt: 'Berapa jumlah babi dalam cerita?',
          options: [
            { id: 'a', label: '2 babi', visual: '2️⃣' },
            { id: 'b', label: '3 babi', visual: '3️⃣' },
            { id: 'c', label: '5 babi', visual: '5️⃣' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'tb1-q2',
          prompt: 'Siapa yang menyuruh babi membangun rumah?',
          options: [
            { id: 'a', label: 'Ibu mereka', visual: '👵' },
            { id: 'b', label: 'Pak Petani', visual: '👨\u200d🌾' },
            { id: 'c', label: 'Raja hutan', visual: '👑' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'tb1-q3',
          prompt: 'Bagaimana perasaan babi-babi itu?',
          options: [
            { id: 'a', label: 'Sedih', visual: '😢' },
            { id: 'b', label: 'Riang', visual: '😄' },
            { id: 'c', label: 'Marah', visual: '😠' },
          ],
          correctOptionId: 'b',
        },
      ],
    },
    {
      id: 'bab-2',
      title: 'Bab 2: Rumah dari Jerami dan Kayu',
      illustration: '🏚️',
      narration: [
        'Babi pertama paling malas. Ia membangun rumah dari jerami, cepat selesai!',
        'Babi kedua sedikit lebih rajin. Ia membuat rumah dari kayu.',
        'Mereka cepat-cepat selesai supaya bisa main.',
        'Tapi rumah jerami dan kayu tidak terlalu kuat...',
      ],
      questions: [
        {
          id: 'tb2-q1',
          prompt: 'Babi pertama membangun rumah dari apa?',
          options: [
            { id: 'a', label: 'Jerami', visual: '🌾' },
            { id: 'b', label: 'Batu', visual: '🪨' },
            { id: 'c', label: 'Es', visual: '🧊' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'tb2-q2',
          prompt: 'Babi kedua menggunakan bahan apa?',
          options: [
            { id: 'a', label: 'Kayu', visual: '🪵' },
            { id: 'b', label: 'Pasir', visual: '🏖️' },
            { id: 'c', label: 'Karton', visual: '📦' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'tb2-q3',
          prompt: 'Mengapa mereka cepat-cepat menyelesaikan rumahnya?',
          options: [
            { id: 'a', label: 'Supaya bisa main', visual: '⚽' },
            { id: 'b', label: 'Supaya bisa tidur', visual: '😴' },
            { id: 'c', label: 'Supaya bisa makan', visual: '🍔' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-3',
      title: 'Bab 3: Rumah Batu yang Kokoh',
      illustration: '🧱',
      narration: [
        'Babi ketiga paling rajin. Ia membangun rumah dari batu bata.',
        'Pelan-pelan, batu disusun satu per satu.',
        'Kakaknya mengejek, "Lambat sekali kamu! Rumah kami sudah selesai!"',
        'Tapi babi ketiga tetap tekun bekerja sampai rumahnya kuat dan kokoh.',
      ],
      questions: [
        {
          id: 'tb3-q1',
          prompt: 'Babi ketiga pakai bahan apa?',
          options: [
            { id: 'a', label: 'Batu bata', visual: '🧱' },
            { id: 'b', label: 'Daun pisang', visual: '🍃' },
            { id: 'c', label: 'Plastik', visual: '🥤' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'tb3-q2',
          prompt: 'Bagaimana cara babi ketiga bekerja?',
          options: [
            { id: 'a', label: 'Tergesa-gesa', visual: '💨' },
            { id: 'b', label: 'Tekun dan pelan-pelan', visual: '💪' },
            { id: 'c', label: 'Sambil tidur', visual: '😴' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'tb3-q3',
          prompt: 'Apa yang dilakukan kakaknya?',
          options: [
            { id: 'a', label: 'Membantunya', visual: '🤝' },
            { id: 'b', label: 'Mengejeknya', visual: '😏' },
            { id: 'c', label: 'Memberi makan', visual: '🍎' },
          ],
          correctOptionId: 'b',
        },
      ],
    },
    {
      id: 'bab-4',
      title: 'Bab 4: Serigala Datang',
      illustration: '🐺',
      narration: [
        'Tiba-tiba, datang serigala lapar! Ia meniup rumah jerami: "Fuuuh!" — rumah roboh!',
        'Babi pertama lari ke rumah kayu. Serigala meniup lagi — rumah kayu juga roboh!',
        'Kedua babi lari ke rumah batu. Serigala meniup sekuat tenaga, tapi rumah tidak bergerak!',
        'Akhirnya, serigala menyerah dan pergi. Babi-babi pun aman. Pelajaran: kerja keras berbuah manis!',
      ],
      questions: [
        {
          id: 'tb4-q1',
          prompt: 'Siapa yang datang mengganggu?',
          options: [
            { id: 'a', label: 'Serigala', visual: '🐺' },
            { id: 'b', label: 'Beruang', visual: '🐻' },
            { id: 'c', label: 'Singa', visual: '🦁' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'tb4-q2',
          prompt: 'Rumah mana yang tidak bisa dirobohkan?',
          options: [
            { id: 'a', label: 'Rumah jerami', visual: '🌾' },
            { id: 'b', label: 'Rumah kayu', visual: '🪵' },
            { id: 'c', label: 'Rumah batu', visual: '🧱' },
          ],
          correctOptionId: 'c',
        },
        {
          id: 'tb4-q3',
          prompt: 'Apa pelajaran dari cerita ini?',
          options: [
            { id: 'a', label: 'Bermalas-malasan itu baik', visual: '😴' },
            { id: 'b', label: 'Kerja keras berbuah manis', visual: '💪' },
            { id: 'c', label: 'Lari saja kalau ada masalah', visual: '🏃' },
          ],
          correctOptionId: 'b',
        },
      ],
    },
  ],
};
