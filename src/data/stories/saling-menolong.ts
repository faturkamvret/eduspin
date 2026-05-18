import type { Story } from '@/types';

/**
 * Saling Menolong di Sekolah — original story for Squizzy.
 * Theme: empati, tolong-menolong, persahabatan, mengatasi kesulitan bersama.
 * Age 3-6. Mengajarkan anak bahwa membantu teman membuat semua orang bahagia.
 */
export const STORY_SALING_MENOLONG: Story = {
  id: 'saling-menolong',
  title: 'Saling Menolong di Sekolah',
  tagline: 'Dito belajar bahwa membantu teman itu menyenangkan',
  coverEmoji: '🤝',
  ageMin: 3,
  ageMax: 6,
  themeGradient:
    'linear-gradient(135deg, #bdf5d8 0%, #86efac 50%, #34d399 100%)',
  chapters: [
    {
      id: 'bab-1',
      title: 'Bab 1: Hari Pertama Sekolah',
      illustration: '🎒',
      narration: [
        'Pagi yang cerah, Dito sudah siap dengan tas dan sepatu barunya.',
        'Hari ini hari pertama Dito masuk sekolah TK Pelangi.',
        'Di kelas, Dito melihat anak baru bernama Mira sedang menangis.',
        'Mira tidak punya teman dan merasa takut sendirian.',
      ],
      questions: [
        {
          id: 'sm1-q1',
          prompt: 'Siapa nama tokoh utama dalam cerita?',
          options: [
            { id: 'a', label: 'Dito', visual: '👦' },
            { id: 'b', label: 'Mira', visual: '👧' },
            { id: 'c', label: 'Bu Guru', visual: '👩\u200d🏫' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'sm1-q2',
          prompt: 'Mengapa Mira menangis?',
          options: [
            { id: 'a', label: 'Karena haus', visual: '💧' },
            { id: 'b', label: 'Karena takut sendirian', visual: '😢' },
            { id: 'c', label: 'Karena lapar', visual: '🍔' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'sm1-q3',
          prompt: 'Apa nama sekolah Dito?',
          options: [
            { id: 'a', label: 'TK Bintang', visual: '⭐' },
            { id: 'b', label: 'TK Pelangi', visual: '🌈' },
            { id: 'c', label: 'TK Bunga', visual: '🌸' },
          ],
          correctOptionId: 'b',
        },
      ],
    },
    {
      id: 'bab-2',
      title: 'Bab 2: Mengulurkan Tangan',
      illustration: '🤝',
      narration: [
        'Dito mendekati Mira dengan senyum hangat.',
        '"Hai, namaku Dito. Yuk, kita main bersama!"',
        'Ia mengajak Mira duduk di meja yang sama.',
        'Mira pun mulai tersenyum dan berhenti menangis.',
      ],
      questions: [
        {
          id: 'sm2-q1',
          prompt: 'Apa yang dilakukan Dito kepada Mira?',
          options: [
            { id: 'a', label: 'Mengejeknya', visual: '😏' },
            { id: 'b', label: 'Mengajaknya bermain', visual: '🤗' },
            { id: 'c', label: 'Pergi menjauh', visual: '🚶' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'sm2-q2',
          prompt: 'Bagaimana cara Dito menyapa Mira?',
          options: [
            { id: 'a', label: 'Dengan senyum hangat', visual: '😊' },
            { id: 'b', label: 'Dengan suara keras', visual: '📢' },
            { id: 'c', label: 'Tanpa berkata apa-apa', visual: '🤐' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'sm2-q3',
          prompt: 'Bagaimana perasaan Mira setelah ditemani?',
          options: [
            { id: 'a', label: 'Mulai tersenyum', visual: '😊' },
            { id: 'b', label: 'Semakin menangis', visual: '😭' },
            { id: 'c', label: 'Marah', visual: '😠' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-3',
      title: 'Bab 3: Saat Pelajaran Mewarnai',
      illustration: '🎨',
      narration: [
        'Saat pelajaran mewarnai, Mira tidak punya pensil hijau.',
        'Padahal ia ingin mewarnai daun di gambar pohonnya.',
        'Tanpa ragu, Dito meminjamkan pensil hijaunya.',
        '"Pakai punyaku, Mira. Kita bagi!" katanya senang.',
      ],
      questions: [
        {
          id: 'sm3-q1',
          prompt: 'Pensil warna apa yang tidak dimiliki Mira?',
          options: [
            { id: 'a', label: 'Merah', visual: '🟥' },
            { id: 'b', label: 'Hijau', visual: '🟩' },
            { id: 'c', label: 'Biru', visual: '🟦' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'sm3-q2',
          prompt: 'Apa yang Dito lakukan?',
          options: [
            { id: 'a', label: 'Meminjamkan pensilnya', visual: '✏️' },
            { id: 'b', label: 'Menyembunyikan pensilnya', visual: '🙈' },
            { id: 'c', label: 'Menjual pensilnya', visual: '💰' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'sm3-q3',
          prompt: 'Mira ingin mewarnai apa?',
          options: [
            { id: 'a', label: 'Daun di pohon', visual: '🌳' },
            { id: 'b', label: 'Mobil', visual: '🚗' },
            { id: 'c', label: 'Bunga merah', visual: '🌹' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-4',
      title: 'Bab 4: Pelajaran Dari Bu Guru',
      illustration: '🌟',
      narration: [
        'Bu Guru melihat kebaikan Dito dan tersenyum bangga.',
        '"Anak-anak, kita semua bisa saling membantu," katanya.',
        '"Membantu teman membuat hati kita bahagia."',
        'Dito dan Mira pun jadi sahabat. Ternyata menolong itu menyenangkan!',
      ],
      questions: [
        {
          id: 'sm4-q1',
          prompt: 'Siapa yang melihat kebaikan Dito?',
          options: [
            { id: 'a', label: 'Bu Guru', visual: '👩\u200d🏫' },
            { id: 'b', label: 'Mama', visual: '👩' },
            { id: 'c', label: 'Pak Sopir', visual: '👨' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'sm4-q2',
          prompt: 'Apa pelajaran dari cerita ini?',
          options: [
            { id: 'a', label: 'Membantu teman membuat hati bahagia', visual: '💖' },
            { id: 'b', label: 'Lebih baik main sendiri', visual: '😐' },
            { id: 'c', label: 'Hanya teman dekat yang ditolong', visual: '🚫' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'sm4-q3',
          prompt: 'Bagaimana akhir hubungan Dito dan Mira?',
          options: [
            { id: 'a', label: 'Jadi sahabat baik', visual: '👫' },
            { id: 'b', label: 'Tidak saling kenal', visual: '🚫' },
            { id: 'c', label: 'Bertengkar setiap hari', visual: '😡' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
  ],
};
