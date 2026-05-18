import type { Story } from '@/types';

/**
 * Berbagi Mainan dengan Teman — original story.
 * Theme: berbagi, persahabatan, kemurahan hati.
 * Age 3-6.
 */
export const STORY_BERBAGI_MAINAN: Story = {
  id: 'berbagi-mainan',
  title: 'Berbagi Itu Indah',
  tagline: 'Dimas belajar berbagi mainan dengan teman',
  coverEmoji: '🧸',
  ageMin: 3,
  ageMax: 6,
  themeGradient:
    'linear-gradient(135deg, #fde68a 0%, #fcd34d 50%, #f59e0b 100%)',
  chapters: [
    {
      id: 'bab-1',
      title: 'Bab 1: Mainan Baru Dimas',
      illustration: '🚗',
      narration: [
        'Dimas mendapat hadiah ulang tahun mobil-mobilan baru yang keren.',
        'Mobilnya berwarna merah dan bisa berjalan sendiri.',
        'Dimas sangat sayang pada mainan barunya itu.',
        'Ia bermain mobil-mobilan sendirian di kamarnya.',
      ],
      questions: [
        {
          id: 'bm1-q1',
          prompt: 'Apa hadiah ulang tahun Dimas?',
          options: [
            { id: 'a', label: 'Mobil-mobilan', visual: '🚗' },
            { id: 'b', label: 'Boneka', visual: '🧸' },
            { id: 'c', label: 'Buku', visual: '📕' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bm1-q2',
          prompt: 'Apa warna mobil-mobilan Dimas?',
          options: [
            { id: 'a', label: 'Biru', visual: '🟦' },
            { id: 'b', label: 'Merah', visual: '🟥' },
            { id: 'c', label: 'Hijau', visual: '🟩' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'bm1-q3',
          prompt: 'Dimas bermain dengan siapa?',
          options: [
            { id: 'a', label: 'Sendirian', visual: '🧒' },
            { id: 'b', label: 'Bersama teman' },
            { id: 'c', label: 'Bersama anjing' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-2',
      title: 'Bab 2: Adi Datang Berkunjung',
      illustration: '👬',
      narration: [
        'Tok tok tok! Pintu rumah Dimas diketuk.',
        'Ternyata Adi, sahabat Dimas, datang berkunjung.',
        'Adi melihat mobil-mobilan baru itu dengan mata berbinar.',
        '"Wah, mobilnya bagus! Boleh aku ikut main, Dim?" tanya Adi.',
      ],
      questions: [
        {
          id: 'bm2-q1',
          prompt: 'Siapa yang datang berkunjung?',
          options: [
            { id: 'a', label: 'Adi, sahabat Dimas', visual: '👦' },
            { id: 'b', label: 'Tukang pos', visual: '📮' },
            { id: 'c', label: 'Nenek', visual: '👵' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bm2-q2',
          prompt: 'Apa yang Adi minta?',
          options: [
            { id: 'a', label: 'Ikut main mobil-mobilan', visual: '🚗' },
            { id: 'b', label: 'Pinjam buku' },
            { id: 'c', label: 'Makan kue' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bm2-q3',
          prompt: 'Bagaimana sikap Adi saat meminta?',
          options: [
            { id: 'a', label: 'Sopan dan tersenyum', visual: '😊' },
            { id: 'b', label: 'Memaksa', visual: '😠' },
            { id: 'c', label: 'Diam-diam mengambil', visual: '🤫' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-3',
      title: 'Bab 3: Dimas Ragu',
      illustration: '🤔',
      narration: [
        'Dimas ragu. "Bagaimana kalau mobilku rusak?" pikirnya.',
        'Tapi ia juga ingat, Adi adalah sahabat baiknya.',
        'Mama yang melihat dari jauh tersenyum dan berkata,',
        '"Berbagi membuat persahabatan semakin erat, Sayang."',
      ],
      questions: [
        {
          id: 'bm3-q1',
          prompt: 'Mengapa Dimas ragu?',
          options: [
            { id: 'a', label: 'Takut mobilnya rusak', visual: '😟' },
            { id: 'b', label: 'Tidak suka Adi', visual: '😠' },
            { id: 'c', label: 'Tidak punya mainan' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bm3-q2',
          prompt: 'Apa pesan Mama?',
          options: [
            { id: 'a', label: 'Berbagi mempererat persahabatan', visual: '💖' },
            { id: 'b', label: 'Jangan beri pinjaman' },
            { id: 'c', label: 'Mainan harus disembunyikan' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bm3-q3',
          prompt: 'Adi adalah?',
          options: [
            { id: 'a', label: 'Sahabat baik Dimas', visual: '🤝' },
            { id: 'b', label: 'Orang asing' },
            { id: 'c', label: 'Adik Dimas' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-4',
      title: 'Bab 4: Bermain Bersama',
      illustration: '🎉',
      narration: [
        'Dimas tersenyum dan menyodorkan mobil-mobilannya pada Adi.',
        '"Ayo kita main bersama, Adi!" ajak Dimas dengan riang.',
        'Mereka bergantian memainkan mobil itu, tertawa, dan bercanda.',
        'Ternyata bermain bersama jauh lebih seru daripada sendirian!',
      ],
      questions: [
        {
          id: 'bm4-q1',
          prompt: 'Apa yang akhirnya Dimas lakukan?',
          options: [
            { id: 'a', label: 'Berbagi mainan dengan Adi', visual: '🤝' },
            { id: 'b', label: 'Menyembunyikan mainan' },
            { id: 'c', label: 'Mengusir Adi' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bm4-q2',
          prompt: 'Bagaimana perasaan mereka saat bermain bersama?',
          options: [
            { id: 'a', label: 'Sangat senang dan tertawa', visual: '😄' },
            { id: 'b', label: 'Sedih dan menangis', visual: '😢' },
            { id: 'c', label: 'Biasa saja' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bm4-q3',
          prompt: 'Apa pelajaran dari cerita ini?',
          options: [
            { id: 'a', label: 'Berbagi membuat semua bahagia', visual: '💖' },
            { id: 'b', label: 'Mainan tidak boleh dipinjamkan' },
            { id: 'c', label: 'Bermain sendiri lebih baik' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
  ],
};
