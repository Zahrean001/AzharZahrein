export type Locale = 'id' | 'en';

export interface TranslationDictionary {
  // Navigation
  'nav.karya': string;
  'nav.sijagung': string;
  'nav.desain': string;
  'nav.tentang': string;
  'nav.pengalaman': string;
  'nav.pendidikan': string;
  'nav.keahlian': string;
  'nav.kontak': string;

  // Hero
  'hero.role': string;
  'hero.supporting': string;
  'hero.degree': string;
  'hero.scrollAria': string;
  'hero.hangingTag': string;
  'hero.hangingHint': string;
  'hero.ctaProjects': string;
  'hero.ctaResume': string;
  'hero.ctaContact': string;

  // Work Intro
  'workIntro.eyebrow': string;
  'workIntro.heading': string;
  'workIntro.desc': string;
  'workIntro.sijagungTitle': string;
  'workIntro.sijagungSummary': string;
  'workIntro.kemasanTitle': string;
  'workIntro.kemasanSummary': string;

  // About Section
  'about.eyebrow': string;
  'about.heading': string;
  'about.subheading': string;
  'about.roleTitle': string;
  'about.specEdu': string;
  'about.specEduVal': string;
  'about.specInst': string;
  'about.specInstVal': string;
  'about.specFocus': string;
  'about.specFocusVal': string;
  'about.specCert': string;
  'about.specCertVal': string;
  'about.specToefl': string;
  'about.specToeflVal': string;
  'about.specSchol': string;
  'about.specScholVal': string;
  'about.p1': string;
  'about.p2': string;
  'about.pillar1': string;
  'about.pillar1Desc': string;
  'about.pillar2': string;
  'about.pillar2Desc': string;
  'about.engineeringBadge': string;
  'about.designBadge': string;
  'about.stat1Num': string;
  'about.stat1Label': string;
  'about.stat2Num': string;
  'about.stat2Label': string;
  'about.stat3Num': string;
  'about.stat3Label': string;

  // SIJAGUNG Preview & Interactive Fan
  'sijagung.eyebrow': string;
  'sijagung.title': string;
  'sijagung.subtitle': string;
  'sijagung.desc': string;
  'sijagung.stack': string;
  'sijagung.defaultTitle': string;
  'sijagung.defaultCaption': string;
  'sijagung.screen0.title': string;
  'sijagung.screen0.caption': string;
  'sijagung.screen1.title': string;
  'sijagung.screen1.caption': string;
  'sijagung.screen2.title': string;
  'sijagung.screen2.caption': string;

  // SIJAGUNG Detailed Technical Case Study
  'sijagung.caseStudyBtn': string;
  'sijagung.caseStudyCloseBtn': string;
  'sijagung.dossierHeader': string;
  'sijagung.dossierStatus': string;
  'sijagung.caseStudyTitle': string;
  'sijagung.caseStudySubtitle': string;
  'sijagung.specRegion': string;
  'sijagung.specRegionVal': string;
  'sijagung.specRole': string;
  'sijagung.specRoleVal': string;
  'sijagung.specArch': string;
  'sijagung.specArchVal': string;
  'sijagung.specSync': string;
  'sijagung.specSyncVal': string;
  'sijagung.archHeading': string;
  'sijagung.archMobile': string;
  'sijagung.archCache': string;
  'sijagung.archApi': string;
  'sijagung.archBackend': string;
  'sijagung.archDatabase': string;
  'sijagung.flowLocal': string;
  'sijagung.flowSync': string;
  'sijagung.flowCommit': string;
  'sijagung.problemHeading': string;
  'sijagung.problemText': string;
  'sijagung.solutionHeading': string;
  'sijagung.solutionText': string;
  'sijagung.featuresHeading': string;
  'sijagung.feature1Title': string;
  'sijagung.feature1Desc': string;
  'sijagung.feature2Title': string;
  'sijagung.feature2Desc': string;
  'sijagung.feature3Title': string;
  'sijagung.feature3Desc': string;
  'sijagung.feature4Title': string;
  'sijagung.feature4Desc': string;
  'sijagung.roleHeading': string;
  'sijagung.roleText': string;
  'sijagung.challengeHeading': string;
  'sijagung.challengeText': string;
  'sijagung.verifiedBadge': string;
  'sijagung.simTitle': string;
  'sijagung.simHint': string;
  'sijagung.modeOffline': string;
  'sijagung.modeOnline': string;
  'sijagung.statusOffline': string;
  'sijagung.statusOnline': string;

  // Packaging Showcase
  'kemasan.eyebrow': string;
  'kemasan.heading': string;
  'kemasan.desc': string;
  'kemasan.front': string;
  'kemasan.back': string;
  'kemasan.flipHint': string;
  'kemasan.item1Desc': string;
  'kemasan.item2Desc': string;
  'kemasan.item3Desc': string;
  'kemasan.complianceNote': string;
  'kemasan.colophon1': string;
  'kemasan.colophon2': string;

  // Experience
  'exp.eyebrow': string;
  'exp.heading': string;
  'exp.company': string;
  'exp.program': string;
  'exp.period': string;
  'exp.track1Title': string;
  'exp.track1Desc': string;
  'exp.track2Title': string;
  'exp.track2Desc': string;

