// SwiftGym Database Setup Script
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBXoI3Cf1CijODsbppbjjQzUdx-yBX9ujU",
  authDomain: "swiftgym-6d5ca.firebaseapp.com",
  projectId: "swiftgym-6d5ca",
  storageBucket: "swiftgym-6d5ca.firebasestorage.app",
  messagingSenderId: "815902613445",
  appId: "1:815902613445:web:0ee784af1b43c6bab775ac",
  measurementId: "G-WWVG0SW4LV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Equipment data
const equipmentData = [
  // Cardio (12 total, 8 available)
  { name: 'Treadmill 1', category: 'Cardio', isAvailable: true },
  { name: 'Treadmill 2', category: 'Cardio', isAvailable: true },
  { name: 'Treadmill 3', category: 'Cardio', isAvailable: false, currentUserId: 'user456' },
  { name: 'Treadmill 4', category: 'Cardio', isAvailable: true },
  { name: 'Elliptical 1', category: 'Cardio', isAvailable: true },
  { name: 'Elliptical 2', category: 'Cardio', isAvailable: false, currentUserId: 'user789' },
  { name: 'Elliptical 3', category: 'Cardio', isAvailable: true },
  { name: 'Stationary Bike 1', category: 'Cardio', isAvailable: true },
  { name: 'Stationary Bike 2', category: 'Cardio', isAvailable: true },
  { name: 'Stationary Bike 3', category: 'Cardio', isAvailable: false, currentUserId: 'user111' },
  { name: 'Rowing Machine 1', category: 'Cardio', isAvailable: true },
  { name: 'Rowing Machine 2', category: 'Cardio', isAvailable: false, currentUserId: 'user999' },

  // Strength (20 total, 15 available)
  { name: 'Bench Press 1', category: 'Strength', isAvailable: true },
  { name: 'Bench Press 2', category: 'Strength', isAvailable: true },
  { name: 'Bench Press 3', category: 'Strength', isAvailable: false, currentUserId: 'user222' },
  { name: 'Squat Rack 1', category: 'Strength', isAvailable: true },
  { name: 'Squat Rack 2', category: 'Strength', isAvailable: true },
  { name: 'Squat Rack 3', category: 'Strength', isAvailable: true },
  { name: 'Lat Pulldown 1', category: 'Strength', isAvailable: true },
  { name: 'Lat Pulldown 2', category: 'Strength', isAvailable: false, currentUserId: 'user333' },
  { name: 'Cable Machine 1', category: 'Strength', isAvailable: true },
  { name: 'Cable Machine 2', category: 'Strength', isAvailable: true },
  { name: 'Cable Machine 3', category: 'Strength', isAvailable: true },
  { name: 'Leg Press 1', category: 'Strength', isAvailable: true },
  { name: 'Leg Press 2', category: 'Strength', isAvailable: true },
  { name: 'Smith Machine 1', category: 'Strength', isAvailable: true },
  { name: 'Smith Machine 2', category: 'Strength', isAvailable: true },
  { name: 'Shoulder Press 1', category: 'Strength', isAvailable: true },
  { name: 'Shoulder Press 2', category: 'Strength', isAvailable: false, currentUserId: 'user888' },
  { name: 'Chest Fly Machine', category: 'Strength', isAvailable: true },
  { name: 'Leg Curl Machine', category: 'Strength', isAvailable: false, currentUserId: 'user777' },
  { name: 'Leg Extension Machine', category: 'Strength', isAvailable: false, currentUserId: 'user666' },

  // Free Weights (10 total, 6 available)
  { name: 'Dumbbells 5-50lbs', category: 'Free Weights', isAvailable: true },
  { name: 'Dumbbells 55-100lbs', category: 'Free Weights', isAvailable: true },
  { name: 'Barbell Station 1', category: 'Free Weights', isAvailable: true },
  { name: 'Barbell Station 2', category: 'Free Weights', isAvailable: false, currentUserId: 'user444' },
  { name: 'Kettlebell Set 1', category: 'Free Weights', isAvailable: true },
  { name: 'Kettlebell Set 2', category: 'Free Weights', isAvailable: true },
  { name: 'Olympic Plates Area 1', category: 'Free Weights', isAvailable: true },
  { name: 'Olympic Plates Area 2', category: 'Free Weights', isAvailable: false, currentUserId: 'user555' },
  { name: 'EZ Curl Bar Station', category: 'Free Weights', isAvailable: false, currentUserId: 'user321' },
  { name: 'Cable Crossover', category: 'Free Weights', isAvailable: false, currentUserId: 'user654' },

  // Functional (6 total, 4 available)
  { name: 'TRX Station 1', category: 'Functional', isAvailable: true },
  { name: 'TRX Station 2', category: 'Functional', isAvailable: true },
  { name: 'Battle Ropes', category: 'Functional', isAvailable: true },
  { name: 'Agility Ladder Area', category: 'Functional', isAvailable: true },
  { name: 'Medicine Ball Area', category: 'Functional', isAvailable: false, currentUserId: 'user101' },
  { name: 'Plyometric Box Area', category: 'Functional', isAvailable: false, currentUserId: 'user202' }
];

async function setupDatabase() {
  try {
    console.log('🔥 Setting up SwiftGym database...');

    // Add equipment
    console.log('📋 Adding gym equipment...');
    const equipmentIds = {};
    
    for (const equipment of equipmentData) {
      const docRef = await addDoc(collection(db, 'equipment'), {
        ...equipment,
        lastUpdated: Timestamp.now()
      });
      equipmentIds[equipment.name] = docRef.id;
      console.log(`✅ Added ${equipment.name}`);
    }

    // Add sample bookings for user123
    console.log('📅 Adding sample bookings...');
    const bookings = [
      {
        userId: 'user123',
        equipmentId: equipmentIds['Treadmill 1'],
        equipmentName: 'Treadmill 1',
        startTime: Timestamp.fromDate(new Date(Date.now() + 2 * 60 * 60 * 1000)),
        endTime: Timestamp.fromDate(new Date(Date.now() + 2.5 * 60 * 60 * 1000)),
        duration: 30,
        status: 'upcoming',
        createdAt: Timestamp.now()
      },
      {
        userId: 'user123',
        equipmentId: equipmentIds['Bench Press 2'],
        equipmentName: 'Bench Press 2',
        startTime: Timestamp.fromDate(new Date(Date.now() + 4 * 60 * 60 * 1000)),
        endTime: Timestamp.fromDate(new Date(Date.now() + 4.75 * 60 * 60 * 1000)),
        duration: 45,
        status: 'upcoming',
        createdAt: Timestamp.now()
      }
    ];

    for (const booking of bookings) {
      await addDoc(collection(db, 'bookings'), booking);
      console.log(`✅ Added booking for ${booking.equipmentName}`);
    }

    console.log('🎉 Database setup complete!');
    console.log(`
📊 SwiftGym Database Summary:
- Cardio: 8/12 available
- Strength: 15/20 available  
- Free Weights: 6/10 available
- Functional: 4/6 available
- Total: 33/48 available
- 2 sample bookings for user123
- Real-time updates enabled!
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase(); 