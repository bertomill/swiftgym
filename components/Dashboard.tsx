import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import {
  getEquipmentCategories,
  getUserBookings,
  subscribeToEquipmentUpdates,
  subscribeToUserBookings,
  EquipmentCategory,
  Booking,
} from '../services/databaseService';

// --- Mock Data and Services ---
// In a real app, these would be in separate files

// --- Main Component ---
export default function Dashboard() {
  const [equipmentCategories, setEquipmentCategories] = useState<EquipmentCategory[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock user ID - replace with real auth
  const currentUserId = 'user123';

  useEffect(() => {
    // Initial data load
    const loadInitialData = async () => {
      try {
        const [categories, bookings] = await Promise.all([
          getEquipmentCategories(),
          getUserBookings(currentUserId),
        ]);
        setEquipmentCategories(categories);
        setUpcomingBookings(bookings);
      } catch (error) {
        console.error('Error loading initial data:', error);
        Alert.alert('Error', 'Failed to load initial data.');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();

    // Real-time updates
    const unsubscribeEquipment = subscribeToEquipmentUpdates(setEquipmentCategories);
    const unsubscribeBookings = subscribeToUserBookings(currentUserId, setUpcomingBookings);

    return () => {
      unsubscribeEquipment();
      unsubscribeBookings();
    };
  }, []);

  // --- Render Functions ---
  const handleBookEquipment = (category: EquipmentCategory) => {
    Alert.alert(
      'Book Equipment',
      `Book from the ${category.name} category?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => console.log(`Booking from ${category.name}`) },
      ]
    );
  };

  const handleModifyBooking = (booking: Booking) => {
    Alert.alert('Modify Booking', `Update booking for ${booking.equipmentName}?`);
  };

  const formatTime = (date: Date) => 
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  // --- UI Components ---
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const filteredCategories = equipmentCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Header --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EXPLORE</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            {/* Replace with actual icon */}
            <Text style={styles.iconPlaceholder}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            {/* Replace with actual icon */}
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>AS</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* --- Search Bar --- */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="What are you looking for?"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* --- Hero/Featured Card --- */}
        <View style={styles.heroCard}>
          <Image
            source={require('../assets/splash.png')}
            style={styles.heroImage}
          />
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Strength & Cardio</Text>
            <Text style={styles.heroSubtitle}>The best equipment for a full-body workout.</Text>
          </View>
          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* --- Equipment Categories --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment Categories</Text>
          {filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleBookEquipment(category)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color || '#333' }]} />
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryAvailability}>
                    {category.available} / {category.total} available
                  </Text>
                </View>
                <Text style={styles.categoryArrow}>›</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyStateText}>No equipment categories match your search.</Text>
          )}
        </View>

        {/* --- Upcoming Bookings --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Upcoming Bookings</Text>
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map(booking => (
              <TouchableOpacity
                key={booking.id}
                style={styles.bookingCard}
                onPress={() => handleModifyBooking(booking)}
              >
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingEquipment}>{booking.equipmentName}</Text>
                  <Text style={styles.bookingTime}>
                    {formatTime(booking.startTime)} • {booking.duration} min
                  </Text>
                </View>
                <View style={styles.bookingStatus}>
                  <Text style={styles.bookingStatusText}>Confirmed</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>You have no upcoming bookings.</Text>
              <TouchableOpacity style={styles.bookNowButton}>
                <Text style={styles.bookNowButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlaceholder: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  profileIconText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    padding: 20,
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  heroCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  heroImage: {
    width: '100%',
    height: 220,
    opacity: 0.6,
  },
  heroTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
    opacity: 0.9,
  },
  heroButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 15,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
  },
  categoryAvailability: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categoryArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  bookingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  bookingInfo: {},
  bookingEquipment: {
    fontSize: 16,
    fontWeight: '700',
  },
  bookingTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  bookingStatus: {
    backgroundColor: '#e8f5e9', // a light green
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bookingStatusText: {
    color: '#4caf50',
    fontWeight: '600',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  bookNowButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  bookNowButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
}); 