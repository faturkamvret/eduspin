import type { Story } from '@/types';

/**
 * Bawang Merah dan Bawang Putih — public-domain Indonesian folktale.
 * Adaptasi ramah anak, mengajarkan kebaikan, kesabaran, dan ketulusan.
 * Age 4-6.
 */
export const STORY_BAWANG_MERAH_PUTIH: Story = {
  id: 'bawang-merah-bawang-putih',
  title: 'Bawang Merah dan Bawang Putih',
  tagline: 'Cerita rakyat tentang ketulusan hati',
  coverEmoji: '🧅',
  ageMin: 4,
  ageMax: 6,
  themeGradient:
    'linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 50%, #ec4899 100%)',
  chapters: [
    {
      id: 'bab-1',
      title: 'Bab 1: Dua Saudara',
      illustration: '👭',
      narration: [
        'Dahulu kala, hiduplah dua saudara bernama Bawang Merah dan Bawang Putih.',
        'Bawang Putih sangat rajin, sopan, dan baik hati pada semua orang.',
        'Sebaliknya, Bawang Merah malas dan suka iri pada saudaranya.',
        'Setiap hari, Bawang Putih membantu pekerjaan rumah dengan ceria.',
      ],
      questions: [
        {
          id: 'bw1-q1',
          prompt: 'Siapa nama dua saudara dalam cerita ini?',
          options: [
            { id: 'a', label: 'Bawang Merah & Bawang Putih', visual: '🧅' },
            { id: 'b', label: 'Cabai Merah & Cabai Hijau', visual: '🌶️' },
            { id: 'c', label: 'Tomat & Wortel', visual: '🍅' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bw1-q2',
          prompt: 'Bagaimana sifat Bawang Putih?',
          options: [
            { id: 'a', label: 'Rajin dan baik hati', visual: '😊' },
            { id: 'b', label: 'Pemalas dan kasar', visual: '😠' },
            { id: 'c', label: 'Suka berbohong' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bw1-q3',
          prompt: 'Bagaimana sifat Bawang Merah?',
          options: [
            { id: 'a', label: 'Malas dan suka iri', visual: '😒' },
            { id: 'b', label: 'Rajin sekali' },
            { id: 'c', label: 'Sangat sopan' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-2',
      title: 'Bab 2: Selendang Hanyut',
      illustration: '🧣',
      narration: [
        'Suatu hari, Bawang Putih mencuci pakaian di sungai.',
        'Tiba-tiba, selendang ibu hanyut terbawa arus air.',
        'Bawang Putih sangat sedih dan pergi mencarinya.',
        'Ia berjalan jauh menyusuri sungai sambil bertanya pada siapa pun yang ditemui.',
      ],
      questions: [
        {
          id: 'bw2-q1',
          prompt: 'Apa yang dilakukan Bawang Putih di sungai?',
          options: [
            { id: 'a', label: 'Mencuci pakaian', visual: '👕' },
            { id: 'b', label: 'Memancing ikan', visual: '🎣' },
            { id: 'c', label: 'Mandi' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bw2-q2',
          prompt: 'Apa yang hanyut?',
          options: [
            { id: 'a', label: 'Selendang ibu', visual: '🧣' },
            { id: 'b', label: 'Sepatu' },
            { id: 'c', label: 'Buku' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bw2-q3',
          prompt: 'Apa yang Bawang Putih lakukan setelahnya?',
          options: [
            { id: 'a', label: 'Mencari selendang dengan sabar', visual: '🚶' },
            { id: 'b', label: 'Pulang dan berbohong' },
            { id: 'c', label: 'Menyalahkan saudaranya' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-3',
      title: 'Bab 3: Nenek Tua yang Baik',
      illustration: '👵',
      narration: [
        'Setelah berjalan jauh, Bawang Putih bertemu seorang nenek tua.',
        'Nenek itu sedang membutuhkan bantuan menyapu halaman.',
        'Tanpa ragu, Bawang Putih membantu dengan hati senang.',
        'Sebagai hadiah, nenek memberi labu yang berisi banyak emas.',
      ],
      questions: [
        {
          id: 'bw3-q1',
          prompt: 'Siapa yang Bawang Putih temui?',
          options: [
            { id: 'a', label: 'Nenek tua yang baik', visual: '👵' },
            { id: 'b', label: 'Singa galak', visual: '🦁' },
            { id: 'c', label: 'Penjahat' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bw3-q2',
          prompt: 'Apa yang Bawang Putih lakukan untuk nenek?',
          options: [
            { id: 'a', label: 'Membantu menyapu halaman', visual: '🧹' },
            { id: 'b', label: 'Hanya bertanya saja' },
            { id: 'c', label: 'Pergi tanpa bicara' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bw3-q3',
          prompt: 'Apa hadiah dari nenek?',
          options: [
            { id: 'a', label: 'Labu berisi emas', visual: '💰' },
            { id: 'b', label: 'Sepiring nasi' },
            { id: 'c', label: 'Sebuah buku' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-4',
      title: 'Bab 4: Pelajaran untuk Bawang Merah',
      illustration: '✨',
      narration: [
        'Bawang Merah iri melihat hadiah Bawang Putih.',
        'Ia ikut pergi menemui nenek, tapi pemalas dan tidak sopan.',
        'Ketika diberi pilihan labu, Bawang Merah memilih yang besar dengan rakus.',
        'Ternyata isinya bukan emas, melainkan ulat dan kalajengking!',
      ],
      questions: [
        {
          id: 'bw4-q1',
          prompt: 'Apa yang Bawang Merah lakukan?',
          options: [
            { id: 'a', label: 'Iri dan pergi ke nenek dengan rakus', visual: '😒' },
            { id: 'b', label: 'Ikut membantu dengan tulus' },
            { id: 'c', label: 'Diam saja di rumah' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bw4-q2',
          prompt: 'Mengapa labu Bawang Merah berisi ulat?',
          options: [
            { id: 'a', label: 'Karena hatinya rakus dan tidak tulus', visual: '🐛' },
            { id: 'b', label: 'Karena nenek lupa' },
            { id: 'c', label: 'Karena cuaca buruk' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'bw4-q3',
          prompt: 'Apa pelajaran dari cerita ini?',
          options: [
            { id: 'a', label: 'Ketulusan dibalas kebaikan', visual: '💖' },
            { id: 'b', label: 'Rakus selalu menang' },
            { id: 'c', label: 'Iri itu baik' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
  ],
};
