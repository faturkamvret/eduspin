import type { Story } from '@/types';

/**
 * Sikat Gigi Bersama Beruang — original story.
 * Theme: kebersihan diri, rutinitas harian, kesehatan gigi.
 * Age 2-6. Mengajarkan kebiasaan menyikat gigi dengan cara yang lucu.
 */
export const STORY_SIKAT_GIGI_BERUANG: Story = {
  id: 'sikat-gigi-beruang',
  title: 'Sikat Gigi Bersama Beruang',
  tagline: 'Bobi belajar pentingnya gigi yang bersih',
  coverEmoji: '🦷',
  ageMin: 2,
  ageMax: 6,
  themeGradient:
    'linear-gradient(135deg, #bae3ff 0%, #93c5fd 50%, #6366f1 100%)',
  chapters: [
    {
      id: 'bab-1',
      title: 'Bab 1: Sakit Gigi',
      illustration: '🐻',
      narration: [
        'Bobi adalah beruang kecil yang suka makan madu.',
        'Setiap hari, ia makan madu pagi, siang, dan malam.',
        'Tapi Bobi tidak suka menyikat gigi. "Ah, ribet!" katanya.',
        'Suatu malam, Bobi merasakan giginya sakit sekali. "Aduuuh!"',
      ],
      questions: [
        {
          id: 'sg1-q1',
          prompt: 'Siapa nama beruang dalam cerita?',
          options: [
            { id: 'a', label: 'Bobi', visual: '🐻' },
            { id: 'b', label: 'Doni', visual: '🐶' },
            { id: 'c', label: 'Pino', visual: '🐧' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'sg1-q2',
          prompt: 'Apa makanan favorit Bobi?',
          options: [
            { id: 'a', label: 'Madu', visual: '🍯' },
            { id: 'b', label: 'Wortel', visual: '🥕' },
            { id: 'c', label: 'Pizza', visual: '🍕' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'sg1-q3',
          prompt: 'Mengapa gigi Bobi sakit?',
          options: [
            { id: 'a', label: 'Karena tidak menyikat gigi', visual: '🚫' },
            { id: 'b', label: 'Karena terjatuh', visual: '🤕' },
            { id: 'c', label: 'Karena kedinginan', visual: '🥶' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-2',
      title: 'Bab 2: Pergi ke Dokter Gigi',
      illustration: '🩺',
      narration: [
        'Mama Beruang membawa Bobi ke Dokter Tupai.',
        'Dokter Tupai memeriksa gigi Bobi dengan cermin kecil.',
        '"Ada lubang kecil di gigimu, Bobi. Karena banyak sisa makanan."',
        '"Gigi yang tidak disikat akan rusak," jelas Dokter Tupai.',
      ],
      questions: [
        {
          id: 'sg2-q1',
          prompt: 'Siapa nama dokternya?',
          options: [
            { id: 'a', label: 'Dokter Tupai', visual: '🐿️' },
            { id: 'b', label: 'Dokter Kelinci', visual: '🐰' },
            { id: 'c', label: 'Dokter Kucing', visual: '🐱' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'sg2-q2',
          prompt: 'Apa yang ditemukan di gigi Bobi?',
          options: [
            { id: 'a', label: 'Lubang kecil', visual: '🦷' },
            { id: 'b', label: 'Permen ajaib', visual: '🍬' },
            { id: 'c', label: 'Bunga', visual: '🌸' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'sg2-q3',
          prompt: 'Apa yang menyebabkan gigi rusak?',
          options: [
            { id: 'a', label: 'Tidak menyikat gigi', visual: '🚫' },
            { id: 'b', label: 'Minum air putih', visual: '💧' },
            { id: 'c', label: 'Tidur cukup', visual: '😴' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-3',
      title: 'Bab 3: Belajar Menyikat Gigi',
      illustration: '🪥',
      narration: [
        'Dokter Tupai memberi Bobi sikat gigi baru berwarna biru.',
        '"Sikat dua kali sehari ya: pagi setelah sarapan dan malam sebelum tidur."',
        '"Gerakan ke atas-bawah, lalu memutar pelan."',
        'Bobi mencobanya. Ternyata seru juga!',
      ],
      questions: [
        {
          id: 'sg3-q1',
          prompt: 'Apa warna sikat gigi baru Bobi?',
          options: [
            { id: 'a', label: 'Biru', visual: '🔵' },
            { id: 'b', label: 'Merah', visual: '🔴' },
            { id: 'c', label: 'Kuning', visual: '🟡' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'sg3-q2',
          prompt: 'Berapa kali sehari sebaiknya menyikat gigi?',
          options: [
            { id: 'a', label: '1 kali', visual: '1️⃣' },
            { id: 'b', label: '2 kali', visual: '2️⃣' },
            { id: 'c', label: '5 kali', visual: '5️⃣' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'sg3-q3',
          prompt: 'Kapan saja Bobi harus menyikat gigi?',
          options: [
            { id: 'a', label: 'Pagi dan malam', visual: '🌅' },
            { id: 'b', label: 'Hanya sekali seminggu', visual: '📅' },
            { id: 'c', label: 'Saat lapar saja', visual: '🍽️' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-4',
      title: 'Bab 4: Senyum Cerah',
      illustration: '😁',
      narration: [
        'Sejak hari itu, Bobi rajin menyikat gigi.',
        'Pagi: "Sikat sikat sikat!" Malam: "Sikat sikat sikat!"',
        'Lama-lama, gigi Bobi jadi putih, kuat, dan tidak sakit lagi.',
        'Sekarang Bobi tersenyum dengan percaya diri. Gigi sehat itu menyenangkan!',
      ],
      questions: [
        {
          id: 'sg4-q1',
          prompt: 'Apa yang dilakukan Bobi setiap pagi dan malam?',
          options: [
            { id: 'a', label: 'Menyikat gigi', visual: '🪥' },
            { id: 'b', label: 'Tidur saja', visual: '😴' },
            { id: 'c', label: 'Makan permen', visual: '🍬' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'sg4-q2',
          prompt: 'Bagaimana keadaan gigi Bobi sekarang?',
          options: [
            { id: 'a', label: 'Putih, kuat, dan sehat', visual: '😁' },
            { id: 'b', label: 'Tetap rusak', visual: '🦷' },
            { id: 'c', label: 'Jatuh semua', visual: '😱' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'sg4-q3',
          prompt: 'Apa pelajaran dari cerita ini?',
          options: [
            { id: 'a', label: 'Rajin menyikat gigi membuat sehat', visual: '✨' },
            { id: 'b', label: 'Boleh tidak sikat gigi', visual: '🚫' },
            { id: 'c', label: 'Makan madu sebanyak-banyaknya', visual: '🍯' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
  ],
};
