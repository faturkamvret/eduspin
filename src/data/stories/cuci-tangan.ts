import type { Story } from '@/types';

/**
 * Mencuci Tangan Sebelum Makan — original story.
 * Theme: kebersihan, kesehatan, kebiasaan baik.
 * Age 2-6.
 */
export const STORY_CUCI_TANGAN: Story = {
  id: 'cuci-tangan',
  title: 'Tangan Bersih, Hati Senang',
  tagline: 'Reno belajar mencuci tangan sebelum makan',
  coverEmoji: '🧼',
  ageMin: 2,
  ageMax: 6,
  themeGradient:
    'linear-gradient(135deg, #bae3ff 0%, #7dd3fc 50%, #0ea5e9 100%)',
  chapters: [
    {
      id: 'bab-1',
      title: 'Bab 1: Reno Pulang Bermain',
      illustration: '👦',
      narration: [
        'Reno baru saja pulang dari taman bermain.',
        'Ia bermain pasir, ayunan, dan bola dengan teman-teman.',
        'Tangannya kotor dan berdebu, tapi ia sangat lapar.',
        'Reno langsung berlari ke meja makan, mau menyantap nasi goreng kesukaannya.',
      ],
      questions: [
        {
          id: 'ct1-q1',
          prompt: 'Reno baru saja pulang dari mana?',
          options: [
            { id: 'a', label: 'Taman bermain', visual: '🛝' },
            { id: 'b', label: 'Sekolah', visual: '🏫' },
            { id: 'c', label: 'Kantor', visual: '🏢' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'ct1-q2',
          prompt: 'Bagaimana keadaan tangan Reno?',
          options: [
            { id: 'a', label: 'Bersih dan wangi', visual: '✨' },
            { id: 'b', label: 'Kotor dan berdebu', visual: '👐' },
            { id: 'c', label: 'Basah saja', visual: '💧' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'ct1-q3',
          prompt: 'Apa yang Reno ingin lakukan?',
          options: [
            { id: 'a', label: 'Tidur siang', visual: '😴' },
            { id: 'b', label: 'Makan nasi goreng', visual: '🍛' },
            { id: 'c', label: 'Mandi', visual: '🛁' },
          ],
          correctOptionId: 'b',
        },
      ],
    },
    {
      id: 'bab-2',
      title: 'Bab 2: Mama Mengingatkan',
      illustration: '👩',
      narration: [
        '"Reno, sebentar dulu, Sayang!" panggil Mama dengan lembut.',
        '"Sebelum makan, kita harus apa dulu?" tanya Mama sambil tersenyum.',
        'Reno berpikir sebentar dan melihat tangannya yang kotor.',
        '"Cuci tangan dulu ya, Ma?" jawab Reno mengingat pelajaran di sekolah.',
      ],
      questions: [
        {
          id: 'ct2-q1',
          prompt: 'Siapa yang mengingatkan Reno?',
          options: [
            { id: 'a', label: 'Mama', visual: '👩' },
            { id: 'b', label: 'Papa', visual: '👨' },
            { id: 'c', label: 'Kakak', visual: '🧒' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'ct2-q2',
          prompt: 'Apa yang harus dilakukan sebelum makan?',
          options: [
            { id: 'a', label: 'Tidur sebentar', visual: '😴' },
            { id: 'b', label: 'Cuci tangan', visual: '🧼' },
            { id: 'c', label: 'Berlari-lari', visual: '🏃' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'ct2-q3',
          prompt: 'Bagaimana cara Mama mengingatkan?',
          options: [
            { id: 'a', label: 'Marah-marah', visual: '😠' },
            { id: 'b', label: 'Lembut dan tersenyum', visual: '😊' },
            { id: 'c', label: 'Diam saja', visual: '😐' },
          ],
          correctOptionId: 'b',
        },
      ],
    },
    {
      id: 'bab-3',
      title: 'Bab 3: Cuci Tangan dengan Sabun',
      illustration: '🧼',
      narration: [
        'Reno berlari ke wastafel dan membuka kran air.',
        'Ia membasahi tangannya, lalu mengambil sabun.',
        '"Gosok telapak, punggung tangan, sela jari, dan kuku," kata Reno sambil menyanyi.',
        'Setelah berbusa lembut, ia membilas dengan air bersih dan mengeringkannya dengan handuk.',
      ],
      questions: [
        {
          id: 'ct3-q1',
          prompt: 'Apa yang Reno gunakan untuk mencuci tangan?',
          options: [
            { id: 'a', label: 'Sabun dan air', visual: '🧼' },
            { id: 'b', label: 'Cokelat', visual: '🍫' },
            { id: 'c', label: 'Kertas', visual: '📄' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'ct3-q2',
          prompt: 'Bagian mana yang harus digosok saat cuci tangan?',
          options: [
            { id: 'a', label: 'Hanya telapak', visual: '✋' },
            { id: 'b', label: 'Telapak, punggung, sela jari, kuku', visual: '🙌' },
            { id: 'c', label: 'Hanya jempol', visual: '👍' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'ct3-q3',
          prompt: 'Setelah dibilas, tangan dikeringkan dengan?',
          options: [
            { id: 'a', label: 'Handuk bersih', visual: '🧴' },
            { id: 'b', label: 'Baju kotor', visual: '👕' },
            { id: 'c', label: 'Tisu basah', visual: '💧' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-4',
      title: 'Bab 4: Makan dengan Lahap',
      illustration: '🍛',
      narration: [
        'Tangan Reno sekarang bersih dan wangi.',
        'Ia duduk di meja makan dan berdoa terlebih dahulu.',
        'Reno makan nasi goreng dengan lahap dan bahagia.',
        'Mama berkata, "Tangan bersih, perut sehat, hati pun senang!"',
      ],
      questions: [
        {
          id: 'ct4-q1',
          prompt: 'Apa yang Reno lakukan sebelum makan, setelah cuci tangan?',
          options: [
            { id: 'a', label: 'Berdoa', visual: '🙏' },
            { id: 'b', label: 'Bermain HP', visual: '📱' },
            { id: 'c', label: 'Menonton TV', visual: '📺' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'ct4-q2',
          prompt: 'Mengapa kita harus cuci tangan sebelum makan?',
          options: [
            { id: 'a', label: 'Agar tangan tidak terlihat kosong' },
            { id: 'b', label: 'Agar kuman tidak masuk perut', visual: '🦠' },
            { id: 'c', label: 'Agar bisa main air' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'ct4-q3',
          prompt: 'Apa pelajaran dari cerita ini?',
          options: [
            { id: 'a', label: 'Cuci tangan menjaga kesehatan', visual: '✨' },
            { id: 'b', label: 'Tidak perlu cuci tangan', visual: '🚫' },
            { id: 'c', label: 'Cuci tangan hanya jika kotor sekali' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
  ],
};
