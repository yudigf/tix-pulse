import { PrismaClient, UserRole, EventCategory, EventStatus, TicketMode, SeatStatus, OrderStatus, PaymentStatus, TicketStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TixPulse Database Seeding...');

  // 1. Clean existing records in reverse dependency order
  console.log('🧹 Cleaning existing records...');
  await prisma.checkIn.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.attendee.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.eventSession.deleteMany();
  await prisma.event.deleteMany();
  await prisma.organizer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.outboxEvent.deleteMany();
  await prisma.systemHealth.deleteMany();

  // 2. Hash default password
  const defaultPassword = 'Password123!';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // 3. Create Users with All Roles
  console.log('👤 Creating users for all roles...');

  // Role: SUPER_ADMIN
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@tixpulse.com',
      passwordHash,
      fullName: 'Super Administrator TixPulse',
      phoneNumber: '081100000001',
      role: UserRole.SUPER_ADMIN,
      isVerified: true,
    },
  });

  // Role: ORGANIZER 1 (Promoter Konser)
  const organizerUser1 = await prisma.user.create({
    data: {
      email: 'organizer@soundpulse.id',
      passwordHash,
      fullName: 'Bambang Promoter',
      phoneNumber: '081234567891',
      role: UserRole.ORGANIZER,
      isVerified: true,
      organizer: {
        create: {
          name: 'SoundPulse Live Entertainment',
          slug: 'soundpulse-live',
          description: 'Promoter konser musik dan festival internasional ternama di Indonesia.',
          logoUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80',
          website: 'https://soundpulse.id',
          bankName: 'BCA',
          bankAccountNumber: '8801992837',
          bankAccountName: 'PT SoundPulse Indonesia',
          isVerified: true,
        },
      },
    },
    include: { organizer: true },
  });

  // Role: ORGANIZER 2 (Pengelola Alam & Taman Nasional)
  const organizerUser2 = await prisma.user.create({
    data: {
      email: 'ranger@semeru.id',
      passwordHash,
      fullName: 'Agus Ranger TNBTS',
      phoneNumber: '081234567892',
      role: UserRole.ORGANIZER,
      isVerified: true,
      organizer: {
        create: {
          name: 'Balai Besar Taman Nasional Bromo Tengger Semeru',
          slug: 'tn-semeru-official',
          description: 'Otoritas resmi pengelola kuota simaksi dan perizinan pendakian Gunung Semeru.',
          logoUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&q=80',
          website: 'https://bromotenggersemeru.org',
          bankName: 'BRI',
          bankAccountNumber: '0012983746551',
          bankAccountName: 'Bendahara Penerimaan TNBTS',
          isVerified: true,
        },
      },
    },
    include: { organizer: true },
  });

  // Role: STAFF (Gate Officer)
  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@tixpulse.com',
      passwordHash,
      fullName: 'Siti Staff Gate 1',
      phoneNumber: '081100000003',
      role: UserRole.STAFF,
      isVerified: true,
    },
  });

  // Role: BUYER (Pembeli Tiket)
  const buyerUser = await prisma.user.create({
    data: {
      email: 'buyer@gmail.com',
      passwordHash,
      fullName: 'Dimas Pembeli Santoso',
      phoneNumber: '081234567890',
      role: UserRole.BUYER,
      isVerified: true,
    },
  });

  // Second Buyer for concurrency simulation
  const buyerUser2 = await prisma.user.create({
    data: {
      email: 'anisa@gmail.com',
      passwordHash,
      fullName: 'Anisa War Tiket',
      phoneNumber: '081987654321',
      role: UserRole.BUYER,
      isVerified: true,
    },
  });

  console.log('🎪 Creating Events, Sessions, and Inventory...');

  // ========================================================
  // EVENT 1: Konser Musik (Reserved Seating - Pilih Kursi)
  // ========================================================
  const concertEvent = await prisma.event.create({
    data: {
      organizerId: organizerUser1.organizer!.id,
      title: 'SoundPulse Music Fest 2026',
      slug: 'soundpulse-music-fest-2026',
      description: 'Festival musik multi-genre terbesar tahun ini menghadirkan 25+ musisi nasional dan internasional dengan tata panggung spektakuler.',
      category: EventCategory.CONCERT,
      status: EventStatus.PUBLISHED,
      bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      venueName: 'Gelora Bung Karno Stadium',
      venueAddress: 'Jl. Pintu Satu Senayan, Gelora, Kecamatan Tanah Abang',
      city: 'Jakarta',
      termsAndConditions: 'Dilarang membawa senjata tajam, kamera profesional, dan obat-obatan terlarang. Wajib scan e-ticket di pintu masuk.',
      ticketMode: TicketMode.RESERVED_SEATING,
      sessions: {
        create: [
          {
            title: 'Hari 1 - 28 Nov 2026 (16:00 - 23:00)',
            startTime: new Date('2026-11-28T16:00:00Z'),
            endTime: new Date('2026-11-28T23:00:00Z'),
            ticketTypes: {
              create: [
                {
                  name: 'VIP Tribune Seated',
                  description: 'Tempat duduk bernomor di tribun tengah menghadap panggung utama + free merchandise pack.',
                  price: 850000,
                  quota: 20,
                  soldCount: 3,
                  maxPerOrder: 4,
                  saleStart: new Date('2026-11-01T00:00:00Z'),
                  saleEnd: new Date('2026-11-28T12:00:00Z'),
                },
                {
                  name: 'Festival Standing',
                  description: 'Area berdiri bebas persis di depan panggung.',
                  price: 350000,
                  quota: 500,
                  soldCount: 150,
                  maxPerOrder: 5,
                  saleStart: new Date('2026-11-01T00:00:00Z'),
                  saleEnd: new Date('2026-11-28T12:00:00Z'),
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      sessions: {
        include: {
          ticketTypes: true,
        },
      },
    },
  });

  const concertSession = concertEvent.sessions[0];
  const vipTicketType = concertSession.ticketTypes.find((t) => t.name === 'VIP Tribune Seated')!;

  // Generate Seats for VIP Tribune (Row A and Row B)
  console.log('💺 Generating seat inventory...');
  const seatCodes = [
    { code: 'VIP-A1', row: 'A', col: 1, status: SeatStatus.AVAILABLE },
    { code: 'VIP-A2', row: 'A', col: 2, status: SeatStatus.AVAILABLE },
    { code: 'VIP-A3', row: 'A', col: 3, status: SeatStatus.SOLD }, // Will be attached to Dimas's order
    { code: 'VIP-A4', row: 'A', col: 4, status: SeatStatus.AVAILABLE },
    { code: 'VIP-A5', row: 'A', col: 5, status: SeatStatus.AVAILABLE },
    { code: 'VIP-B1', row: 'B', col: 1, status: SeatStatus.AVAILABLE },
    { code: 'VIP-B2', row: 'B', col: 2, status: SeatStatus.SOLD },
    { code: 'VIP-B3', row: 'B', col: 3, status: SeatStatus.AVAILABLE },
    { code: 'VIP-B4', row: 'B', col: 4, status: SeatStatus.AVAILABLE },
    { code: 'VIP-B5', row: 'B', col: 5, status: SeatStatus.LOCKED },
  ];

  const createdSeats = await Promise.all(
    seatCodes.map((s) =>
      prisma.seat.create({
        data: {
          sessionId: concertSession.id,
          ticketTypeId: vipTicketType.id,
          seatCode: s.code,
          row: s.row,
          col: s.col,
          status: s.status,
          ...(s.status === SeatStatus.LOCKED && {
            lockedByUserId: buyerUser2.id,
            lockedUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 mins lock
          }),
        },
      }),
    ),
  );

  const soldSeatA3 = createdSeats.find((s) => s.seatCode === 'VIP-A3')!;

  // ========================================================
  // EVENT 2: Wisata & Pendakian (General Admission - Kuota)
  // ========================================================
  await prisma.event.create({
    data: {
      organizerId: organizerUser2.organizer!.id,
      title: 'Tiket Simaksi Pendakian Semeru & Ranu Kumbolo',
      slug: 'simaksi-pendakian-semeru-2026',
      description: 'Izin masuk resmi (Simaksi) pendakian Gunung Semeru via Ranupani. Kuota terbatas 400 pendaki/hari untuk menjaga kelestarian alam dan keselamatan pendaki.',
      category: EventCategory.OUTDOOR,
      status: EventStatus.PUBLISHED,
      bannerUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      venueName: 'Pos Registrasi Ranupani, TNBTS',
      venueAddress: 'Desa Ranupani, Kecamatan Senduro',
      city: 'Lumajang / Malang',
      termsAndConditions: 'Wajib membawa surat keterangan sehat asli dari dokter, KTP asli, dan perlengkapan standar pendakian. Wajib briefing di pos.',
      ticketMode: TicketMode.GENERAL_ADMISSION,
      sessions: {
        create: [
          {
            title: 'Jadwal Masuk: 1 Desember 2026',
            startTime: new Date('2026-12-01T07:00:00Z'),
            endTime: new Date('2026-12-01T16:00:00Z'),
            ticketTypes: {
              create: [
                {
                  name: 'Tiket Pendaki WNI (Weekday)',
                  description: 'Termasuk tiket masuk kawasan TNBTS, asuransi keselamatan jiwa, dan izin mendirikan tenda 2H1M di Ranu Kumbolo / Kalimati.',
                  price: 45000,
                  quota: 400,
                  soldCount: 185,
                  maxPerOrder: 5,
                  saleStart: new Date('2026-11-01T00:00:00Z'),
                  saleEnd: new Date('2026-11-30T23:59:59Z'),
                },
                {
                  name: 'Tiket Pendaki WNA (International)',
                  description: 'Foreign national climbing permit with conservation fee and search-and-rescue coverage.',
                  price: 215000,
                  quota: 100,
                  soldCount: 22,
                  maxPerOrder: 4,
                  saleStart: new Date('2026-11-01T00:00:00Z'),
                  saleEnd: new Date('2026-11-30T23:59:59Z'),
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ========================================================
  // SAMPLE COMPLETED TRANSACTION (Order -> Payment -> Ticket)
  // ========================================================
  console.log('💳 Creating sample completed order, payment, and issued e-ticket...');

  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'TXP-20261117-0001',
      userId: buyerUser.id,
      eventId: concertEvent.id,
      status: OrderStatus.PAID,
      totalAmount: 855000, // 850k + 5k fee
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      paidAt: new Date(),
      items: {
        create: [
          {
            ticketTypeId: vipTicketType.id,
            seatId: soldSeatA3.id,
            price: 850000,
            attendee: {
              create: {
                fullName: 'Dimas Pembeli Santoso',
                email: 'buyer@gmail.com',
                phoneNumber: '081234567890',
                identityNumber: '3271012304950001',
              },
            },
          },
        ],
      },
    },
    include: {
      items: true,
    },
  });

  const orderItem = sampleOrder.items[0];

  // Payment Record
  await prisma.payment.create({
    data: {
      orderId: sampleOrder.id,
      provider: 'MIDTRANS',
      paymentType: 'QRIS',
      transactionId: 'TRX-MDT-20261117-994821',
      amount: 855000,
      status: PaymentStatus.SUCCESS,
      idempotencyKey: 'IDEMP-TXP-ORDER-0001',
    },
  });

  // Issued E-Ticket with Cryptographic QR Payload
  const issuedTicket = await prisma.ticket.create({
    data: {
      ticketCode: 'TXP-TK-89A7B2C',
      orderItemId: orderItem.id,
      qrPayload: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ticket_TXP_TK_89A7B2C_verified`,
      status: TicketStatus.VALID,
      pdfUrl: 'https://storage.tixpulse.com/tickets/TXP-TK-89A7B2C.pdf',
    },
  });

  // System Health sanity record
  await prisma.systemHealth.create({
    data: {
      status: 'DATABASE_ONLINE_AND_SEEDED',
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
