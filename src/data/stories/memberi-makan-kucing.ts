import type { Story } from '@/types';

/**
 * Memberi Makan Kucing Jalanan — original story.
 * Theme: kasih sayang ke makhluk hidup, tanggung jawab, kepedulian.
 * Age 3-6. Mengajarkan welas asih kepada hewan.
 */
export const STORY_MEMBERI_MAKAN_KUCING: Story = {
  id: 'memberi-makan-kucing',
  title: 'Kucing Kecil di Halaman',
  tagline: 'Lila menemukan kucing kecil yang lapar',
  coverEmoji: '🐱',
  ageMin: 3,
  ageMax: 6,
  themeGradient:
    'linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #f97316 100%)',
  chapters: [
    {
      id: 'bab-1',
      title: 'Bab 1: Suara Mengeong',
      illustration: '🐱',
      narration: [
        'Hari Sabtu sore, Lila sedang bermain di halaman rumah.',
        'Tiba-tiba, ia mendengar suara lirih: "Meong... meong..."',
        'Lila mendekat ke semak-semak dan melihat seekor kucing kecil.',
        'Kucing itu kurus, kotor, dan tampak sangat lapar.',
      ],
      questions: [
        {
          id: 'mk1-q1',
          prompt: 'Siapa nama anak dalam cerita ini?',
          options: [
            { id: 'a', label: 'Lila', visual: '👧' },
            { id: 'b', label: 'Mira', visual: '👧' },
            { id: 'c', label: 'Sari', visual: '👧' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'mk1-q2',
          prompt: 'Suara apa yang Lila dengar?',
          options: [
            { id: 'a', label: 'Guk guk', visual: '🐶' },
            { id: 'b', label: 'Meong meong', visual: '🐱' },
            { id: 'c', label: 'Cit cit', visual: '🐭' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'mk1-q3',
          prompt: 'Bagaimana keadaan kucing kecil itu?',
          options: [
            { id: 'a', label: 'Gemuk dan bersih', visual: '🐈' },
            { id: 'b', label: 'Kurus dan lapar', visual: '😿' },
            { id: 'c', label: 'Marah dan galak', visual: '😾' },
          ],
          correctOptionId: 'b',
        },
      ],
    },
    {
      id: 'bab-2',
      title: 'Bab 2: Bertanya pada Mama',
      illustration: '👩',
      narration: [
        'Lila berlari ke dapur menemui Mama.',
        '"Mama, ada kucing kecil di halaman. Dia kelihatan lapar."',
        'Mama tersenyum, "Apa yang sebaiknya kita lakukan, Sayang?"',
        'Lila berpikir sebentar, lalu menjawab, "Beri dia makan dan minum, Mama!"',
      ],
      questions: [
        {
          id: 'mk2-q1',
          prompt: 'Lila pergi ke mana untuk bertanya?',
          options: [
            { id: 'a', label: 'Ke dapur menemui Mama', visual: '👩' },
            { id: 'b', label: 'Ke kamar tidur', visual: '🛏️' },
            { id: 'c', label: 'Ke kebun', visual: '🌳' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'mk2-q2',
          prompt: 'Apa yang Lila usulkan?',
          options: [
            { id: 'a', label: 'Mengusir kucingnya', visual: '🚫' },
            { id: 'b', label: 'Memberi makan dan minum', visual: '🍚' },
            { id: 'c', label: 'Mengabaikannya', visual: '😐' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'mk2-q3',
          prompt: 'Bagaimana sikap Mama?',
          options: [
            { id: 'a', label: 'Tersenyum dan membimbing', visual: '😊' },
            { id: 'b', label: 'Marah-marah', visual: '😠' },
            { id: 'c', label: 'Tidak peduli', visual: '😐' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-3',
      title: 'Bab 3: Memberi Makan Pelan-pelan',
      illustration: '🍚',
      narration: [
        'Mama membantu Lila menyiapkan sedikit nasi dan ikan untuk kucing.',
        'Lila juga menuangkan air bersih ke mangkuk kecil.',
        'Pelan-pelan, ia meletakkan makanan di dekat kucing.',
        'Kucing itu makan dengan lahap. Lila tersenyum melihatnya bahagia.',
      ],
      questions: [
        {
          id: 'mk3-q1',
          prompt: 'Apa makanan yang diberikan untuk kucing?',
          options: [
            { id: 'a', label: 'Nasi dan ikan', visual: '🐟' },
            { id: 'b', label: 'Cokelat', visual: '🍫' },
            { id: 'c', label: 'Es krim', visual: '🍦' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'mk3-q2',
          prompt: 'Mengapa Lila meletakkannya pelan-pelan?',
          options: [
            { id: 'a', label: 'Supaya kucing tidak takut', visual: '🤫' },
            { id: 'b', label: 'Karena malas', visual: '😴' },
            { id: 'c', label: 'Supaya cepat selesai', visual: '💨' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'mk3-q3',
          prompt: 'Apa yang juga dituangkan Lila?',
          options: [
            { id: 'a', label: 'Air bersih', visual: '💧' },
            { id: 'b', label: 'Susu cokelat', visual: '🥛' },
            { id: 'c', label: 'Soda', visual: '🥤' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 'bab-4',
      title: 'Bab 4: Sahabat Kecil yang Baru',
      illustration: '💖',
      narration: [
        'Setelah kenyang, kucing itu menggosokkan kepalanya ke kaki Lila.',
        '"Brrrrrr..." Suaranya seperti motor kecil yang mendengkur.',
        'Lila tahu, kucing itu berterima kasih dengan caranya sendiri.',
        'Sejak hari itu, kucing kecil sering datang. Lila merawatnya dengan penuh kasih.',
      ],
      questions: [
        {
          id: 'mk4-q1',
          prompt: 'Apa yang dilakukan kucing setelah kenyang?',
          options: [
            { id: 'a', label: 'Menggosok kepalanya ke kaki Lila', visual: '🐱' },
            { id: 'b', label: 'Lari menjauh', visual: '🏃' },
            { id: 'c', label: 'Marah dan mencakar', visual: '😾' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'mk4-q2',
          prompt: 'Suara dengkuran kucing seperti apa?',
          options: [
            { id: 'a', label: 'Brrrrr', visual: '🏍️' },
            { id: 'b', label: 'Wuuusssh', visual: '💨' },
            { id: 'c', label: 'Klakson keras', visual: '📢' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'mk4-q3',
          prompt: 'Apa pelajaran dari cerita ini?',
          options: [
            { id: 'a', label: 'Sayangi makhluk hidup', visual: '💖' },
            { id: 'b', label: 'Hewan jalanan harus diusir', visual: '🚫' },
            { id: 'c', label: 'Hewan tidak punya perasaan', visual: '😐' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
  ],
};
