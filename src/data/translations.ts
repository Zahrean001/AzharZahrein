export type Locale = 'id' | 'en';

export interface TranslationDictionary {
  // Navigation
  'nav.karya': string;
  'nav.desain': string;
  'nav.profil': string;
  'nav.kontak': string;

  // Hero
  'hero.role': string;
  'hero.degree': string;
  'hero.scrollAria': string;
  'hero.hangingTag': string;
  'hero.hangingHint': string;

  // Work Intro
  'workIntro.heading': string;
  'workIntro.desc': string;
  'workIntro.sijagungTitle': string;
  'workIntro.sijagungSummary': string;
  'workIntro.kemasanTitle': string;
  'workIntro.kemasanSummary': string;

  // SIJAGUNG
  'sijagung.title': string;
  'sijagung.subtitle': string;
  'sijagung.desc': string;
  'sijagung.defaultTitle': string;
  'sijagung.defaultCaption': string;
  'sijagung.screen0.title': string;
  'sijagung.screen0.caption': string;
  'sijagung.screen1.title': string;
  'sijagung.screen1.caption': string;
  'sijagung.screen2.title': string;
  'sijagung.screen2.caption': string;

  // Packaging
  'kemasan.heading': string;
  'kemasan.desc': string;
  'kemasan.front': string;
  'kemasan.back': string;

  // Experience & Education
  'exp.heading': string;
  'exp.role': string;
  'exp.desc': string;
  'edu.heading': string;
  'edu.school': string;
  'edu.degree': string;
  'edu.certHeading': string;

  // Tools
  'tools.heading': string;
  'tools.desc': string;
  'tools.statusActive': string;
  'tools.statusLearning': string;

  // Contact
  'contact.desc': string;
  'contact.role': string;
  'contact.cvLabel': string;
  'contact.cvDownload': string;
  'contact.footerSchool': string;
}