  // Education & Certifications
  'edu.eyebrow': string;
  'edu.heading': string;
  'edu.pensTitle': string;
  'edu.pensDegree': string;
  'edu.pensPeriod': string;
  'edu.pensTimeline': string;
  'edu.smknTitle': string;
  'edu.smknDegree': string;
  'edu.smknPeriod': string;
  'edu.smknTimeline': string;
  'edu.certHeading': string;
  'edu.certAws': string;
  'edu.certAwsIssuer': string;
  'edu.certToefl': string;
  'edu.certToeflIssuer': string;

  // Tools & Skills
  'tools.eyebrow': string;
  'tools.heading': string;
  'tools.desc': string;
  'tools.isoTitle': string;
  'tools.wheelHint': string;
  'tools.statusActive': string;
  'tools.statusLearning': string;
  'tools.filterAll': string;
  'tools.filterMobile': string;
  'tools.filterBackend': string;
  'tools.filterDesign': string;
  'tools.filterTools': string;
  'tools.matrixHeading': string;
  'tools.matrixSubheading': string;
  'tools.tagActive': string;
  'tools.tagLearning': string;
  'tools.footnote1': string;
  'tools.footnote2': string;

  // Contact
  'contact.heading': string;
  'contact.desc': string;
  'contact.role': string;
  'contact.emailLabel': string;
  'contact.phoneLabel': string;
  'contact.githubLabel': string;
  'contact.locationLabel': string;
  'contact.locationVal': string;
  'contact.cvLabel': string;
  'contact.cvDownload': string;
  'contact.footerSchool': string;
}

