import type { Story } from '@/types';

/**
 * Timun Mas — public-domain Indonesian folktale.
 * Adapted for ages 3-6 with simple Bahasa, friendly tone, and 4 chapters.
 * Theme: keberanian, kecerdikan, hubungan ibu-anak.
 */
export const STORY_TIMUN_MAS: Story = {
  id: 'timun-mas',
  title: 'Timun Mas',
  tagline: 'Gadis pemberani yang lahir dari mentimun emas',
  coverEmoji: '🥒',
  ageMin: 3,
  ageMax: 6,
  themeGradient:
    'linear-gradient(135deg, #fff3b8 0%, #fde047 50%, #f59e0b 100%)',
  chapters: [
    {
      id: 'bab-1',
      title: 'Bab 1: Mentimun Ajaib',
      illustration: '🥒',
      narration: [
        'Di sebuah desa kecil tinggal seorang ibu janda bernama Mbok Srini.',
        'Mbok Srini sangat ingin punya anak, tapi belum dikaruniai.',
        'Suatu hari, ia mendapat biji mentimun ajaib dari raksasa.',
        'Mentimun itu tumbuh menjadi sangat besar dan berwarna emas berkilau.',
      ],
      questions: [
        {
          id: 't1-q1',
          prompt: 'Siapa nama ibu dalam cerita ini?',
          options: [
            { id: 'a', label: 'Mbok Srini', visual: '👵' },
            { id: 'b', label: 'Putri Salju', visual: '👸' },
            { id: 'c', label: 'Bawang Putih', visual: '🧅' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 't1-q2',
          prompt: 'Apa yang sangat diinginkan Mbok Srini?',
          options: [
            { id: 'a', label: 'Punya rumah baru', visual: '🏠' },
            { id: 'b', label: 'Punya anak', visual: '👶' },
            { id: 'c', label: 'Punya banyak emas', visual: '💰' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 't1-q3',
          prompt: 'Apa warna mentimun ajaibnya?',
          options: [
            { id: 'a', label: 'Hijau biasa', visual: '🟢' },
            { id: 'b', label: 'Merah muda', visual: '🩷' },
            { id: 'c', label: 'Emas berkilau', visual: '🟡' },
          ],
          correctOptionId: 'c',
        },
      ],
    },
    {
      id: 'bab-2',
      title: 'Bab 2: Lahirnya Timun Mas',
      illustration: '👧',
      narration: [
        'Ketika mentimun emas dibelah, keluarlah seorang bayi perempuan yang cantik.',
        'Mbok Srini sangat bahagia dan menamainya Timun Mas.',
        'Timun Mas tumbuh menjadi gadis yang baik, ramah, dan suka membantu ibunya.',
        'Tetapi Mbok Srini ingat janji kepada raksasa: anak itu harus diserahkan saat sudah besar.',
      ],
      questions: [
        {
          id: 't2-q1',
          prompt: 'Apa yang keluar dari mentimun emas?',
          options: [
            { id: 'a', label: 'Bayi perempuan', visual: '👶' },
            { id: 'b', label: 'Permata', visual: '💎' },
            { id: 'c', label: 'Burung ajaib', visual: '🐦' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 't2-q2',
          prompt: 'Bagaimana sifat Timun Mas?',
          options: [
            { id: 'a', label: 'Pemarah dan malas', visual: '😠' },
            { id: 'b', label: 'Baik dan suka membantu', visual: '😊' },
            { id: 'c', label: 'Penakut dan pendiam', visual: '😨' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 't2-q3',
          prompt: 'Mengapa Mbok Srini gelisah?',
          options: [
            { id: 'a', label: 'Karena janji ke raksasa', visual: '👹' },
            { id: 'b', label: 'Karena rumah bocor', visual: '🌧️' },
            { id: 'c', label: 'Karena lapar', visual: '🍽️' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-3',
      title: 'Bab 3: Raksasa Datang',
      illustration: '👹',
      narration: [
        'Suatu hari, raksasa besar datang menagih janji.',
        'Mbok Srini cepat-cepat memberikan empat bungkusan ajaib pada Timun Mas.',
        '"Lari, Nak! Lemparkan ini kalau raksasa mengejarmu," kata Mbok Srini.',
        'Timun Mas berlari sekencang-kencangnya ke dalam hutan.',
      ],
      questions: [
        {
          id: 't3-q1',
          prompt: 'Berapa bungkusan ajaib yang diberikan?',
          options: [
            { id: 'a', label: '2 bungkusan', visual: '2️⃣' },
            { id: 'b', label: '4 bungkusan', visual: '4️⃣' },
            { id: 'c', label: '7 bungkusan', visual: '7️⃣' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 't3-q2',
          prompt: 'Apa yang harus Timun Mas lakukan?',
          options: [
            { id: 'a', label: 'Lari dan lemparkan bungkusan', visual: '🏃' },
            { id: 'b', label: 'Bersembunyi di rumah', visual: '🏠' },
            { id: 'c', label: 'Bertarung dengan raksasa', visual: '⚔️' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 't3-q3',
          prompt: 'Timun Mas berlari ke mana?',
          options: [
            { id: 'a', label: 'Ke hutan', visual: '🌳' },
            { id: 'b', label: 'Ke pantai', visual: '🏖️' },
            { id: 'c', label: 'Ke kota', visual: '🏙️' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-4',
      title: 'Bab 4: Bungkusan Ajaib',
      illustration: '✨',
      narration: [
        'Timun Mas melempar bungkusan pertama: jadi hutan bambu yang lebat!',
        'Lalu jarum: jadi rumpun pohon berduri tajam.',
        'Lalu garam: jadi laut yang luas.',
        'Terakhir, terasi: jadi lumpur panas. Raksasa pun tenggelam, dan Timun Mas selamat!',
      ],
      questions: [
        {
          id: 't4-q1',
          prompt: 'Bungkusan pertama berubah jadi apa?',
          options: [
            { id: 'a', label: 'Hutan bambu', visual: '🎋' },
            { id: 'b', label: 'Bunga indah', visual: '🌸' },
            { id: 'c', label: 'Es batu', visual: '🧊' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 't4-q2',
          prompt: 'Garam yang dilempar jadi apa?',
          options: [
            { id: 'a', label: 'Laut yang luas', visual: '🌊' },
            { id: 'b', label: 'Salju', visual: '❄️' },
            { id: 'c', label: 'Gunung', visual: '⛰️' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 't4-q3',
          prompt: 'Bagaimana akhir cerita?',
          options: [
            { id: 'a', label: 'Timun Mas selamat', visual: '🤗' },
            { id: 'b', label: 'Raksasa menang', visual: '👹' },
            { id: 'c', label: 'Mereka berteman', visual: '🤝' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
  ],
};
