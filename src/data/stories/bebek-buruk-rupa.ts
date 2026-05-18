import type { Story } from '@/types';

/**
 * Bebek Buruk Rupa (The Ugly Duckling) — public-domain Hans Christian
 * Andersen tale (1843, author died 1875). Adapted for ages 3-6.
 * Theme: penerimaan diri, kesabaran, transformasi, jangan menilai dari luar.
 */
export const STORY_BEBEK_BURUK_RUPA: Story = {
  id: 'bebek-buruk-rupa',
  title: 'Bebek Buruk Rupa',
  tagline: 'Anak bebek yang berbeda menemukan dirinya',
  coverEmoji: '🦆',
  ageMin: 3,
  ageMax: 6,
  themeGradient:
    'linear-gradient(135deg, #bae3ff 0%, #7dd3fc 50%, #38bdf8 100%)',
  chapters: [
    {
      id: 'bab-1',
      title: 'Bab 1: Telur yang Berbeda',
      illustration: '🥚',
      narration: [
        'Di sebuah ladang, induk bebek sedang mengerami telur-telurnya.',
        'Satu per satu telur menetas: "Krek! Krek!" Lahirlah anak-anak bebek lucu.',
        'Tapi ada satu telur yang lebih besar, dan menetas paling akhir.',
        'Anak yang keluar... berbeda dari yang lain. Bulunya kelabu, lehernya panjang.',
      ],
      questions: [
        {
          id: 'b1-q1',
          prompt: 'Siapa yang mengerami telur-telur itu?',
          options: [
            { id: 'a', label: 'Induk bebek', visual: '🦆' },
            { id: 'b', label: 'Induk ayam', visual: '🐔' },
            { id: 'c', label: 'Induk kucing', visual: '🐱' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'b1-q2',
          prompt: 'Telur yang berbeda itu seperti apa?',
          options: [
            { id: 'a', label: 'Lebih kecil', visual: '🥚' },
            { id: 'b', label: 'Lebih besar', visual: '🥚' },
            { id: 'c', label: 'Berwarna pelangi', visual: '🌈' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'b1-q3',
          prompt: 'Bagaimana penampilan anak bebek terakhir?',
          options: [
            { id: 'a', label: 'Bulu kelabu, leher panjang', visual: '🦢' },
            { id: 'b', label: 'Bulu keemasan', visual: '🟡' },
            { id: 'c', label: 'Sama persis seperti yang lain', visual: '🐤' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-2',
      title: 'Bab 2: Diejek dan Kesepian',
      illustration: '😢',
      narration: [
        'Saudara-saudara bebek yang lain sering mengejek si bebek kelabu.',
        '"Kamu jelek! Tidak seperti kami!" kata mereka.',
        'Hewan-hewan lain di ladang juga tidak ramah padanya.',
        'Si bebek kelabu merasa sangat sedih dan kesepian. Ia memutuskan untuk pergi.',
      ],
      questions: [
        {
          id: 'b2-q1',
          prompt: 'Bagaimana saudara-saudaranya memperlakukan si bebek kelabu?',
          options: [
            { id: 'a', label: 'Mengejeknya', visual: '😏' },
            { id: 'b', label: 'Memeluknya', visual: '🤗' },
            { id: 'c', label: 'Memberinya hadiah', visual: '🎁' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'b2-q2',
          prompt: 'Bagaimana perasaan si bebek kelabu?',
          options: [
            { id: 'a', label: 'Senang sekali', visual: '😄' },
            { id: 'b', label: 'Sedih dan kesepian', visual: '😢' },
            { id: 'c', label: 'Marah-marah', visual: '😠' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'b2-q3',
          prompt: 'Apa yang akhirnya ia lakukan?',
          options: [
            { id: 'a', label: 'Pergi mencari tempat baru', visual: '🚶' },
            { id: 'b', label: 'Tidur seharian', visual: '😴' },
            { id: 'c', label: 'Membalas mengejek', visual: '😡' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-3',
      title: 'Bab 3: Musim Dingin yang Berat',
      illustration: '❄️',
      narration: [
        'Si bebek kelabu mengembara seorang diri.',
        'Musim dingin pun tiba. Salju turun, danau membeku, makanan susah dicari.',
        'Ia merasa lapar dan kedinginan, tapi tidak menyerah.',
        '"Aku harus tetap kuat," bisiknya pada diri sendiri.',
      ],
      questions: [
        {
          id: 'b3-q1',
          prompt: 'Musim apa yang datang?',
          options: [
            { id: 'a', label: 'Musim dingin', visual: '❄️' },
            { id: 'b', label: 'Musim panas', visual: '☀️' },
            { id: 'c', label: 'Musim hujan', visual: '🌧️' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'b3-q2',
          prompt: 'Apa yang terjadi pada danau?',
          options: [
            { id: 'a', label: 'Mengering', visual: '🏜️' },
            { id: 'b', label: 'Membeku', visual: '🧊' },
            { id: 'c', label: 'Penuh ikan', visual: '🐟' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'b3-q3',
          prompt: 'Bagaimana sikap si bebek?',
          options: [
            { id: 'a', label: 'Tetap kuat dan tidak menyerah', visual: '💪' },
            { id: 'b', label: 'Menyerah dan menangis', visual: '😭' },
            { id: 'c', label: 'Berubah menjadi jahat', visual: '😈' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-4',
      title: 'Bab 4: Aku Seekor Angsa!',
      illustration: '🦢',
      narration: [
        'Musim semi datang. Si bebek melihat sekelompok angsa cantik di danau.',
        'Saat ia mendekat, ia melihat bayangannya di air...',
        'Ia bukan bebek jelek! Ia adalah angsa muda yang anggun!',
        'Para angsa lain menyambutnya. Akhirnya, ia menemukan keluarganya yang sebenarnya. ✨',
      ],
      questions: [
        {
          id: 'b4-q1',
          prompt: 'Apa yang ia lihat di air?',
          options: [
            { id: 'a', label: 'Bayangan dirinya', visual: '🪞' },
            { id: 'b', label: 'Ikan besar', visual: '🐠' },
            { id: 'c', label: 'Kapal', visual: '⛵' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'b4-q2',
          prompt: 'Ternyata ia adalah hewan apa?',
          options: [
            { id: 'a', label: 'Angsa', visual: '🦢' },
            { id: 'b', label: 'Burung hantu', visual: '🦉' },
            { id: 'c', label: 'Elang', visual: '🦅' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'b4-q3',
          prompt: 'Apa pelajaran dari cerita ini?',
          options: [
            { id: 'a', label: 'Setiap orang istimewa dengan caranya sendiri', visual: '✨' },
            { id: 'b', label: 'Boleh mengejek yang berbeda', visual: '😏' },
            { id: 'c', label: 'Penampilan adalah segalanya', visual: '💄' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
  ],
};
