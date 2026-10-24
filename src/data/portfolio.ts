export interface NavItem {
  label: string;
  href: string;
}

export interface FeaturedWorkItem {
  title: string;
  summary: string;
  href: string;
  delayMs: number;
}

export interface SijagungScreenMeta {
  id: number;
  title: string;
  caption: string;
  alt: string;
  positionClass: string;
}

export interface ToolItem {
  id: string;
  name: string;
  status: 'active' | 'learning';
  topColor: string;
  leftColor: string;
  rightColor: string;
  glyph:
    | 'flutter'
    | 'dart'
    | 'laravel'
    | 'php'
    | 'mysql'
    | 'api'
    | 'git'
    | 'github'
    | 'aws'
    | 'docker'
    | 'postgres'
    | 'ts'
    | 'nextjs'
    | 'firebase'
    | 'redis'
    | 'linux'
    | 'cicd'
    | 'kotlin';
}

export const navItems: NavItem[] = [
  { label: 'Karya', href: '#karya' },
  { label: 'Desain', href: '#kemasan' },
  { label: 'Profil', href: '#pengalaman' },
  { label: 'Kontak', href: '#kontak' },
];

export const featuredWorks: FeaturedWorkItem[] = [
  {
    title: 'SIJAGUNG',
    summary: 'Aplikasi data petani jagung untuk Desa Kelubir',
    href: '#sijagung',
    delayMs: 140,
  },
  {
    title: 'Desain kemasan UMKM',
    summary: 'Standing pouch untuk produk makanan',
    href: '#kemasan',
    delayMs: 210,
  },
];

export const sijagungScreens: SijagungScreenMeta[] = [
  {
    id: 0,
    title: 'Dashboard',
    caption: '“Ringkasan data lapangan dalam satu tampilan.”',
    alt: 'Tampilan antarmuka Dashboard SIJAGUNG',
    positionClass: 'phone-fan-center',
  },
  {
    id: 1,
    title: 'Data Petani',
    caption: '“Data petani yang dapat dicatat dan diperbarui di lapangan.”',
    alt: 'Tampilan antarmuka Data Petani SIJAGUNG',
    positionClass: 'phone-fan-left',
  },
  {
    id: 2,
    title: 'Data Panen',
    caption: '“Catatan panen untuk melengkapi data pertanian.”',
    alt: 'Tampilan antarmuka Data Panen SIJAGUNG',
    positionClass: 'phone-fan-right',
  },
];

export const certifications: string[] = [
  'AWS Academy Graduate — Cloud Developing',
  'TOEFL — 483, High Intermediate',
];

export const toolItems: ToolItem[] = [
  {
    id: 'flutter',
    name: 'Flutter',
    status: 'active',
    topColor: '#38bdf8',
    leftColor: '#0284c7',
    rightColor: '#0369a1',
    glyph: 'flutter',
  },
  {
    id: 'dart',
    name: 'Dart',
    status: 'active',
    topColor: '#2dd4bf',
    leftColor: '#0d9488',
    rightColor: '#115e59',
    glyph: 'dart',
  },
  {
    id: 'laravel',
    name: 'Laravel',
    status: 'active',
    topColor: '#f87171',
    leftColor: '#dc2626',
    rightColor: '#991b1b',
    glyph: 'laravel',
  },
  {
    id: 'php',
    name: 'PHP',
    status: 'active',
    topColor: '#818cf8',
    leftColor: '#4f46e5',
    rightColor: '#3730a3',
    glyph: 'php',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    status: 'active',
    topColor: '#fbbf24',
    leftColor: '#d97706',
    rightColor: '#92400e',
    glyph: 'mysql',
  },
  {
    id: 'rest-api',
    name: 'REST API',
    status: 'active',
    topColor: '#34d399',
    leftColor: '#059669',
    rightColor: '#065f46',
    glyph: 'api',
  },
  {
    id: 'git',
    name: 'Git',
    status: 'active',
    topColor: '#fb923c',
    leftColor: '#ea580c',
    rightColor: '#9a3412',
    glyph: 'git',
  },
  {
    id: 'github',
    name: 'GitHub',
    status: 'active',
    topColor: '#52525b',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'github',
  },
  {
    id: 'aws-cloud',
    name: 'AWS Cloud',
    status: 'learning',
    topColor: '#71717a',
    leftColor: '#52525b',
    rightColor: '#3f3f46',
    glyph: 'aws',
  },
  {
    id: 'docker',
    name: 'Docker',
    status: 'learning',
    topColor: '#71717a',
    leftColor: '#52525b',
    rightColor: '#3f3f46',
    glyph: 'docker',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    status: 'learning',
    topColor: '#71717a',
    leftColor: '#52525b',
    rightColor: '#3f3f46',
    glyph: 'postgres',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    status: 'learning',
    topColor: '#71717a',
    leftColor: '#52525b',
    rightColor: '#3f3f46',
    glyph: 'ts',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    status: 'learning',
    topColor: '#71717a',
    leftColor: '#52525b',
    rightColor: '#3f3f46',
    glyph: 'nextjs',
  },
  {
    id: 'firebase',
    name: 'Firebase',
    status: 'learning',
    topColor: '#71717a',
    leftColor: '#52525b',
    rightColor: '#3f3f46',
    glyph: 'firebase',
  },
  {
    id: 'redis',
    name: 'Redis',
    status: 'learning',
    topColor: '#71717a',
    leftColor: '#52525b',
    rightColor: '#3f3f46',
    glyph: 'redis',
  },
  {
    id: 'linux',
    name: 'Linux',
    status: 'learning',
    topColor: '#71717a',
    leftColor: '#52525b',
    rightColor: '#3f3f46',
    glyph: 'linux',
  },
  {
    id: 'cicd',
    name: 'CI/CD',
    status: 'learning',
    topColor: '#71717a',
    leftColor: '#52525b',
    rightColor: '#3f3f46',
    glyph: 'cicd',
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    status: 'learning',
    topColor: '#71717a',
    leftColor: '#52525b',
    rightColor: '#3f3f46',
    glyph: 'kotlin',
  },
];