export const translations: Record<Locale, TranslationDictionary> = {
  id: {
    // Navigation
    'nav.karya': 'Karya',
    'nav.desain': 'Desain',
    'nav.profil': 'Profil',
    'nav.kontak': 'Kontak',

    // Hero
    'hero.role': 'Junior Web & Application Developer · Graphic Designer',
    'hero.degree': 'D3 Teknik Informatika, PENS',
    'hero.scrollAria': 'Scroll ke karya',
    'hero.hangingTag': 'STILL CHASING MY DREAM',
    'hero.hangingHint': 'Klik & tarik untuk mengayun',

    // Work Intro
    'workIntro.heading': 'Karya yang saya bangun',
    'workIntro.desc': 'Selama studi, saya mengerjakan aplikasi mobile untuk kebutuhan lapangan dan desain kemasan untuk UMKM.',
    'workIntro.sijagungTitle': 'SIJAGUNG',
    'workIntro.sijagungSummary': 'Aplikasi data petani jagung untuk Desa Kelubir',
    'workIntro.kemasanTitle': 'Desain kemasan UMKM',
    'workIntro.kemasanSummary': 'Standing pouch untuk produk makanan',

    // SIJAGUNG
    'sijagung.title': 'SIJAGUNG',
    'sijagung.subtitle': 'Aplikasi data petani jagung untuk Desa Kelubir.',
    'sijagung.desc': 'Dibuat untuk membantu pencatatan petani, kebun, dan panen di lapangan. Data dapat disimpan saat koneksi terbatas lalu disinkronkan ketika koneksi tersedia.',
    'sijagung.defaultTitle': 'Dashboard · Data Petani · Data Panen',
    'sijagung.defaultCaption': '“Ringkasan data lapangan, pencatatan petani, dan hasil panen dalam satu alur aplikasi.”',
    'sijagung.screen0.title': 'Dashboard',
    'sijagung.screen0.caption': '“Ringkasan data lapangan dalam satu tampilan.”',
    'sijagung.screen1.title': 'Data Petani',
    'sijagung.screen1.caption': '“Data petani yang dapat dicatat dan diperbarui di lapangan.”',
    'sijagung.screen2.title': 'Data Panen',
    'sijagung.screen2.caption': '“Catatan panen untuk melengkapi data pertanian.”',

    // Packaging
    'kemasan.heading': 'Desain kemasan UMKM',
    'kemasan.desc': 'Tiga desain standing pouch untuk produk makanan UMKM binaan CSR.',
    'kemasan.front': 'Tampak Depan',
    'kemasan.back': 'Tampak Belakang',

    // Experience & Education
    'exp.heading': 'Pengalaman',
    'exp.role': 'Program beasiswa dan magang selama studi.',
    'exp.desc': 'Mengerjakan SIJAGUNG serta materi visual untuk UMKM mitra.',
    'edu.heading': 'Pendidikan',
    'edu.school': 'Politeknik Elektronika Negeri Surabaya',
    'edu.degree': 'D3 Teknik Informatika, A.Md.Kom.',
    'edu.certHeading': 'Sertifikasi:',

    // Tools
    'tools.heading': 'Tools yang saya kuasai',
    'tools.desc': 'Teknologi yang saya gunakan dalam proyek, serta tools yang sedang saya pelajari.',
    'tools.statusActive': 'Digunakan dalam proyek',
    'tools.statusLearning': 'Sedang dipelajari',

    // Contact
    'contact.desc': 'Produk digital<br />dan karya visual.',
    'contact.role': 'Junior Web & Application Developer · Graphic Designer',
    'contact.cvLabel': 'CV — &nbsp;',
    'contact.cvDownload': 'Unduh CV',
    'contact.footerSchool': 'D3 Teknik Informatika, PENS',
  },
  en: {
    // Navigation
    'nav.karya': 'Works',
    'nav.desain': 'Design',
    'nav.profil': 'Profile',
    'nav.kontak': 'Contact',

    // Hero
    'hero.role': 'Junior Web & Application Developer · Graphic Designer',
    'hero.degree': 'D3 Informatics Engineering, PENS',
    'hero.scrollAria': 'Scroll to works',
    'hero.hangingTag': 'STILL CHASING MY DREAM',
    'hero.hangingHint': 'Click & drag to swing',

    // Work Intro
    'workIntro.heading': 'Featured Works',
    'workIntro.desc': 'During my studies, I engineered mobile field applications and crafted packaging designs for local enterprises.',
    'workIntro.sijagungTitle': 'SIJAGUNG',
    'workIntro.sijagungSummary': 'Corn farming field data app for Kelubir Village',
    'workIntro.kemasanTitle': 'MSME Packaging',
    'workIntro.kemasanSummary': 'Standing pouches for local commercial food products',

    // SIJAGUNG
    'sijagung.title': 'SIJAGUNG',
    'sijagung.subtitle': 'Corn farming field monitoring app for Kelubir Village.',
    'sijagung.desc': 'Built to streamline farmer registration, plot tracking, and harvest yields in the field. Functions offline and synchronizes securely once online.',
    'sijagung.defaultTitle': 'Dashboard · Farmer Registry · Harvest Records',
    'sijagung.defaultCaption': '“Comprehensive field summaries, farmer registries, and yield logging in one cohesive workflow.”',
    'sijagung.screen0.title': 'Dashboard',
    'sijagung.screen0.caption': '“Field data overview in a single unified dashboard.”',
    'sijagung.screen1.title': 'Farmer Registry',
    'sijagung.screen1.caption': '“Farmer information recorded and updated directly on-site.”',
    'sijagung.screen2.title': 'Harvest Records',
    'sijagung.screen2.caption': '“Real-time yield logs to complete agricultural reports.”',

    // Packaging
    'kemasan.heading': 'MSME Packaging Design',
    'kemasan.desc': 'Three standing pouch designs for partner food brands under CSR mentorship.',
    'kemasan.front': 'Front View',
    'kemasan.back': 'Back View',

    // Experience & Education
    'exp.heading': 'Experience',
    'exp.role': 'Scholarship recipient & internship during college studies.',
    'exp.desc': 'Engineered SIJAGUNG and produced commercial visual assets for partner enterprises.',
    'edu.heading': 'Education',
    'edu.school': 'Politeknik Elektronika Negeri Surabaya',
    'edu.degree': 'Associate Degree (D3) in Informatics Engineering, A.Md.Kom.',
    'edu.certHeading': 'Certifications:',

    // Tools
    'tools.heading': 'Tools & Technical Stack',
    'tools.desc': 'Technologies I actively utilize in production, alongside tools currently exploring.',
    'tools.statusActive': 'Active in projects',
    'tools.statusLearning': 'Currently exploring',

    // Contact
    'contact.desc': 'Digital products<br />and visual work.',
    'contact.role': 'Junior Web & Application Developer · Graphic Designer',
    'contact.cvLabel': 'Resume — &nbsp;',
    'contact.cvDownload': 'Download CV',
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
