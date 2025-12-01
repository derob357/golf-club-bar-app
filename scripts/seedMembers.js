const admin = require('firebase-admin');
const serviceAccount = require('../docs/serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const testMembers = [
  {
    memberId: '5001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '555-0101',
    membershipType: 'Gold',
    status: 'active',
    joinDate: new Date('2023-01-15'),
    balance: 0,
  },
  {
    memberId: '5002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '555-0102',
    membershipType: 'Platinum',
    status: 'active',
    joinDate: new Date('2023-02-20'),
    balance: 0,
  },
  {
    memberId: '5003',
    firstName: 'Michael',
    lastName: 'Williams',
    email: 'michael.williams@example.com',
    phone: '555-0103',
    membershipType: 'Silver',
    status: 'active',
    joinDate: new Date('2023-03-10'),
    balance: 0,
  },
  {
    memberId: '5004',
    firstName: 'Emily',
    lastName: 'Brown',
    email: 'emily.brown@example.com',
    phone: '555-0104',
    membershipType: 'Gold',
    status: 'active',
    joinDate: new Date('2023-04-05'),
    balance: 0,
  },
  {
    memberId: '5005',
    firstName: 'David',
    lastName: 'Davis',
    email: 'david.davis@example.com',
    phone: '555-0105',
    membershipType: 'Platinum',
    status: 'active',
    joinDate: new Date('2023-05-12'),
    balance: 0,
  },
  {
    memberId: '5006',
    firstName: 'Jennifer',
    lastName: 'Miller',
    email: 'jennifer.miller@example.com',
    phone: '555-0106',
    membershipType: 'Gold',
    status: 'active',
    joinDate: new Date('2023-06-18'),
    balance: 0,
  },
  {
    memberId: '5007',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'robert.wilson@example.com',
    phone: '555-0107',
    membershipType: 'Silver',
    status: 'active',
    joinDate: new Date('2023-07-22'),
    balance: 0,
  },
  {
    memberId: '5008',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@example.com',
    phone: '555-0108',
    membershipType: 'Platinum',
    status: 'active',
    joinDate: new Date('2023-08-30'),
    balance: 0,
  },
  {
    memberId: '5009',
    firstName: 'James',
    lastName: 'Taylor',
    email: 'james.taylor@example.com',
    phone: '555-0109',
    membershipType: 'Gold',
    status: 'active',
    joinDate: new Date('2023-09-14'),
    balance: 0,
  },
  {
    memberId: '5010',
    firstName: 'Mary',
    lastName: 'Thomas',
    email: 'mary.thomas@example.com',
    phone: '555-0110',
    membershipType: 'Silver',
    status: 'active',
    joinDate: new Date('2023-10-08'),
    balance: 0,
  },
];

async function seedMembers() {
  console.log('Starting to seed members...');

  const batch = db.batch();

  testMembers.forEach((member) => {
    const docRef = db.collection('members').doc();
    batch.set(docRef, {
      ...member,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  try {
    await batch.commit();
    console.log(`Successfully added ${testMembers.length} test members!`);
    console.log('\nTest Member IDs to try:');
    testMembers.forEach((member) => {
      console.log(`  ${member.memberId} - ${member.firstName} ${member.lastName} (${member.membershipType})`);
    });
  } catch (error) {
    console.error('Error seeding members:', error);
  }

  process.exit(0);
}

seedMembers();