export const translations: Record<Locale, TranslationDictionary> = {
  id: {
    // Navigation
    'nav.karya': 'Proyek',
    'nav.sijagung': 'SIJAGUNG',
    'nav.desain': 'Kemasan',
    'nav.tentang': 'Tentang Saya',
    'nav.pengalaman': 'Pengalaman',
    'nav.pendidikan': 'Pendidikan',
    'nav.keahlian': 'Keahlian',
    'nav.kontak': 'Kontak',

    // Hero
    'hero.role': 'Web & Mobile Application Developer · UI/UX & Graphic Designer',
    'hero.supporting': 'Menggabungkan rekayasa perangkat lunak dengan desain antarmuka yang berpusat pada pengguna dan komunikasi visual.',
    'hero.degree': 'D3 Teknik Informatika, PENS',
    'hero.scrollAria': 'Scroll ke proyek',
    'hero.hangingTag': 'STILL CHASING MY DREAM',
    'hero.hangingHint': 'Klik & tarik untuk mengayun',
    'hero.ctaProjects': 'Lihat Proyek',
    'hero.ctaResume': 'Unduh Resume',
    'hero.ctaContact': 'Hubungi Saya',

    // Work Intro
    'workIntro.eyebrow': '03 / Karya & Rekayasa Terpilih',
    'workIntro.heading': 'Karya yang saya bangun',
    'workIntro.desc': 'Fokus pada pengembangan aplikasi digital yang fungsional dan teruji di lapangan, didukung keahlian desain kemasan komersial untuk produk UMKM.',
    'workIntro.sijagungTitle': 'SIJAGUNG',
    'workIntro.sijagungSummary': 'Aplikasi mobile pemantauan pertanian jagung Desa Kelubir',
    'workIntro.kemasanTitle': 'Desain Kemasan Komersial',
    'workIntro.kemasanSummary': 'Standing pouch berstandar ritel untuk UMKM binaan CSR',

    // About Section
    'about.eyebrow': '01 / Tentang Saya',
    'about.heading': 'Tentang Saya',
    'about.subheading': 'Rekayasa Perangkat Lunak & Desain Produk Digital',
    'about.roleTitle': 'Teknisi Perangkat Lunak & Perancang Antarmuka',
    'about.specEdu': 'Pendidikan',
    'about.specEduVal': 'D3 Teknik Informatika',
    'about.specInst': 'Institusi',
    'about.specInstVal': 'PENS Surabaya',
    'about.specFocus': 'Fokus Rekayasa',
    'about.specFocusVal': 'Mobile & Full-Stack Web',
    'about.specCert': 'Sertifikasi Cloud',
    'about.specCertVal': 'AWS Academy Graduate',
    'about.specToefl': 'Bahasa Inggris',
    'about.specToeflVal': 'TOEFL Score: 483',
    'about.specSchol': 'Beasiswa',
    'about.specScholVal': 'PT Pesona Khatulistiwa Nusantara',
    'about.p1':
      'Web & Mobile Application Developer dengan latar belakang Teknik Informatika serta pengalaman praktis dalam dukungan aplikasi web internal, pengelolaan basis data, dan pengembangan aplikasi. Berpengalaman pula dalam desain UI/UX, branding, dan desain kemasan komersial. Memadukan pemecahan masalah teknis dengan komunikasi visual untuk membangun solusi digital yang fungsional dan berorientasi pada pengguna.',
    'about.p2': '',
    'about.pillar1': 'Pilar Rekayasa Perangkat Lunak',
    'about.pillar1Desc':
      'Pengembangan aplikasi web dan mobile, integrasi RESTful API, arsitektur kode terstruktur dan bersih, perancangan & optimasi basis data, serta rekayasa lintas platform yang andal.',
    'about.pillar2': 'Pilar Desain & Komunikasi Visual',
    'about.pillar2Desc':
      'Desain antarmuka UI/UX komprehensif, pembuatan prototipe interaktif, sistem desain, branding digital, dan komunikasi visual komersial yang berorientasi pada kenyamanan pengguna dan daya tarik pasar.',
    'about.engineeringBadge': 'Fokus Utama: Software Engineering',
    'about.designBadge': 'Nilai Tambah: UI/UX & Desain Grafis',
    'about.stat1Num': 'D3',
    'about.stat1Label': 'Teknik Informatika PENS',
    'about.stat2Num': 'Full-Stack',
    'about.stat2Label': 'Flutter + Laravel + MySQL',
    'about.stat3Num': 'AWS & TOEFL',
    'about.stat3Label': 'Sertifikasi Resmi',

    // SIJAGUNG Preview & Interactive Fan
    'sijagung.eyebrow': 'Studi Kasus Rekayasa Perangkat Lunak · Desa Kelubir',
    'sijagung.title': 'SIJAGUNG',
    'sijagung.subtitle': 'Aplikasi mobile pemantauan pertanian jagung untuk Desa Kelubir.',
    'sijagung.desc': 'Aplikasi mobile berarsitektur offline-first dengan Flutter untuk pencatatan petani, lahan, dan hasil panen di Desa Kelubir. Data tersimpan lokal di SQLite dan tersinkronisasi otomatis ke backend Laravel REST API & MySQL saat sinyal tersedia.',
    'sijagung.stack': 'Flutter · SQLite · Laravel 10 · MySQL · REST API',
    'sijagung.defaultTitle': 'Dashboard · Data Petani · Data Panen',
    'sijagung.defaultCaption': '“Ringkasan data lapangan, pencatatan petani, dan hasil panen dalam satu alur aplikasi.”',
    'sijagung.screen0.title': 'Dashboard',
    'sijagung.screen0.caption': '“Ringkasan data lapangan dan statistik panen secara real-time.”',
    'sijagung.screen1.title': 'Data Petani',
    'sijagung.screen1.caption': '“Pencatatan profil dan luas lahan petani secara offline di perkebunan.”',
    'sijagung.screen2.title': 'Data Panen',
    'sijagung.screen2.caption': '“Pencatatan hasil tonase panen dengan validasi komoditas.”',

    // SIJAGUNG Detailed Technical Case Study
    'sijagung.caseStudyBtn': 'Buka Detail Arsitektur & Studi Kasus',
    'sijagung.caseStudyCloseBtn': 'Tutup Studi Kasus',
    'sijagung.dossierHeader': 'DOKUMEN SPESIFIKASI REKAYASA SISTEM',
    'sijagung.dossierStatus': 'STATUS: TERVERIFIKASI & SIAP UJI LAPANGAN',
    'sijagung.caseStudyTitle': 'Studi Kasus Teknis: SIJAGUNG',
    'sijagung.caseStudySubtitle': 'Sistem Informasi Pertanian Jagung Lapangan — Desa Kelubir',
    'sijagung.specRegion': 'Konteks Wilayah',
    'sijagung.specRegionVal': 'Desa Kelubir, Bulungan',
    'sijagung.specRole': 'Peran Teknis',
    'sijagung.specRoleVal': 'Mobile Dev & UI/UX',
    'sijagung.specArch': 'Arsitektur Data',
    'sijagung.specArchVal': 'Offline-First Cache',
    'sijagung.specSync': 'Protokol Sinkronisasi',
    'sijagung.specSyncVal': 'Idempotent REST Queue',
    'sijagung.archHeading': 'Arsitektur Sistem & Aliran Data',
    'sijagung.archMobile': 'Aplikasi Mobile Flutter',
    'sijagung.archCache': 'Cache Lokal SQLite (Offline)',
    'sijagung.archApi': 'RESTful API / JSON Bearer',
    'sijagung.archBackend': 'Backend Laravel 10 (PHP)',
    'sijagung.archDatabase': 'Basis Data Terpusat MySQL',
    'sijagung.flowLocal': 'ALUR LOKAL: Transaksi SQLite tanpa sinyal',
    'sijagung.flowSync': 'SINKRONISASI OTOMATIS: Batch POST ke API saat online terdeteksi',
    'sijagung.flowCommit': 'KOMIT SERVER: Verifikasi timestamp di MySQL',
    'sijagung.problemHeading': '1. Latar Belakang & Masalah',
    'sijagung.problemText': 'Sebelumnya, pendataan petani dan panen di Desa Kelubir dilakukan secara manual menggunakan kertas kerja. Kondisi geografis perkebunan seringkali mengalami blind spot jaringan seluler, mengakibatkan keterlambatan rekapitulasi data, duplikasi informasi, dan hilangnya catatan hasil panen lapangan.',
    'sijagung.solutionHeading': '2. Solusi Rekayasa & Alur Kerja Offline',
    'sijagung.solutionText': 'Membangun aplikasi mobile client-server dengan prinsip Offline-First. Seluruh transaksi pendataan langsung ditulis ke database lokal SQLite di perangkat. Background worker memantau status konektivitas internet secara otomatis, kemudian melakukan sinkronisasi batch ke endpoint Laravel REST API begitu koneksi terhubung kembali.',
    'sijagung.featuresHeading': '3. Fitur Utama yang Diimplementasikan',
    'sijagung.feature1Title': 'Pendataan Petani & Lahan',
    'sijagung.feature1Desc': 'Pencatatan identitas petani, luas petak lahan, dan estimasi waktu tanam tanpa ketergantungan koneksi internet.',
    'sijagung.feature2Title': 'Pencatatan Panen Cepat',
    'sijagung.feature2Desc': 'Pencatatan tonase hasil panen dan mutu jagung dengan kalkulasi otomatis dan verifikasi input.',
    'sijagung.feature3Title': 'Sinkronisasi Otomatis',
    'sijagung.feature3Desc': 'Antrian sinkronisasi data dengan resolusi konflik berbasis stempel waktu (timestamp) untuk mencegah data terhapus.',
    'sijagung.feature4Title': 'Desain Ergonomis Terik Matahari',
    'sijagung.feature4Desc': 'Antarmuka kontras tinggi dan ukuran tombol 48px+ untuk mempermudah operasional satu tangan di kondisi lapangan.',
    'sijagung.roleHeading': '4. Peran & Kontribusi Nyata',
    'sijagung.roleText': 'Mobile Application Developer & UI/UX Designer — Bertanggung jawab penuh atas perancangan antarmuka mobile, struktur database SQLite lokal, alur validasi formulir lapangan, integrasi endpoint REST API backend, serta pengujian sinkronisasi data.',
    'sijagung.challengeHeading': '5. Tantangan Teknis & Pemecahan Masalah',
    'sijagung.challengeText': 'Tantangan koneksi terputus saat proses transmisi diselesaikan dengan transaksi atomik di SQLite dan mekanisme payload retry idempotent di API. Kendala pengoperasian petugas disederhanakan dengan alur wizard bertahap dan petunjuk visual yang jelas.',
    'sijagung.verifiedBadge': 'Status: Terverifikasi & Siap Uji Lapangan',
    'sijagung.simTitle': 'Simulasi Pipeline Sinkronisasi Data',
    'sijagung.simHint': 'Pilih mode untuk melihat simulasi aliran data offline-ke-online:',
    'sijagung.modeOffline': 'Mode Ladang (Offline)',
    'sijagung.modeOnline': 'Sinyal Terhubung (Auto-Sync)',
    'sijagung.statusOffline': '[STATUS: OFFLINE] 12 transaksi panen diamankan di SQLite perangkat. Flag is_synced=0 siap dikirim saat sinyal terdeteksi.',
    'sijagung.statusOnline': '[STATUS: SYNCED] Sinyal terdeteksi. Background worker mengirim batch payload ke Laravel API. 12 data diverifikasi & dikomit ke MySQL.',

    // Packaging Showcase
    'kemasan.eyebrow': 'Desain Kemasan Komersial Ritel · Program CSR PT PKN',
    'kemasan.heading': 'Desain Kemasan Komersial UMKM',
    'kemasan.desc': 'Tiga desain standing pouch untuk produk makanan UMKM mitra binaan CSR PT Pesona Khatulistiwa Nusantara, memadukan daya pikat visual ritel dengan kepatuhan regulasi legalitas.',
    'kemasan.front': 'Tampak Depan',
    'kemasan.back': 'Tampak Belakang',
    'kemasan.flipHint': 'Klik atau geser kemasan untuk membalik (Tampak Depan / Belakang)',
    'kemasan.item1Desc': 'Mbah Momon Tiwul — Makanan pokok instan olahan singkong tradisional. Konsep desain memadukan tipografi Nusantara modern dengan palet warna bersahaja (earth-tone) dan jendela transparan produk.',
    'kemasan.item2Desc': 'Onde-Onde Mini — Kudapan renyah berbentuk bulat mini. Pendekatan visual dinamis dengan appetite appeal tinggi untuk menarik minat konsumen ritel dan oleh-oleh daerah.',
    'kemasan.item3Desc': 'Surti Snack Keriuk Tempe — Keripik tempe renyah bumbu rempah. Penataan tipografi kontras tinggi untuk mempermudah identifikasi varian rasa dan keterbacaan tabel legalitas.',
    'kemasan.complianceNote': 'Seluruh kemasan mematuhi standarisasi legalitas pangan komersial: Nomor P-IRT Dinas Kesehatan, label Halal resmi, komposisi bahan baku, tanggal kedaluwarsa, berat bersih, dan tabel informasi nilai gizi.',
    'kemasan.colophon1': 'STANDARISASI LEGALITAS KEMASAN PANGAN UMKM BINAAN CSR',
    'kemasan.colophon2': 'NOMOR P-IRT DINKES · SERTIFIKASI HALAL · NUTRITION FACTS',

    // Experience
    'exp.eyebrow': '02 / Riwayat Profesional & Kemitraan CSR',
    'exp.heading': 'Pengalaman',
    'exp.company': 'PT Pesona Khatulistiwa Nusantara (ENM Group)',
    'exp.program': 'Penerima Beasiswa Prestasi & Pelaksana Proyek IT / Desain',
    'exp.period': '2023 – 2026 (Berkala & Terstruktur)',
    'exp.track1Title': 'Pengembangan Aplikasi & Dukungan IT',
    'exp.track1Desc': 'Merancang dan membangun aplikasi mobile SIJAGUNG untuk digitalisasi pencatatan data pertanian jagung di Desa Kelubir. Membantu operasional pemeliharaan sistem TI kantor, manajemen basis data, dan penanganan kendala teknis perangkat keras/lunak.',
    'exp.track2Title': 'Desain Kemasan & Identitas Visual UMKM',
    'exp.track2Desc': 'Merancang identitas merek, desain kemasan standing pouch komersial siap cetak, dan materi promosi visual untuk UMKM mitra binaan Program Pengembangan Masyarakat (CSR/PPM) PT PKN.',

    // Education & Certifications
    'edu.eyebrow': '04 / Kualifikasi Akademik & Kredensial Resmi',
    'edu.heading': 'Pendidikan & Sertifikasi',
    'edu.pensTitle': 'Politeknik Elektronika Negeri Surabaya (PENS)',
    'edu.pensDegree': 'Associate Degree (D3) Teknik Informatika · A.Md.Kom.',
    'edu.pensPeriod': '2023 – 2026',
    'edu.pensTimeline': '2023 – 2026',
    'edu.smknTitle': 'SMK Negeri 2 Tanjung Selor',
    'edu.smknDegree': 'Kompetensi Keahlian Rekayasa Multimedia',
    'edu.smknPeriod': '2020 – 2023',
    'edu.smknTimeline': '2020 – 2023 · Lulus',
    'edu.certHeading': 'Sertifikasi Terverifikasi:',
    'edu.certAws': 'AWS Academy Graduate — AWS Academy Cloud Developing (Amazon Web Services)',
    'edu.certAwsIssuer': 'Amazon Web Services · Verified',
    'edu.certToefl': 'TOEFL (Test of English as a Foreign Language) — Skor: 483 (High Intermediate)',
    'edu.certToeflIssuer': 'High Intermediate Proficiency · Verified',

    // Tools & Skills
    'tools.eyebrow': '05 / Keahlian Teknis & Alat Kerja',
    'tools.heading': 'Keahlian Teknis & Alat Kerja',
    'tools.desc': 'Klasifikasi keahlian terstruktur yang saya terapkan dalam rekayasa aplikasi serta teknologi yang sedang aktif saya pelajari.',
    'tools.isoTitle': 'Showcase Isometrik 3D · Interaktif',
    'tools.wheelHint': 'Arahkan kursor & putar scroll wheel mouse untuk menggeser horizontal ⇄',
    'tools.statusActive': 'Dikuasai (Aktif)',
    'tools.statusLearning': 'Eksplorasi (Warna Nonaktif)',
    'tools.filterAll': 'Semua',
    'tools.filterMobile': 'Mobile & Web',
    'tools.filterBackend': 'Backend & Data',
    'tools.filterDesign': 'UI/UX & Desain',
    'tools.filterTools': 'Alat & Cloud',
    'tools.matrixHeading': 'Inventaris Keahlian Terverifikasi',
    'tools.matrixSubheading': 'Dokumentasi Kompetensi Rekayasa Terstruktur',
    'tools.tagActive': '[DIKUASAI]',
    'tools.tagLearning': '[EKSPLORASI]',
    'tools.footnote1': '[DIKUASAI] = Kemampuan teruji langsung dalam rekayasa aplikasi & alur kerja produksi.',
    'tools.footnote2': '[EKSPLORASI] = Teknologi industri dalam kurikulum riset (warna dinonaktifkan).',

    // Contact
    'contact.heading': 'Mari Berkolaborasi',
    'contact.desc': 'Terbuka untuk peluang kerja Junior Web Developer, Junior Mobile Developer, Junior Software Engineer, dan Application Developer.',
    'contact.role': 'Web & Mobile Application Developer · UI/UX & Graphic Designer',
    'contact.emailLabel': 'Email Langsung',
    'contact.phoneLabel': 'WhatsApp / Telepon',
    'contact.githubLabel': 'GitHub Profile',
    'contact.locationLabel': 'Domisili / Lokasi',
    'contact.locationVal': 'Surabaya / Tanjung Selor, Indonesia',
    'contact.cvLabel': 'Curriculum Vitae — &nbsp;',
    'contact.cvDownload': 'Unduh Resume (PDF)',
    'contact.footerSchool': 'D3 Teknik Informatika, Politeknik Elektronika Negeri Surabaya',
  },
  en: {
    // Navigation
    'nav.karya': 'Projects',
    'nav.sijagung': 'SIJAGUNG',
    'nav.desain': 'Packaging',
    'nav.tentang': 'About me',
    'nav.pengalaman': 'Experience',
    'nav.pendidikan': 'Education',
    'nav.keahlian': 'Skills',
    'nav.kontak': 'Contact',

    // Hero
    'hero.role': 'Web & Mobile Application Developer · UI/UX & Graphic Designer',
    'hero.supporting': 'Combining software engineering with user-centered interface design and visual communication.',
    'hero.degree': 'Associate Degree (D3) in Informatics Engineering, PENS',
    'hero.scrollAria': 'Scroll to projects',
    'hero.hangingTag': 'STILL CHASING MY DREAM',
    'hero.hangingHint': 'Click & drag to swing',
    'hero.ctaProjects': 'View Projects',
    'hero.ctaResume': 'Download Resume',
    'hero.ctaContact': 'Contact Me',

    // Work Intro
    'workIntro.eyebrow': '03 / Featured Engineering & Design Works',
    'workIntro.heading': 'Featured Engineering & Design Works',
    'workIntro.desc': 'Dedicated to building functional, field-tested digital products and delivering regulatory-compliant commercial packaging for local enterprises.',
    'workIntro.sijagungTitle': 'SIJAGUNG',
    'workIntro.sijagungSummary': 'Offline-first mobile corn farming data platform for Kelubir Village',
    'workIntro.kemasanTitle': 'Commercial Packaging',
    'workIntro.kemasanSummary': 'Retail-ready standing pouches for enterprise CSR partner MSMEs',

    // About Section
    'about.eyebrow': '01 / About Me',
    'about.heading': 'About me',
    'about.subheading': 'Software Engineering & Digital Product Design',
    'about.roleTitle': 'Software Engineer & Interface Designer',
    'about.specEdu': 'Education',
    'about.specEduVal': 'Associate Degree (D3) Informatics Engineering',
    'about.specInst': 'Institution',
    'about.specInstVal': 'PENS Surabaya',
    'about.specFocus': 'Engineering Focus',
    'about.specFocusVal': 'Mobile & Full-Stack Web',
    'about.specCert': 'Cloud Certification',
    'about.specCertVal': 'AWS Academy Graduate',
    'about.specToefl': 'English Proficiency',
    'about.specToeflVal': 'TOEFL Score: 483',
    'about.specSchol': 'Scholarship',
    'about.specScholVal': 'PT Pesona Khatulistiwa Nusantara',
    'about.p1':
      'Web & Mobile Application Developer with an Informatics Engineering background and practical experience in internal web application support, database management, and application development. Also experienced in UI/UX design, branding, and commercial packaging design. Combines technical problem-solving with visual communication to build functional and user-oriented digital solutions.',
    'about.p2': '',
    'about.pillar1': 'Software Engineering Pillar',
    'about.pillar1Desc':
      'Mobile and web application development, RESTful API integration, structured clean code architecture, relational database management & query optimization, and reliable cross-platform engineering.',
    'about.pillar2': 'Design & Visual Communication Pillar',
    'about.pillar2Desc':
      'End-to-end UI/UX interface design, interactive prototyping, design systems, digital branding, and commercial visual communication focused on usability and market clarity.',
    'about.engineeringBadge': 'Primary Discipline: Software Engineering',
    'about.designBadge': 'Competitive Advantage: UI/UX & Graphic Design',
    'about.stat1Num': 'D3',
    'about.stat1Label': 'Informatics Engineering PENS',
    'about.stat2Num': 'Full-Stack',
    'about.stat2Label': 'Flutter + Laravel + MySQL',
    'about.stat3Num': 'AWS & TOEFL',
    'about.stat3Label': 'Official Credentials',

    // SIJAGUNG Preview & Interactive Fan
    'sijagung.eyebrow': 'Software Engineering Case Study · Kelubir Village',
    'sijagung.title': 'SIJAGUNG',
    'sijagung.subtitle': 'Offline-first mobile agricultural data monitoring application for Kelubir Village.',
    'sijagung.desc': 'Engineered with Flutter for logging farmers, land plots, and harvest yields across Kelubir Village. Features local SQLite caching and automated synchronization to a Laravel REST API & MySQL backend once connectivity is detected.',
    'sijagung.stack': 'Flutter · SQLite · Laravel 10 · MySQL · REST API',
    'sijagung.defaultTitle': 'Dashboard · Farmer Registry · Harvest Records',
    'sijagung.defaultCaption': '“Comprehensive field summaries, farmer registries, and yield logging in one cohesive workflow.”',
    'sijagung.screen0.title': 'Dashboard',
    'sijagung.screen0.caption': '“Field overview and real-time harvest statistics in one screen.”',
    'sijagung.screen1.title': 'Farmer Registry',
    'sijagung.screen1.caption': '“Offline recording of farmer profiles and land acreage on-site.”',
    'sijagung.screen2.title': 'Harvest Records',
    'sijagung.screen2.caption': '“Harvest tonnage logging with commodity verification.”',

    // SIJAGUNG Detailed Technical Case Study
    'sijagung.caseStudyBtn': 'Explore Architecture & Technical Case Study',
    'sijagung.caseStudyCloseBtn': 'Close Case Study',
    'sijagung.dossierHeader': 'SYSTEM ENGINEERING SPECIFICATION DOSSIER',
    'sijagung.dossierStatus': 'STATUS: VERIFIED & FIELD-READY',
    'sijagung.caseStudyTitle': 'Technical Case Study: SIJAGUNG',
    'sijagung.caseStudySubtitle': 'Corn Agricultural Field Information & Monitoring System — Kelubir Village',
    'sijagung.specRegion': 'Regional Context',
    'sijagung.specRegionVal': 'Kelubir Village, Bulungan',
    'sijagung.specRole': 'Technical Role',
    'sijagung.specRoleVal': 'Mobile Dev & UI/UX',
    'sijagung.specArch': 'Data Architecture',
    'sijagung.specArchVal': 'Offline-First Cache',
    'sijagung.specSync': 'Sync Protocol',
    'sijagung.specSyncVal': 'Idempotent REST Queue',
    'sijagung.archHeading': 'System Architecture & Data Flow',
    'sijagung.archMobile': 'Flutter Mobile Client',
    'sijagung.archCache': 'Local SQLite Cache (Offline)',
    'sijagung.archApi': 'RESTful API / JSON Bearer',
    'sijagung.archBackend': 'Laravel 10 Backend (PHP)',
    'sijagung.archDatabase': 'Central MySQL Database',
    'sijagung.flowLocal': 'LOCAL FLOW: Zero-signal SQLite transactions',
    'sijagung.flowSync': 'AUTOMATIC SYNC: Batch POST to API on reconnect',
    'sijagung.flowCommit': 'SERVER COMMIT: Timestamp verification in MySQL',
    'sijagung.problemHeading': '1. Background & Field Problem',
    'sijagung.problemText': 'Kelubir Village previously relied on paper ledgers for all agricultural data collection. Agricultural plantation tracts suffer frequent cellular connectivity blackouts, leading to multi-week reporting lag, duplicate records, and irrecoverable harvest log discrepancies.',
    'sijagung.solutionHeading': '2. Engineering Solution & Offline Architecture',
    'sijagung.solutionText': 'Architected a client-server mobile application using an Offline-First approach. All transactions are immediately committed to a local SQLite database on the mobile device. A connectivity listener detects network recovery, dispatching idempotent batch payloads to a Laravel REST API and centralized MySQL database.',
    'sijagung.featuresHeading': '3. Key Implemented Features',
    'sijagung.feature1Title': 'Offline Farmer & Plot Registry',
    'sijagung.feature1Desc': 'Registering farmer identity, coordinates, plot boundaries, and crop varieties without an active network connection.',
    'sijagung.feature2Title': 'Rapid Harvest Logging',
    'sijagung.feature2Desc': 'Logging gross tonnage and corn quality grades with client-side arithmetic validation.',
    'sijagung.feature3Title': 'Automated Background Sync',
    'sijagung.feature3Desc': 'Idempotent request queue with timestamp-based conflict resolution preventing record overwrites.',
    'sijagung.feature4Title': 'Daylight Ergonomic UI',
    'sijagung.feature4Desc': 'High-contrast typography and 48px+ touch targets optimized for single-handed use under direct equatorial sunlight.',
    'sijagung.roleHeading': '4. Role & Technical Scope',
    'sijagung.roleText': 'Mobile Application Developer & UI/UX Designer — Sole owner of mobile screen implementation, local SQLite caching schema, form validation workflows, backend REST API consumption, and sync conflict resolution testing.',
    'sijagung.challengeHeading': '5. Technical Challenges & Resolution',
    'sijagung.challengeText': 'Network dropouts during mid-payload transmission were resolved using SQLite atomic transactions and idempotent API headers. Usability friction for non-technical field officers was resolved via progressive multi-step forms and immediate visual status tags.',
    'sijagung.verifiedBadge': 'Status: Verified & Field-Ready',
    'sijagung.simTitle': 'Data Synchronization Pipeline Simulation',
    'sijagung.simHint': 'Select mode to simulate offline-to-online data stream:',
    'sijagung.modeOffline': 'Field Mode (Offline)',
    'sijagung.modeOnline': 'Network Connected (Auto-Sync)',
    'sijagung.statusOffline': '[STATUS: OFFLINE] 12 harvest records committed to local SQLite storage. Flag is_synced=false queued for batch transmission.',
    'sijagung.statusOnline': '[STATUS: SYNCED] Network socket connected. Background daemon dispatched batch payload to Laravel API. 12 records reconciled in MySQL.',

    // Packaging Showcase
    'kemasan.eyebrow': 'Retail Commercial Packaging · PT PKN CSR Program',
    'kemasan.heading': 'Commercial MSME Packaging Design',
    'kemasan.desc': 'Three standing pouch packaging designs for partner food MSMEs mentored under PT Pesona Khatulistiwa Nusantara CSR initiative, harmonizing commercial retail presence with statutory labeling compliance.',
    'kemasan.front': 'Front View',
    'kemasan.back': 'Back View',
    'kemasan.flipHint': 'Click or drag pouch to flip (Front / Back)',
    'kemasan.item1Desc': 'Mbah Momon Tiwul — Traditional cassava-based staple food. Design combines modern-heritage typography with warm earthy tones and a transparent inspection window.',
    'kemasan.item2Desc': 'Onde-Onde Mini — Crispy bite-sized sesame pastry snacks. Dynamic visual layout designed for high appetite appeal and retail gift-shop prominence.',
    'kemasan.item3Desc': 'Surti Snack Keriuk Tempe — Savory artisanal soybean tempeh chips. High-contrast hierarchy prioritizing flavor distinction and rapid legibility of regulatory panels.',
    'kemasan.complianceNote': 'All packaging designs comply strictly with statutory food manufacturing standards: Municipal Health Office P-IRT numbers, official Halal emblems, ingredient listings, expiration dates, net weights, and nutrition fact tables.',
    'kemasan.colophon1': 'STATUTORY FOOD PACKAGING STANDARDIZATION · CSR MENTORED MSMES',
    'kemasan.colophon2': 'HEALTH OFFICE P-IRT · HALAL CERTIFICATION · NUTRITION FACTS',

    // Experience
    'exp.eyebrow': '02 / Professional History & CSR Engagements',
    'exp.heading': 'Experience',
    'exp.company': 'PT Pesona Khatulistiwa Nusantara (ENM Group)',
    'exp.program': 'CSR Merit Scholarship Awardee & Dual-Track IT / Design Intern',
    'exp.period': '2023 – 2026 (Structured Engagements)',
    'exp.track1Title': 'Application Development & IT Support',
    'exp.track1Desc': 'Architected and built the SIJAGUNG mobile application for digitalizing agricultural records in Kelubir Village. Assisted enterprise IT hardware maintenance, database administration, and technical issue troubleshooting across office systems.',
    'exp.track2Title': 'Commercial Packaging & MSME Branding',
    'exp.track2Desc': 'Designed complete brand identities, production-ready retail standing pouches, and marketing collateral for local MSMEs mentored under PT PKN\'s Community Development (CSR) program.',

    // Education & Certifications
    'edu.eyebrow': '04 / Academic Qualifications & Official Credentials',
    'edu.heading': 'Education & Certifications',
    'edu.pensTitle': 'Politeknik Elektronika Negeri Surabaya (PENS)',
    'edu.pensDegree': 'Associate Degree (D3) in Informatics Engineering · A.Md.Kom.',
    'edu.pensPeriod': '2023 – 2026',
    'edu.pensTimeline': '2023 – 2026',
    'edu.smknTitle': 'SMK Negeri 2 Tanjung Selor',
    'edu.smknDegree': 'Vocational Diploma in Multimedia Engineering',
    'edu.smknPeriod': '2020 – 2023',
    'edu.smknTimeline': '2020 – 2023 · Graduated',
    'edu.certHeading': 'Verified Certifications:',
    'edu.certAws': 'AWS Academy Graduate — AWS Academy Cloud Developing (Amazon Web Services)',
    'edu.certAwsIssuer': 'Amazon Web Services · Verified',
    'edu.certToefl': 'TOEFL (Test of English as a Foreign Language) — Score: 483 (High Intermediate)',
    'edu.certToeflIssuer': 'High Intermediate Proficiency · Verified',

    // Tools & Skills
    'tools.eyebrow': '05 / Technical Skills & Tools',
    'tools.heading': 'Technical Skills & Tooling',
    'tools.desc': 'Structured technical proficiencies applied in software development and design, alongside technologies currently being explored.',
    'tools.isoTitle': 'Interactive 3D Isometric Showcase',
    'tools.wheelHint': 'Hover & use mouse scroll wheel to pan horizontally ⇄',
    'tools.statusActive': 'Mastered (Active)',
    'tools.statusLearning': 'Exploring (Color Deactivated)',
    'tools.filterAll': 'All',
    'tools.filterMobile': 'Mobile & Web',
    'tools.filterBackend': 'Backend & Data',
    'tools.filterDesign': 'UI/UX & Design',
    'tools.filterTools': 'Tools & Cloud',
    'tools.matrixHeading': 'Verified Technical Skill Inventory',
    'tools.matrixSubheading': 'Structured Engineering Competency Documentation',
    'tools.tagActive': '[MASTERED]',
    'tools.tagLearning': '[EXPLORING]',
    'tools.footnote1': '[MASTERED] = Directly applied in production application engineering and live workflows.',
    'tools.footnote2': '[EXPLORING] = Industry technologies under active study (colors deactivated).',

    // Contact
    'contact.heading': "Let's Collaborate",
    'contact.desc': 'Actively seeking Junior Web Developer, Junior Mobile Developer, Junior Software Engineer, and Application Developer roles.',
    'contact.role': 'Web & Mobile Application Developer · UI/UX & Graphic Designer',
    'contact.emailLabel': 'Direct Email',
    'contact.phoneLabel': 'WhatsApp / Phone',
    'contact.githubLabel': 'GitHub Profile',
    'contact.locationLabel': 'Location',
    'contact.locationVal': 'Surabaya / Tanjung Selor, Indonesia',
    'contact.cvLabel': 'Curriculum Vitae — &nbsp;',
    'contact.cvDownload': 'Download Resume (PDF)',
    'contact.footerSchool': 'Associate Degree (D3) in Informatics Engineering, PENS',
  },
};

/**
 * Detect user region/locale based on:
 * 1. Explicit user choice in localStorage
 * 2. Browser language (navigator.languages / navigator.language)
 * 3. System timezone (Indonesian timezones = 'id', others = 'en')
 */
export function detectUserLocale(): Locale {
  if (typeof window === 'undefined') return 'id';

  // 1. Check saved preference
  try {
    const saved = localStorage.getItem('portfolio_lang');
    if (saved === 'id' || saved === 'en') return saved;
  } catch {}

  // 2. Check browser language
  const browserLanguages = navigator.languages || [navigator.language || ''];
  const hasIdLang = browserLanguages.some((lang) =>
    lang.toLowerCase().startsWith('id')
  );
  if (hasIdLang) return 'id';

  // 3. Check timezone for Indonesian regions
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (
      tz.includes('Jakarta') ||
      tz.includes('Pontianak') ||
      tz.includes('Makassar') ||
      tz.includes('Jayapura')
    ) {
      return 'id';
    }
  } catch {}

  // Default to English for international users
  return 'en';
}
