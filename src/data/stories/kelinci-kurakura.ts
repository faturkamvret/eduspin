import type { Story } from '@/types';

/**
 * Kelinci dan Kura-kura — public-domain Aesop fable.
 * Adapted for ages 2-6 with simple Bahasa, friendly tone, and 4 chapters.
 */
export const STORY_KELINCI_KURAKURA: Story = {
  id: 'kelinci-kurakura',
  title: 'Kelinci dan Kura-kura',
  tagline: 'Lomba lari yang penuh kejutan',
  coverEmoji: '🐰',
  ageMin: 2,
  ageMax: 6,
  themeGradient:
    'linear-gradient(135deg, #ffc6d4 0%, #ff8fa3 50%, #f472b6 100%)',
  chapters: [
    {
      id: 'bab-1',
      title: 'Bab 1: Tantangan Lomba',
      illustration: '🐰',
      narration: [
        'Di sebuah hutan kecil, Kelinci suka sekali memamerkan larinya yang cepat.',
        '"Tidak ada yang bisa mengalahkanku!" katanya bangga.',
        'Kura-kura yang lewat berkata, "Ayo kita lomba lari!"',
        'Kelinci tertawa. "Hahaha, kamu yakin? Kakimu kan pendek!"',
      ],
      questions: [
        {
          id: 'kk1-q1',
          prompt: 'Siapa yang suka memamerkan larinya?',
          options: [
            { id: 'a', label: 'Kelinci', visual: '🐰' },
            { id: 'b', label: 'Kucing', visual: '🐱' },
            { id: 'c', label: 'Anjing', visual: '🐶' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'kk1-q2',
          prompt: 'Siapa yang menantang Kelinci lomba lari?',
          options: [
            { id: 'a', label: 'Kura-kura', visual: '🐢' },
            { id: 'b', label: 'Burung', visual: '🐦' },
            { id: 'c', label: 'Tikus', visual: '🐭' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'kk1-q3',
          prompt: 'Bagaimana sikap Kelinci saat ditantang?',
          options: [
            { id: 'a', label: 'Sopan dan ramah', visual: '😊' },
            { id: 'b', label: 'Sombong dan tertawa', visual: '😏' },
            { id: 'c', label: 'Takut dan menangis', visual: '😢' },
          ],
          correctOptionId: 'b',
        },
      ],
    },
    {
      id: 'bab-2',
      title: 'Bab 2: Lomba Dimulai',
      illustration: '🏁',
      narration: [
        'Pada hari lomba, semua hewan berkumpul untuk menonton.',
        'Pak Beruang berteriak, "Satu, dua, tiga, mulai!"',
        'Kelinci langsung melesat seperti angin: cepat sekali!',
        'Kura-kura berjalan pelan-pelan, tap... tap... tap...',
      ],
      questions: [
        {
          id: 'kk2-q1',
          prompt: 'Siapa yang memberi aba-aba mulai?',
          options: [
            { id: 'a', label: 'Pak Beruang', visual: '🐻' },
            { id: 'b', label: 'Pak Singa', visual: '🦁' },
            { id: 'c', label: 'Pak Tupai', visual: '🐿️' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'kk2-q2',
          prompt: 'Bagaimana Kelinci berlari?',
          options: [
            { id: 'a', label: 'Cepat sekali', visual: '💨' },
            { id: 'b', label: 'Pelan-pelan', visual: '🐌' },
            { id: 'c', label: 'Sambil tidur', visual: '😴' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'kk2-q3',
          prompt: 'Bagaimana Kura-kura berjalan?',
          options: [
            { id: 'a', label: 'Cepat seperti angin', visual: '💨' },
            { id: 'b', label: 'Pelan-pelan tapi terus', visual: '🐢' },
            { id: 'c', label: 'Melompat tinggi', visual: '🦘' },
          ],
          correctOptionId: 'b',
        },
      ],
    },
    {
      id: 'bab-3',
      title: 'Bab 3: Kelinci Tidur Siang',
      illustration: '😴',
      narration: [
        'Kelinci sudah jauh sekali di depan. Ia melihat ke belakang.',
        '"Kura-kura masih jauh, aku istirahat dulu," kata Kelinci.',
        'Ia berbaring di bawah pohon yang rindang.',
        'Tanpa sadar, Kelinci pun tertidur pulas: kruuuk... pyuuuh...',
      ],
      questions: [
        {
          id: 'kk3-q1',
          prompt: 'Mengapa Kelinci berhenti dan istirahat?',
          options: [
            { id: 'a', label: 'Merasa sudah jauh di depan', visual: '🥱' },
            { id: 'b', label: 'Kakinya sakit', visual: '🦵' },
            { id: 'c', label: 'Hujan turun', visual: '🌧️' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'kk3-q2',
          prompt: 'Di mana Kelinci berbaring?',
          options: [
            { id: 'a', label: 'Di pinggir jalan', visual: '🛣️' },
            { id: 'b', label: 'Di bawah pohon', visual: '🌳' },
            { id: 'c', label: 'Di dalam rumah', visual: '🏠' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'kk3-q3',
          prompt: 'Apa yang terjadi pada Kelinci?',
          options: [
            { id: 'a', label: 'Tertidur pulas', visual: '😴' },
            { id: 'b', label: 'Berlari lebih cepat', visual: '💨' },
            { id: 'c', label: 'Pulang ke rumah', visual: '🏠' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-4',
      title: 'Bab 4: Kura-kura Menang!',
      illustration: '🏆',
      narration: [
        'Sementara itu, Kura-kura terus berjalan tanpa berhenti.',
        'Tap, tap, tap... ia melewati Kelinci yang sedang tidur.',
        'Yeay! Kura-kura sampai di garis finis lebih dulu!',
        '"Pelan tapi tekun lebih baik daripada cepat tapi sombong," katanya tersenyum.',
      ],
      questions: [
        {
          id: 'kk4-q1',
          prompt: 'Siapa yang menang lomba?',
          options: [
            { id: 'a', label: 'Kura-kura', visual: '🐢' },
            { id: 'b', label: 'Kelinci', visual: '🐰' },
            { id: 'c', label: 'Pak Beruang', visual: '🐻' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'kk4-q2',
          prompt: 'Kenapa Kura-kura bisa menang?',
          options: [
            { id: 'a', label: 'Karena terus berusaha tanpa berhenti', visual: '💪' },
            { id: 'b', label: 'Karena pakai sepatu cepat', visual: '👟' },
            { id: 'c', label: 'Karena Kelinci tersesat', visual: '❓' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'kk4-q3',
          prompt: 'Pelajaran dari cerita ini?',
          options: [
            { id: 'a', label: 'Sombong itu baik', visual: '😏' },
            { id: 'b', label: 'Pelan tapi tekun lebih baik', visual: '🐢' },
            { id: 'c', label: 'Tidur saat lomba', visual: '😴' },
          ],
          correctOptionId: 'b',
        },
      ],
    },
  ],
};
