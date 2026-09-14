import { PrismaClient, UserRole, UrgencyLevel, RoomStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting StayFix database seed...');

  // 1. Seed Categories with standard hotel SLAs (Target time to fix)
  const categories = [
    { name: 'Plumbing', description: 'Leaks, clogged drains, shower issues', defaultUrgency: UrgencyLevel.HIGH, targetSlaMinutes: 60 },
    { name: 'HVAC & Climate', description: 'AC, heating, and ventilation faults', defaultUrgency: UrgencyLevel.HIGH, targetSlaMinutes: 90 },
    { name: 'Electrical', description: 'Power outlets, lighting, circuit breakers', defaultUrgency: UrgencyLevel.MEDIUM, targetSlaMinutes: 120 },
    { name: 'Housekeeping', description: 'Towels, beddings, extra amenities', defaultUrgency: UrgencyLevel.MEDIUM, targetSlaMinutes: 45 },
    { name: 'Electronics & TV', description: 'Smart TV, remotes, Wi-Fi access', defaultUrgency: UrgencyLevel.LOW, targetSlaMinutes: 240 },
  ];

  for (const cat of categories) {
    // "upsert" means: If it already exists, do nothing. If it does not exist, create it!
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Maintenance categories seeded.');

  // 2. Seed Sample Hotel Rooms
  const sampleRooms = [
    { roomNumber: '101', floor: 1, building: 'West Wing', status: RoomStatus.OCCUPIED, qrSlug: 'room-101-slug' },
    { roomNumber: '102', floor: 1, building: 'West Wing', status: RoomStatus.OCCUPIED, qrSlug: 'room-102-slug' },
    { roomNumber: '201', floor: 2, building: 'West Wing', status: RoomStatus.VACANT_CLEAN, qrSlug: 'room-201-slug' },
    { roomNumber: '301', floor: 3, building: 'Tower Suite', status: RoomStatus.OCCUPIED, qrSlug: 'room-301-slug' },
  ];

  for (const rm of sampleRooms) {
    await prisma.room.upsert({
      where: { roomNumber: rm.roomNumber },
      update: {},
      create: rm,
    });
  }
  console.log('✅ Hotel rooms seeded.');

  // 3. Seed Default Admin & Staff Accounts
  // We NEVER store raw passwords in a database! We hash it first with bcrypt.
  const passwordHash = await bcrypt.hash('StayFixPass2026!', 10);

  // Admin account
  await prisma.user.upsert({
    where: { email: 'admin@stayfix.hotel' },
    update: {},
    create: {
      email: 'admin@stayfix.hotel',
      fullName: 'Operations Manager',
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  // Maintenance technician account
  await prisma.user.upsert({
    where: { email: 'tech1@stayfix.hotel' },
    update: {},
    create: {
      email: 'tech1@stayfix.hotel',
      fullName: 'John Technician',
      passwordHash,
      role: UserRole.STAFF,
      isActive: true,
    },
  });

  console.log('✅ Admin and Staff accounts seeded.');
  console.log('🚀 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });