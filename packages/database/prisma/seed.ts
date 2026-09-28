import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data (for development)
  await db.auditLog.deleteMany();
  await db.studentRequest.deleteMany();
  await db.notification.deleteMany();
  await db.routerEvent.deleteMany();
  await db.routerCommand.deleteMany();
  await db.routerEnrollmentToken.deleteMany();
  await db.guestSession.deleteMany();
  await db.guestDevice.deleteMany();
  await db.guestUser.deleteMany();
  await db.internetSession.deleteMany();
  await db.studentDevice.deleteMany();
  await db.router.deleteMany();
  await db.attendance.deleteMany();
  await db.cashClosing.deleteMany();
  await db.receipt.deleteMany();
  await db.concession.deleteMany();
  await db.paymentAllocation.deleteMany();
  await db.payment.deleteMany();
  await db.feeLedgerEntry.deleteMany();
  await db.feeCycle.deleteMany();
  await db.seatAssignment.deleteMany();
  await db.seat.deleteMany();
  await db.section.deleteMany();
  await db.block.deleteMany();
  await db.admission.deleteMany();
  await db.shift.deleteMany();
  await db.plan.deleteMany();
  await db.student.deleteMany();
  await db.authSession.deleteMany();
  await db.user.deleteMany();
  await db.otpChallenge.deleteMany();
  await db.librarySetting.deleteMany();
  await db.library.deleteMany();
  await db.organization.deleteMany();

  // Create organization
  const org = await db.organization.create({
    data: {
      name: 'Study Library Network',
    },
  });
  console.log('✓ Organization created:', org.name);

  // Create library
  const library = await db.library.create({
    data: {
      name: 'ABC Library',
      organizationId: org.id,
      city: 'Delhi',
      timezone: 'Asia/Kolkata',
      capacity: 80,
    },
  });
  console.log('✓ Library created:', library.name);

  // Create owner user
  const ownerPassword = await hash('owner@123', 10);
  const owner = await db.user.create({
    data: {
      email: 'owner@library.com',
      phone: '9876543210',
      name: 'Library Owner',
      role: 'OWNER',
      password: ownerPassword,
      libraryId: library.id,
    },
  });
  console.log('✓ Owner user created:', owner.email);

  // Create manager user
  const managerPassword = await hash('manager@123', 10);
  const manager = await db.user.create({
    data: {
      email: 'manager@library.com',
      phone: '9876543211',
      name: 'Library Manager',
      role: 'MANAGER',
      password: managerPassword,
      libraryId: library.id,
    },
  });
  console.log('✓ Manager user created:', manager.email);

  // Create receptionist user
  const receptionistPassword = await hash('receptionist@123', 10);
  const receptionist = await db.user.create({
    data: {
      email: 'receptionist@library.com',
      phone: '9876543212',
      name: 'Receptionist',
      role: 'RECEPTIONIST',
      password: receptionistPassword,
      libraryId: library.id,
    },
  });
  console.log('✓ Receptionist user created:', receptionist.email);

  // Create accountant user
  const accountantPassword = await hash('accountant@123', 10);
  const accountant = await db.user.create({
    data: {
      email: 'accountant@library.com',
      phone: '9876543213',
      name: 'Accountant',
      role: 'ACCOUNTANT',
      password: accountantPassword,
      libraryId: library.id,
    },
  });
  console.log('✓ Accountant user created:', accountant.email);

  // Create shifts
  const morningShift = await db.shift.create({
    data: {
      name: 'Morning',
      startMinutes: 6 * 60 + 30, // 06:30
      endMinutes: 12 * 60, // 12:00
      libraryId: library.id,
    },
  });

  const eveningShift = await db.shift.create({
    data: {
      name: 'Evening',
      startMinutes: 12 * 60, // 12:00
      endMinutes: 18 * 60, // 18:00
      libraryId: library.id,
    },
  });

  const fullDayShift = await db.shift.create({
    data: {
      name: 'Full Day',
      startMinutes: 6 * 60 + 30, // 06:30
      endMinutes: 18 * 60, // 18:00
      libraryId: library.id,
    },
  });
  console.log('✓ Shifts created:', morningShift.name, eveningShift.name, fullDayShift.name);

  // Create plans
  const monthlyPlan = await db.plan.create({
    data: {
      name: 'Monthly',
      amount: '550.00',
      duration: 30,
      libraryId: library.id,
    },
  });

  const threeMonthPlan = await db.plan.create({
    data: {
      name: '3 Months',
      amount: '1500.00',
      duration: 90,
      libraryId: library.id,
    },
  });

  const sixMonthPlan = await db.plan.create({
    data: {
      name: '6 Months',
      amount: '2800.00',
      duration: 180,
      libraryId: library.id,
    },
  });
  console.log('✓ Plans created:', monthlyPlan.name, threeMonthPlan.name, sixMonthPlan.name);

  // Create blocks
  const blockA = await db.block.create({
    data: {
      name: 'Block A',
      libraryId: library.id,
    },
  });

  const blockB = await db.block.create({
    data: {
      name: 'Block B',
      libraryId: library.id,
    },
  });
  console.log('✓ Blocks created:', blockA.name, blockB.name);

  // Create sections
  const sectionA1 = await db.section.create({
    data: {
      name: 'Section A1',
      libraryId: library.id,
      blockId: blockA.id,
    },
  });

  const sectionB1 = await db.section.create({
    data: {
      name: 'Section B1',
      libraryId: library.id,
      blockId: blockB.id,
    },
  });
  console.log('✓ Sections created');

  // Create seats
  const seats = [];
  // Block A: A01 - A40
  for (let i = 1; i <= 40; i++) {
    const seat = await db.seat.create({
      data: {
        code: `A${String(i).padStart(2, '0')}`,
        libraryId: library.id,
        sectionId: sectionA1.id,
      },
    });
    seats.push(seat);
  }

  // Block B: B01 - B40
  for (let i = 1; i <= 40; i++) {
    const seat = await db.seat.create({
      data: {
        code: `B${String(i).padStart(2, '0')}`,
        libraryId: library.id,
        sectionId: sectionB1.id,
      },
    });
    seats.push(seat);
  }
  console.log(`✓ ${seats.length} seats created (A01-A40, B01-B40)`);

  // Create sample students
  const students = [];
  const studentNames = [
    'Rahul Sharma',
    'Priya Singh',
    'Amit Kumar',
    'Neha Patel',
    'Vikram Reddy',
  ];
  const studentPhones = [
    '9876543214',
    '9876543215',
    '9876543216',
    '9876543217',
    '9876543218',
  ];

  for (let i = 0; i < studentNames.length; i++) {
    const student = await db.student.create({
      data: {
        code: `LIB${String(i + 1).padStart(3, '0')}`,
        name: studentNames[i],
        mobile: studentPhones[i],
        libraryId: library.id,
        course: 'Engineering',
      },
    });
    students.push(student);
  }
  console.log(`✓ ${students.length} sample students created`);

  // Create admissions for first 3 students
  for (let i = 0; i < 3; i++) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const admission = await db.admission.create({
      data: {
        studentId: students[i].id,
        planId: monthlyPlan.id,
        shiftId: i % 2 === 0 ? morningShift.id : eveningShift.id,
        libraryId: library.id,
        status: 'ACTIVE',
        startDate,
        endDate,
      },
    });

    // Assign seat
    await db.seatAssignment.create({
      data: {
        studentId: students[i].id,
        admissionId: admission.id,
        seatId: seats[i].id,
        libraryId: library.id,
        startTime: new Date(),
        assignedBy: receptionist.id,
      },
    });

    // Create fee cycle
    await db.feeCycle.create({
      data: {
        admissionId: admission.id,
        libraryId: library.id,
        startDate: new Date(),
        endDate,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        charge: '550.00',
        status: 'OPEN',
      },
    });

    console.log(`✓ Admission created for ${students[i].name}`);
  }

  // Create router
  const router = await db.router.create({
    data: {
      name: 'Main Router',
      model: 'Airtel AAP4221ZY',
      libraryId: library.id,
      status: 'ONLINE',
    },
  });
  console.log('✓ Router created:', router.name);

  // Create library settings
  await db.librarySetting.create({
    data: {
      libraryId: library.id,
      key: 'OTP_EXPIRY_MINUTES',
      value: '5',
    },
  });

  await db.librarySetting.create({
    data: {
      libraryId: library.id,
      key: 'INTERNET_DUE_BLOCK_DAYS',
      value: '3',
    },
  });

  await db.librarySetting.create({
    data: {
      libraryId: library.id,
      key: 'DEFAULT_DEVICE_LIMIT',
      value: '2',
    },
  });
  console.log('✓ Library settings created');

  console.log('\n✅ Database seeding completed!');
  console.log('\n📝 Default credentials:');
  console.log('  Owner: owner@library.com / owner@123');
  console.log('  Manager: manager@library.com / manager@123');
  console.log('  Receptionist: receptionist@library.com / receptionist@123');
  console.log('  Accountant: accountant@library.com / accountant@123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
