import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi · EduSpin',
  description:
    'Kebijakan privasi EduSpin: bagaimana kami memperlakukan data anak dan orang tua.',
};

const LAST_UPDATED = '18 Mei 2026';

export default function PrivacyPolicyPage() {
  return (
    <PageShell title="🔒 Kebijakan Privasi" deco={false}>
      <article className="card flex flex-col gap-4 text-sm leading-relaxed text-slate-700">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Terakhir diperbarui: {LAST_UPDATED}
        </p>

        <p>
          Selamat datang di <strong>EduSpin</strong>. Kami menghargai privasi
          pengguna kami, terutama anak-anak. Kebijakan ini menjelaskan informasi
          apa yang kami kumpulkan, bagaimana kami menggunakannya, dan pilihan
          apa yang Anda miliki.
        </p>

        <Section title="1. Informasi yang Kami Kumpulkan">
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <strong>Profil lokal:</strong> nama panggilan, umur, dan gender
              yang Anda masukkan saat onboarding. Data ini disimpan di
              perangkat Anda (browser) dan, bila Anda mengaktifkan
              sinkronisasi, di akun cloud Anda.
            </li>
            <li>
              <strong>Progres permainan:</strong> koin, koleksi, dan riwayat
              kuis untuk menjaga progres Anda.
            </li>
            <li>
              <strong>Preferensi:</strong> pengaturan suara dan musik latar.
            </li>
            <li>
              <strong>Data teknis terbatas:</strong> log error standar untuk
              memperbaiki bug. Kami tidak menggunakan iklan pihak ketiga atau
              pelacak perilaku.
            </li>
          </ul>
        </Section>

        <Section title="2. Yang Tidak Kami Kumpulkan">
          <ul className="ml-5 list-disc space-y-1">
            <li>Kami tidak meminta nama lengkap, alamat, atau nomor telepon anak.</li>
            <li>Kami tidak mengakses kamera, mikrofon, atau kontak.</li>
            <li>Kami tidak menjual atau menyewakan data pengguna kepada pihak ketiga.</li>
            <li>Kami tidak menampilkan iklan dan tidak meminta pembelian uang asli.</li>
          </ul>
        </Section>

        <Section title="3. Bagaimana Kami Menggunakan Informasi">
          <ul className="ml-5 list-disc space-y-1">
            <li>Menyesuaikan tingkat kesulitan kuis berdasarkan umur.</li>
            <li>Menampilkan koleksi & progres permainan.</li>
            <li>Menyinkronkan progres antar perangkat (opsional).</li>
            <li>Memperbaiki bug dan meningkatkan kualitas aplikasi.</li>
          </ul>
        </Section>

        <Section title="4. Penyimpanan & Sinkronisasi">
          <p>
            Secara default seluruh data tersimpan di perangkat Anda. Jika Anda
            mengaktifkan sinkronisasi awan, data profil dan progres dikirim ke
            penyedia layanan cloud kami (Firebase) melalui koneksi terenkripsi.
          </p>
        </Section>

        <Section title="5. Anak di Bawah Umur">
          <p>
            EduSpin dirancang untuk dimainkan anak-anak di bawah pengawasan
            orang tua atau wali. Orang tua/wali bertanggung jawab atas
            persetujuan penggunaan dan pengaturan profil anak.
          </p>
        </Section>

        <Section title="6. Hak Anda">
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <strong>Akses & koreksi:</strong> Anda dapat mengubah profil
              kapan saja di halaman Pengaturan.
            </li>
            <li>
              <strong>Penghapusan:</strong> Tombol &ldquo;Reset semua data&rdquo;
              di Pengaturan akan menghapus seluruh profil, koin, dan koleksi
              dari perangkat ini.
            </li>
            <li>
              <strong>Berhenti sinkron:</strong> Anda dapat menonaktifkan
              sinkronisasi awan kapan saja.
            </li>
          </ul>
        </Section>

        <Section title="7. Keamanan">
          <p>
            Kami menggunakan praktik keamanan industri standar. Namun, tidak
            ada sistem yang sepenuhnya bebas risiko. Harap segera laporkan jika
            Anda menemukan masalah keamanan.
          </p>
        </Section>

        <Section title="8. Perubahan Kebijakan">
          <p>
            Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Tanggal
            &ldquo;Terakhir diperbarui&rdquo; di bagian atas akan menunjukkan
            kapan revisi terbaru dilakukan.
          </p>
        </Section>

        <Section title="9. Kontak">
          <p>
            Pertanyaan atau permintaan terkait privasi dapat dikirim melalui
            kanal dukungan resmi EduSpin.
          </p>
        </Section>
      </article>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-base font-extrabold text-slate-800">
        {title}
      </h2>
      <div className="text-sm font-medium text-slate-700">{children}</div>
    </section>
  );
}
