export interface EventItem {
  id: string;
  slug: string;
  title: string;
  category: 'CONCERT' | 'SEMINAR' | 'SPORTS' | 'FESTIVAL' | 'OUTDOOR' | 'THEATER';
  description: string;
  bannerUrl: string;
  venueName: string;
  city: string;
  dateString: string;
  priceStart: number;
  organizer: {
    name: string;
    verified: boolean;
  };
  ticketMode: 'GENERAL_ADMISSION' | 'RESERVED_SEATING';
  sessions: Array<{
    id: string;
    title: string;
    startTime: string;
    ticketTypes: Array<{
      id: string;
      name: string;
      price: number;
      quota: number;
      soldCount: number;
      description: string;
    }>;
  }>;
}

export const SAMPLE_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    slug: 'soundpulse-music-fest-2026',
    title: 'SoundPulse Music Fest 2026',
    category: 'CONCERT',
    description: 'Festival musik multi-genre terbesar tahun ini menghadirkan 25+ musisi nasional dan internasional. Rasakan pengalaman tata panggung kelas dunia dengan visual mapping dan sound system mutakhir.',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    venueName: 'Gelora Bung Karno Stadium',
    city: 'Jakarta',
    dateString: '28 - 29 November 2026',
    priceStart: 350000,
    organizer: {
      name: 'SoundPulse Live Entertainment',
      verified: true,
    },
    ticketMode: 'RESERVED_SEATING',
    sessions: [
      {
        id: 'sess-1',
        title: 'Hari 1 - 28 Nov 2026 (16:00 - 23:00)',
        startTime: '2026-11-28T16:00:00Z',
        ticketTypes: [
          {
            id: 'tix-1',
            name: 'Festival Standing (Early Bird)',
            price: 350000,
            quota: 1000,
            soldCount: 850,
            description: 'Akses area festival depan panggung. Berdiri.',
          },
          {
            id: 'tix-2',
            name: 'VIP Tribune Seated',
            price: 850000,
            quota: 500,
            soldCount: 320,
            description: 'Tempat duduk bernomor di tribun tengah + free merchandise pack.',
          },
          {
            id: 'tix-3',
            name: 'VVIP Diamond Lounge',
            price: 1750000,
            quota: 100,
            soldCount: 75,
            description: 'Akses lounge ber-AC, all you can eat buffet, fast track gate.',
          },
        ],
      },
      {
        id: 'sess-2',
        title: 'Hari 2 - 29 Nov 2026 (16:00 - 23:00)',
        startTime: '2026-11-29T16:00:00Z',
        ticketTypes: [
          {
            id: 'tix-4',
            name: 'Festival Standing (Presale)',
            price: 450000,
            quota: 1200,
            soldCount: 400,
            description: 'Akses area festival depan panggung.',
          },
          {
            id: 'tix-5',
            name: 'VIP Tribune Seated',
            price: 850000,
            quota: 500,
            soldCount: 200,
            description: 'Tempat duduk bernomor di tribun tengah.',
          },
        ],
      },
    ],
  },
  {
    id: 'evt-2',
    slug: 'semeru-national-park-trail-pass',
    title: 'Tiket Simaksi Pendakian Semeru & Ranu Kumbolo',
    category: 'OUTDOOR',
    description: 'Kuota tiket resmi pendakian Taman Nasional Bromo Tengger Semeru. Wajib mengisi data identitas peserta (NIK/Paspor) dan kontak darurat untuk keperluan asuransi dan briefing ranger basecamp.',
    bannerUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    venueName: 'Basecamp Ranupani, TNBTS',
    city: 'Lumajang / Malang',
    dateString: '1 - 10 Desember 2026',
    priceStart: 45000,
    organizer: {
      name: 'Balai Besar TNBTS',
      verified: true,
    },
    ticketMode: 'GENERAL_ADMISSION',
    sessions: [
      {
        id: 'sess-semeru-1',
        title: 'Jadwal Masuk: 1 Desember 2026',
        startTime: '2026-12-01T07:00:00Z',
        ticketTypes: [
          {
            id: 'tix-semeru-wni',
            name: 'Tiket Pendaki WNI (Weekday)',
            price: 45000,
            quota: 400,
            soldCount: 280,
            description: 'Termasuk tiket masuk kawasan, asuransi keselamatan, dan izin camping 2H1M.',
          },
          {
            id: 'tix-semeru-wna',
            name: 'Tiket Pendaki WNA (International)',
            price: 215000,
            quota: 100,
            soldCount: 25,
            description: 'Foreign climber permit with conservation pass & search-and-rescue fee.',
          },
        ],
      },
    ],
  },
  {
    id: 'evt-3',
    slug: 'indonesia-tech-ai-summit-2026',
    title: 'Indonesia Tech & AI Summit 2026',
    category: 'SEMINAR',
    description: 'Konferensi teknologi & kecerdasan buatan terbesar di Asia Tenggara. Menghadirkan 50+ pembicara dari unicorn global, sesi workshop interaktif, dan tech expo.',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    venueName: 'ICE BSD City Hall 1-3',
    city: 'Tangerang',
    dateString: '15 Desember 2026',
    priceStart: 250000,
    organizer: {
      name: 'TechInAsia Hub',
      verified: true,
    },
    ticketMode: 'GENERAL_ADMISSION',
    sessions: [
      {
        id: 'sess-tech-1',
        title: 'All-Day Pass (09:00 - 18:00)',
        startTime: '2026-12-15T09:00:00Z',
        ticketTypes: [
          {
            id: 'tix-tech-std',
            name: 'Standard Delegate Pass',
            price: 250000,
            quota: 1500,
            soldCount: 920,
            description: 'Akses ke semua keynote stage, exhibition hall, dan coffee break.',
          },
          {
            id: 'tix-tech-vip',
            name: 'Executive Networking Pass',
            price: 1200000,
            quota: 250,
            soldCount: 190,
            description: 'Akses VIP lounge, private dinner bareng C-level speakers, dan slide rekaman.',
          },
        ],
      },
    ],
  },
  {
    id: 'evt-4',
    slug: 'jakarta-badminton-open-2026',
    title: 'Jakarta Open Badminton Championship 2026',
    category: 'SPORTS',
    description: 'Kejuaraan bulutangkis prestisius tingkat nasional. Saksikan pertandingan sengit para atlet elit di Istora Senayan dari tribun VIP maupun reguler.',
    bannerUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    venueName: 'Istora Gelora Bung Karno',
    city: 'Jakarta',
    dateString: '20 - 22 Desember 2026',
    priceStart: 125000,
    organizer: {
      name: 'PBSI Jakarta Sports',
      verified: true,
    },
    ticketMode: 'RESERVED_SEATING',
    sessions: [
      {
        id: 'sess-badminton-final',
        title: 'Babak Semifinal & Final (22 Des 2026)',
        startTime: '2026-12-22T13:00:00Z',
        ticketTypes: [
          {
            id: 'tix-bad-cat2',
            name: 'Kategori 2 (Tribun Atas)',
            price: 125000,
            quota: 800,
            soldCount: 650,
            description: 'Tempat duduk tribun lantai 2 dengan sudut pandang lapangan menyeluruh.',
          },
          {
            id: 'tix-bad-cat1',
            name: 'Kategori 1 (Tribun Bawah)',
            price: 275000,
            quota: 600,
            soldCount: 510,
            description: 'Tempat duduk tribun dekat garis lapangan.',
          },
          {
            id: 'tix-bad-vip',
            name: 'VIP Courtside',
            price: 650000,
            quota: 150,
            soldCount: 140,
            description: 'Baris paling depan persis di samping lapangan pemain.',
          },
        ],
      },
    ],
  },
];

