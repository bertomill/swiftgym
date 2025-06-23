import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Types
export interface Equipment {
  id: string;
  name: string;
  category: string;
  isAvailable: boolean;
  currentUserId?: string;
  lastUpdated: Date;
}

export interface Booking {
  id: string;
  userId: string;
  equipmentId: string;
  equipmentName: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  available: number;
  total: number;
  color: string;
}

// Equipment Services
export const getEquipmentCategories = async (): Promise<EquipmentCategory[]> => {
  try {
    const equipmentSnapshot = await getDocs(collection(db, 'equipment'));
    const equipment = equipmentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Equipment[];
    
    // Group by category and count
    const categories = equipment.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { total: 0, available: 0 };
      }
      acc[item.category].total++;
      if (item.isAvailable) {
        acc[item.category].available++;
      }
      return acc;
    }, {} as Record<string, { total: number; available: number }>);

    // Convert to array with colors
    const categoryColors = {
      'Cardio': '#4CAF50',
      'Strength': '#2196F3',
      'Free Weights': '#FF9800',
      'Functional': '#9C27B0'
    };

    return Object.entries(categories).map(([name, counts], index) => ({
      id: (index + 1).toString(),
      name,
      available: counts.available,
      total: counts.total,
      color: categoryColors[name as keyof typeof categoryColors] || '#757575'
    }));
  } catch (error) {
    console.error('Error fetching equipment categories:', error);
    // Return mock data as fallback
    return [
      { id: '1', name: 'Cardio', available: 8, total: 12, color: '#4CAF50' },
      { id: '2', name: 'Strength', available: 15, total: 20, color: '#2196F3' },
      { id: '3', name: 'Free Weights', available: 6, total: 10, color: '#FF9800' },
      { id: '4', name: 'Functional', available: 4, total: 6, color: '#9C27B0' }
    ];
  }
};

export const getAvailableEquipment = async (category?: string): Promise<Equipment[]> => {
  try {
    const equipmentRef = collection(db, 'equipment');
    const q = category 
      ? query(equipmentRef, where('category', '==', category), where('isAvailable', '==', true))
      : query(equipmentRef, where('isAvailable', '==', true));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Equipment[];
  } catch (error) {
    console.error('Error fetching available equipment:', error);
    return [];
  }
};

// Booking Services
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef, 
      where('userId', '==', userId),
      where('status', 'in', ['upcoming', 'active']),
      orderBy('startTime', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      startTime: doc.data().startTime.toDate(),
      endTime: doc.data().endTime.toDate(),
      createdAt: doc.data().createdAt.toDate()
    })) as Booking[];
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    // Return mock data as fallback
    return [
      {
        id: '1',
        userId,
        equipmentId: 'treadmill-5',
        equipmentName: 'Treadmill 5',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000), // 2.5 hours from now
        duration: 30,
        status: 'upcoming',
        createdAt: new Date()
      },
      {
        id: '2',
        userId,
        equipmentId: 'bench-press-2',
        equipmentName: 'Bench Press 2',
        startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        endTime: new Date(Date.now() + 4.75 * 60 * 60 * 1000), // 4.75 hours from now
        duration: 45,
        status: 'upcoming',
        createdAt: new Date()
      }
    ];
  }
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const bookingData = {
      ...booking,
      startTime: Timestamp.fromDate(booking.startTime),
      endTime: Timestamp.fromDate(booking.endTime),
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, 'bookings'), bookingData);
    
    // Update equipment availability
    await updateDoc(doc(db, 'equipment', booking.equipmentId), {
      isAvailable: false,
      currentUserId: booking.userId,
      lastUpdated: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string, equipmentId: string): Promise<void> => {
  try {
    // Update booking status
    await updateDoc(doc(db, 'bookings', bookingId), {
      status: 'cancelled'
    });
    
    // Make equipment available again
    await updateDoc(doc(db, 'equipment', equipmentId), {
      isAvailable: true,
      currentUserId: null,
      lastUpdated: Timestamp.now()
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// Real-time listeners
export const subscribeToEquipmentUpdates = (callback: (categories: EquipmentCategory[]) => void) => {
  return onSnapshot(collection(db, 'equipment'), async () => {
    const categories = await getEquipmentCategories();
    callback(categories);
  });
};

export const subscribeToUserBookings = (userId: string, callback: (bookings: Booking[]) => void) => {
  const bookingsRef = collection(db, 'bookings');
  const q = query(
    bookingsRef,
    where('userId', '==', userId),
    where('status', 'in', ['upcoming', 'active']),
    orderBy('startTime', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime.toDate(),
      endTime: doc.data().endTime.toDate(),
      createdAt: doc.data().createdAt.toDate()
    })) as Booking[];
    callback(bookings);
  });
}; 