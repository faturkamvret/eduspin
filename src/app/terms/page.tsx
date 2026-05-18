import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'Perjanjian Pengguna · EduSpin',
  description:
    'Perjanjian pengguna (syarat & ketentuan) penggunaan aplikasi EduSpin.',
};

const LAST_UPDATED = '18 Mei 2026';

export default function TermsPage() {
  return (
    <PageShell title="📃 Perjanjian Pengguna" deco={false}>
      <article className="card flex flex-col gap-4 text-sm leading-relaxed text-slate-700">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Terakhir diperbarui: {LAST_UPDATED}
        </p>

        <p>
          Dengan menggunakan aplikasi <strong>EduSpin</strong> (&ldquo;Aplikasi&rdquo;),
          Anda dan/atau orang tua/wali Anda menyetujui syarat dan ketentuan
          berikut. Mohon baca dengan saksama. Jika Anda tidak menyetujui,
          mohon untuk tidak menggunakan Aplikasi.
        </p>

        <Section title="1. Penerimaan Ketentuan">
          <p>
            Perjanjian ini berlaku saat Anda mengakses atau menggunakan
            Aplikasi. Anda bertanggung jawab untuk membaca pembaruan terbaru
            dari ketentuan ini.
          </p>
        </Section>

        <Section title="2. Kelayakan Pengguna">
          <ul className="ml-5 list-disc space-y-1">
            <li>
              Aplikasi ini ditujukan untuk anak-anak yang menggunakan dengan
              pengawasan orang tua atau wali yang sah.
            </li>
            <li>
              Orang tua/wali bertanggung jawab atas persetujuan penggunaan
              Aplikasi oleh anak.
            </li>
          </ul>
        </Section>

        <Section title="3. Akun & Profil">
          <ul className="ml-5 list-disc space-y-1">
            <li>
              Profil pengguna disimpan secara lokal di perangkat dan, secara
              opsional, disinkronkan ke penyimpanan cloud kami.
            </li>
            <li>
              Anda bertanggung jawab menjaga keamanan perangkat dan kredensial
              akun yang digunakan untuk sinkronisasi.
            </li>
          </ul>
        </Section>

        <Section title="4. Penggunaan yang Diperbolehkan">
          <p>Anda setuju untuk:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Menggunakan Aplikasi hanya untuk tujuan pribadi & non-komersial.</li>
            <li>Tidak menyalahgunakan, merusak, atau mengganggu layanan.</li>
            <li>
              Tidak melakukan rekayasa balik, melakukan eksploitasi bug, atau
              menggunakan bot/automation untuk meraih keuntungan dalam
              permainan.
            </li>
          </ul>
        </Section>

        <Section title="5. Mata Uang Virtual & Item Koleksi">
          <ul className="ml-5 list-disc space-y-1">
            <li>
              Koin, item, dan koleksi di dalam Aplikasi adalah konten virtual
              yang <strong>tidak memiliki nilai uang nyata</strong> dan tidak
              dapat ditukarkan dengan uang.
            </li>
            <li>
              Aplikasi tidak melakukan transaksi pembelian dengan uang
              sungguhan.
            </li>
            <li>
              Kami berhak menyesuaikan keseimbangan permainan, harga virtual,
              maupun peluang fitur acak untuk menjaga pengalaman bermain yang
              sehat.
            </li>
          </ul>
        </Section>

        <Section title="6. Konten Edukasi">
          <p>
            Konten kuis dan cerita disediakan untuk tujuan edukasi & hiburan.
            Kami berusaha menjaga keakuratan konten, namun tidak menjamin
            bahwa seluruh materi bebas dari kesalahan.
          </p>
        </Section>

        <Section title="7. Kekayaan Intelektual">
          <p>
            Seluruh elemen Aplikasi — termasuk kode, gambar, ikon, suara,
            karakter koleksi, dan teks — dilindungi hak kekayaan intelektual.
            Anda tidak boleh menyalin, mendistribusikan, atau membuat karya
            turunan tanpa izin tertulis.
          </p>
        </Section>

        <Section title="8. Privasi">
          <p>
            Penggunaan Aplikasi tunduk pada Kebijakan Privasi kami yang dapat
            diakses melalui halaman Pengaturan.
          </p>
        </Section>

        <Section title="9. Penghentian">
          <p>
            Anda dapat berhenti menggunakan Aplikasi kapan saja dengan
            menghapus aplikasi atau mereset data dari halaman Pengaturan. Kami
            berhak menangguhkan akses bila terjadi pelanggaran ketentuan ini.
          </p>
        </Section>

        <Section title="10. Penafian Jaminan">
          <p>
            Aplikasi disediakan &ldquo;sebagaimana adanya&rdquo; tanpa jaminan
            apa pun, baik tersurat maupun tersirat. Kami tidak menjamin bahwa
            Aplikasi akan selalu tersedia tanpa gangguan atau kesalahan.
          </p>
        </Section>

        <Section title="11. Batasan Tanggung Jawab">
          <p>
            Sepanjang diizinkan oleh hukum, EduSpin tidak bertanggung jawab
            atas kerugian tidak langsung, insidental, atau konsekuensial yang
            timbul dari penggunaan Aplikasi.
          </p>
        </Section>

        <Section title="12. Perubahan Ketentuan">
          <p>
            Kami dapat memperbarui ketentuan ini dari waktu ke waktu.
            Penggunaan Aplikasi setelah pembaruan dianggap sebagai persetujuan
            terhadap ketentuan terbaru.
          </p>
        </Section>

        <Section title="13. Hukum yang Berlaku">
          <p>
            Perjanjian ini diatur dan ditafsirkan berdasarkan hukum yang
            berlaku di Republik Indonesia.
          </p>
        </Section>

        <Section title="14. Kontak">
          <p>
            Untuk pertanyaan terkait perjanjian ini, silakan hubungi kami
            melalui kanal dukungan resmi EduSpin.
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
