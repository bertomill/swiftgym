import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

// Sample gym equipment data
const equipmentData = [
  // Cardio Equipment
  { name: 'Treadmill 1', category: 'Cardio', isAvailable: true },
  { name: 'Treadmill 2', category: 'Cardio', isAvailable: true },
  { name: 'Treadmill 3', category: 'Cardio', isAvailable: false, currentUserId: 'user456' },
  { name: 'Treadmill 4', category: 'Cardio', isAvailable: true },
  { name: 'Treadmill 5', category: 'Cardio', isAvailable: true },
  { name: 'Elliptical 1', category: 'Cardio', isAvailable: true },
  { name: 'Elliptical 2', category: 'Cardio', isAvailable: false, currentUserId: 'user789' },
  { name: 'Elliptical 3', category: 'Cardio', isAvailable: true },
  { name: 'Stationary Bike 1', category: 'Cardio', isAvailable: true },
  { name: 'Stationary Bike 2', category: 'Cardio', isAvailable: true },
  { name: 'Stationary Bike 3', category: 'Cardio', isAvailable: false, currentUserId: 'user111' },
  { name: 'Rowing Machine 1', category: 'Cardio', isAvailable: true },

  // Strength Equipment
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
  { name: 'Shoulder Press 2', category: 'Strength', isAvailable: true },
  { name: 'Chest Fly Machine', category: 'Strength', isAvailable: true },
  { name: 'Leg Curl Machine', category: 'Strength', isAvailable: true },
  { name: 'Leg Extension Machine', category: 'Strength', isAvailable: true },

  // Free Weights
  { name: 'Dumbbells 5-50lbs', category: 'Free Weights', isAvailable: true },
  { name: 'Dumbbells 55-100lbs', category: 'Free Weights', isAvailable: true },
  { name: 'Barbell Station 1', category: 'Free Weights', isAvailable: true },
  { name: 'Barbell Station 2', category: 'Free Weights', isAvailable: false, currentUserId: 'user444' },
  { name: 'Kettlebell Set 1', category: 'Free Weights', isAvailable: true },
  { name: 'Kettlebell Set 2', category: 'Free Weights', isAvailable: true },
  { name: 'Olympic Plates Area 1', category: 'Free Weights', isAvailable: true },
  { name: 'Olympic Plates Area 2', category: 'Free Weights', isAvailable: true },
  { name: 'EZ Curl Bar Station', category: 'Free Weights', isAvailable: true },
  { name: 'Cable Crossover', category: 'Free Weights', isAvailable: false, currentUserId: 'user555' },

  // Functional Training
  { name: 'TRX Station 1', category: 'Functional', isAvailable: true },
  { name: 'TRX Station 2', category: 'Functional', isAvailable: true },
  { name: 'Battle Ropes', category: 'Functional', isAvailable: true },
  { name: 'Agility Ladder Area', category: 'Functional', isAvailable: true },
  { name: 'Medicine Ball Area', category: 'Functional', isAvailable: false, currentUserId: 'user666' },
  { name: 'Plyometric Box Area', category: 'Functional', isAvailable: false, currentUserId: 'user777' }
];

// Sample booking data for user123
const bookingsData = [
  {
    userId: 'user123',
    equipmentId: '', // Will be set after equipment is created
    equipmentName: 'Treadmill 5',
    startTime: Timestamp.fromDate(new Date(Date.now() + 2 * 60 * 60 * 1000)), // 2 hours from now
    endTime: Timestamp.fromDate(new Date(Date.now() + 2.5 * 60 * 60 * 1000)), // 2.5 hours from now
    duration: 30,
    status: 'upcoming',
    createdAt: Timestamp.now()
  },
  {
    userId: 'user123',
    equipmentId: '', // Will be set after equipment is created
    equipmentName: 'Bench Press 2',
    startTime: Timestamp.fromDate(new Date(Date.now() + 4 * 60 * 60 * 1000)), // 4 hours from now
    endTime: Timestamp.fromDate(new Date(Date.now() + 4.75 * 60 * 60 * 1000)), // 4.75 hours from now
    duration: 45,
    status: 'upcoming',
    createdAt: Timestamp.now()
  },
  {
    userId: 'user123',
    equipmentId: '', // Will be set after equipment is created
    equipmentName: 'Squat Rack 1',
    startTime: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // Tomorrow
    endTime: Timestamp.fromDate(new Date(Date.now() + 24.5 * 60 * 60 * 1000)), // Tomorrow + 30 min
    duration: 30,
    status: 'upcoming',
    createdAt: Timestamp.now()
  }
];

export const setupDatabase = async () => {
  try {
    console.log('🔥 Setting up SwiftGym database...');

    // Add equipment
    console.log('📋 Adding gym equipment...');
    const equipmentIds: { [key: string]: string } = {};
    
    for (const equipment of equipmentData) {
      const docRef = await addDoc(collection(db, 'equipment'), {
        ...equipment,
        lastUpdated: Timestamp.now()
      });
      equipmentIds[equipment.name] = docRef.id;
      console.log(`✅ Added ${equipment.name}`);
    }

    // Add bookings
    console.log('📅 Adding sample bookings...');
    for (const booking of bookingsData) {
      const equipmentId = equipmentIds[booking.equipmentName];
      if (equipmentId) {
        await addDoc(collection(db, 'bookings'), {
          ...booking,
          equipmentId
        });
        console.log(`✅ Added booking for ${booking.equipmentName}`);
      }
    }

    console.log('🎉 Database setup complete!');
    console.log(`
📊 Summary:
- ${equipmentData.length} pieces of equipment added
- ${bookingsData.length} sample bookings created
- Real-time updates enabled
- Ready for SwiftGym app!
    `);

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  }
};

// Export individual functions for testing
export const addSampleEquipment = async () => {
  for (const equipment of equipmentData) {
    await addDoc(collection(db, 'equipment'), {
      ...equipment,
      lastUpdated: Timestamp.now()
    });
  }
};

export const addSampleBookings = async () => {
  for (const booking of bookingsData) {
    await addDoc(collection(db, 'bookings'), booking);
  }
}; 