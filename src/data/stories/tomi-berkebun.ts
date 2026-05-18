import type { Story } from '@/types';

/**
 * Tomi Belajar Berkebun — original story.
 * Theme: kesabaran, sains alam (tumbuhan butuh air & matahari), kerja keras
 *        membuahkan hasil.
 * Age 3-6. Mengajarkan proses tumbuh dan tanggung jawab merawat sesuatu.
 */
export const STORY_TOMI_BERKEBUN: Story = {
  id: 'tomi-berkebun',
  title: 'Tomi Belajar Berkebun',
  tagline: 'Dari biji kecil menjadi tomat merah',
  coverEmoji: '🌱',
  ageMin: 3,
  ageMax: 6,
  themeGradient:
    'linear-gradient(135deg, #d9f99d 0%, #a3e635 50%, #65a30d 100%)',
  chapters: [
    {
      id: 'bab-1',
      title: 'Bab 1: Hadiah dari Kakek',
      illustration: '👴',
      narration: [
        'Suatu Minggu pagi, Kakek datang mengunjungi Tomi.',
        'Kakek membawa amplop kecil berisi biji-biji kecil berwarna kuning.',
        '"Ini biji tomat, Tomi. Yuk, kita tanam di pot," kata Kakek.',
        'Mata Tomi berbinar-binar. Ia tidak sabar mulai berkebun!',
      ],
      questions: [
        {
          id: 'tk1-q1',
          prompt: 'Siapa yang datang ke rumah Tomi?',
          options: [
            { id: 'a', label: 'Kakek', visual: '👴' },
            { id: 'b', label: 'Paman', visual: '🧑' },
            { id: 'c', label: 'Tetangga', visual: '👨' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'tk1-q2',
          prompt: 'Apa yang dibawa Kakek?',
          options: [
            { id: 'a', label: 'Biji tomat', visual: '🌱' },
            { id: 'b', label: 'Buku cerita', visual: '📚' },
            { id: 'c', label: 'Mainan baru', visual: '🧸' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'tk1-q3',
          prompt: 'Bagaimana perasaan Tomi?',
          options: [
            { id: 'a', label: 'Bersemangat', visual: '🤩' },
            { id: 'b', label: 'Bosan', visual: '🥱' },
            { id: 'c', label: 'Takut', visual: '😨' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-2',
      title: 'Bab 2: Menanam Bersama',
      illustration: '🪴',
      narration: [
        'Kakek mengisi pot dengan tanah yang gembur.',
        'Tomi membuat lubang kecil dengan jarinya, lalu memasukkan tiga biji tomat.',
        'Mereka menutupnya dengan tanah dan menyiramnya pelan-pelan.',
        '"Sekarang, tanaman butuh apa supaya tumbuh?" tanya Kakek.',
      ],
      questions: [
        {
          id: 'tk2-q1',
          prompt: 'Berapa biji tomat yang Tomi tanam?',
          options: [
            { id: 'a', label: '1 biji', visual: '1️⃣' },
            { id: 'b', label: '3 biji', visual: '3️⃣' },
            { id: 'c', label: '10 biji', visual: '🔟' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'tk2-q2',
          prompt: 'Pakai apa Tomi membuat lubang di tanah?',
          options: [
            { id: 'a', label: 'Jarinya', visual: '☝️' },
            { id: 'b', label: 'Sendok besar', visual: '🥄' },
            { id: 'c', label: 'Pisau tajam', visual: '🔪' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'tk2-q3',
          prompt: 'Setelah menanam, biji ditutup dengan apa?',
          options: [
            { id: 'a', label: 'Tanah', visual: '🟫' },
            { id: 'b', label: 'Plastik', visual: '🥤' },
            { id: 'c', label: 'Kertas', visual: '📄' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-3',
      title: 'Bab 3: Sabar Menunggu',
      illustration: '⏳',
      narration: [
        'Tomi menyiram potnya setiap pagi dan meletakkannya di dekat jendela.',
        'Tanaman butuh air dan sinar matahari supaya bisa tumbuh.',
        'Hari demi hari, Tomi memeriksa potnya dengan sabar.',
        'Setelah seminggu — yey! Daun hijau kecil mulai muncul!',
      ],
      questions: [
        {
          id: 'tk3-q1',
          prompt: 'Tanaman butuh apa untuk tumbuh?',
          options: [
            { id: 'a', label: 'Air dan matahari', visual: '☀️' },
            { id: 'b', label: 'Cokelat dan permen', visual: '🍫' },
            { id: 'c', label: 'Listrik dan kabel', visual: '🔌' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'tk3-q2',
          prompt: 'Berapa lama Tomi menunggu sampai tunas muncul?',
          options: [
            { id: 'a', label: 'Satu hari', visual: '1️⃣' },
            { id: 'b', label: 'Satu minggu', visual: '7️⃣' },
            { id: 'c', label: 'Satu jam', visual: '⏰' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'tk3-q3',
          prompt: 'Apa warna daun yang muncul pertama kali?',
          options: [
            { id: 'a', label: 'Hijau', visual: '🟢' },
            { id: 'b', label: 'Merah', visual: '🔴' },
            { id: 'c', label: 'Hitam', visual: '⚫' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-4',
      title: 'Bab 4: Tomat Pertamaku!',
      illustration: '🍅',
      narration: [
        'Setelah berbulan-bulan dirawat, tanaman tumbuh tinggi.',
        'Bunga-bunga kuning muncul, lalu berubah menjadi tomat hijau kecil.',
        'Pelan-pelan, tomat itu menjadi merah berkilau dan matang.',
        'Tomi memetik tomatnya dengan bangga. "Aku berhasil menanam!"',
      ],
      questions: [
        {
          id: 'tk4-q1',
          prompt: 'Sebelum jadi tomat, apa yang muncul lebih dulu?',
          options: [
            { id: 'a', label: 'Bunga kuning', visual: '🌼' },
            { id: 'b', label: 'Buah pir', visual: '🍐' },
            { id: 'c', label: 'Akar besar', visual: '🌳' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'tk4-q2',
          prompt: 'Apa warna tomat yang sudah matang?',
          options: [
            { id: 'a', label: 'Merah', visual: '🔴' },
            { id: 'b', label: 'Biru', visual: '🔵' },
            { id: 'c', label: 'Hitam', visual: '⚫' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'tk4-q3',
          prompt: 'Apa pelajaran dari cerita ini?',
          options: [
            { id: 'a', label: 'Kerja keras dan sabar berbuah manis', visual: '💪' },
            { id: 'b', label: 'Tanaman tumbuh sendiri tanpa dirawat', visual: '🚫' },
            { id: 'c', label: 'Tidak perlu menanam, beli saja', visual: '🛒' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
  ],
};
