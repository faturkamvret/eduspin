import type { Story } from '@/types';

/**
 * Kancil dan Buaya — public-domain Indonesian folktale.
 * Adapted for ages 3-6 with simple Bahasa, friendly tone, and 4 chapters.
 */
export const STORY_KANCIL_BUAYA: Story = {
  id: 'kancil-buaya',
  title: 'Kancil dan Buaya',
  tagline: 'Si Kancil yang cerdik menyeberangi sungai',
  coverEmoji: '🦌',
  ageMin: 3,
  ageMax: 6,
  themeGradient:
    'linear-gradient(135deg, #bdf5d8 0%, #86efac 50%, #22c55e 100%)',
  chapters: [
    {
      id: 'bab-1',
      title: 'Bab 1: Kancil Lapar',
      illustration: '🦌',
      narration: [
        'Pada suatu hari di hutan yang rimbun, Kancil sedang berjalan-jalan.',
        'Perutnya keroncongan karena ia belum makan sejak pagi.',
        '"Aku ingin mentimun yang segar!" kata Kancil sambil mengusap perutnya.',
        'Lalu ia teringat, di seberang sungai ada kebun mentimun yang lebat.',
      ],
      questions: [
        {
          id: 'k1-q1',
          prompt: 'Siapa tokoh utama dalam cerita ini?',
          options: [
            { id: 'a', label: 'Kancil', visual: '🦌' },
            { id: 'b', label: 'Singa', visual: '🦁' },
            { id: 'c', label: 'Gajah', visual: '🐘' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'k1-q2',
          prompt: 'Apa yang ingin dimakan Kancil?',
          options: [
            { id: 'a', label: 'Pisang', visual: '🍌' },
            { id: 'b', label: 'Mentimun', visual: '🥒' },
            { id: 'c', label: 'Apel', visual: '🍎' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'k1-q3',
          prompt: 'Kebun mentimun ada di mana?',
          options: [
            { id: 'a', label: 'Di atas pohon', visual: '🌳' },
            { id: 'b', label: 'Di seberang sungai', visual: '🏞️' },
            { id: 'c', label: 'Di dalam gua', visual: '🕳️' },
          ],
          correctOptionId: 'b',
        },
      ],
    },
    {
      id: 'bab-2',
      title: 'Bab 2: Bertemu Buaya',
      illustration: '🐊',
      narration: [
        'Kancil sampai di tepi sungai, tapi sungainya lebar sekali.',
        'Tiba-tiba muncul banyak buaya dengan gigi yang besar.',
        'Buaya-buaya itu lapar dan ingin memakan Kancil.',
        '"Aduh, bagaimana ya?" pikir Kancil. Lalu ia tersenyum, ia punya ide cerdik!',
      ],
      questions: [
        {
          id: 'k2-q1',
          prompt: 'Siapa yang Kancil temui di tepi sungai?',
          options: [
            { id: 'a', label: 'Buaya', visual: '🐊' },
            { id: 'b', label: 'Kelinci', visual: '🐰' },
            { id: 'c', label: 'Burung', visual: '🐦' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'k2-q2',
          prompt: 'Mengapa buaya ingin memakan Kancil?',
          options: [
            { id: 'a', label: 'Buaya marah', visual: '😡' },
            { id: 'b', label: 'Buaya lapar', visual: '😋' },
            { id: 'c', label: 'Buaya ngantuk', visual: '😴' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'k2-q3',
          prompt: 'Bagaimana perasaan Kancil saat punya ide?',
          options: [
            { id: 'a', label: 'Sedih', visual: '😢' },
            { id: 'b', label: 'Senang dan tersenyum', visual: '😊' },
            { id: 'c', label: 'Marah', visual: '😠' },
          ],
          correctOptionId: 'b',
        },
      ],
    },
    {
      id: 'bab-3',
      title: 'Bab 3: Menghitung Buaya',
      illustration: '🔢',
      narration: [
        '"Hai, Buaya! Raja hutan menyuruhku menghitung kalian," kata Kancil.',
        '"Berbarislah supaya aku bisa menghitung satu per satu."',
        'Buaya-buaya pun berbaris dari tepi sungai sampai ke seberang.',
        'Kancil melompat ke punggung buaya: "Satu, dua, tiga, empat, lima!"',
      ],
      questions: [
        {
          id: 'k3-q1',
          prompt: 'Kancil pura-pura disuruh siapa untuk menghitung buaya?',
          options: [
            { id: 'a', label: 'Raja hutan', visual: '👑' },
            { id: 'b', label: 'Ibu buaya', visual: '🐊' },
            { id: 'c', label: 'Petani', visual: '👨\u200d🌾' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'k3-q2',
          prompt: 'Berapa buaya yang dihitung Kancil dalam cerita?',
          options: [
            { id: 'a', label: '2 buaya', visual: '2️⃣' },
            { id: 'b', label: '5 buaya', visual: '5️⃣' },
            { id: 'c', label: '10 buaya', visual: '🔟' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'k3-q3',
          prompt: 'Kancil melompat ke mana saat menghitung?',
          options: [
            { id: 'a', label: 'Punggung buaya', visual: '🐊' },
            { id: 'b', label: 'Pohon kelapa', visual: '🌴' },
            { id: 'c', label: 'Kapal', visual: '⛵' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-4',
      title: 'Bab 4: Sampai di Seberang',
      illustration: '🥒',
      narration: [
        'Tap! Tap! Tap! Kancil sampai di seberang sungai dengan selamat.',
        '"Terima kasih, Buaya!" kata Kancil sambil tertawa.',
        'Ternyata Kancil hanya menggunakan kecerdikannya untuk menyeberang.',
        'Kancil pun bisa makan mentimun yang segar dengan hati riang.',
      ],
      questions: [
        {
          id: 'k4-q1',
          prompt: 'Kancil berhasil sampai di mana?',
          options: [
            { id: 'a', label: 'Seberang sungai', visual: '🌳' },
            { id: 'b', label: 'Puncak gunung', visual: '⛰️' },
            { id: 'c', label: 'Dalam laut', visual: '🌊' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'k4-q2',
          prompt: 'Apa yang Kancil pakai untuk menyeberang?',
          options: [
            { id: 'a', label: 'Sayap', visual: '🪽' },
            { id: 'b', label: 'Kecerdikan', visual: '🧠' },
            { id: 'c', label: 'Sepatu ajaib', visual: '👟' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'k4-q3',
          prompt: 'Apa yang dimakan Kancil di akhir cerita?',
          options: [
            { id: 'a', label: 'Mentimun', visual: '🥒' },
            { id: 'b', label: 'Pizza', visual: '🍕' },
            { id: 'c', label: 'Es krim', visual: '🍦' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
  ],
};
