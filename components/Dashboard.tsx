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
  Dimensions,
} from 'react-native';
import {
  getEquipmentCategories,
  getUserBookings,
  subscribeToEquipmentUpdates,
  subscribeToUserBookings,
  EquipmentCategory,
  Booking,
} from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';
import { 
  Ionicons, 
  MaterialIcons, 
  FontAwesome5,
  Feather 
} from '@expo/vector-icons';

// Get screen dimensions for responsive design
const { width: screenWidth } = Dimensions.get('window');

interface DashboardProps {
  activeTab?: string;
}

// --- Mock Data and Services ---
// In a real app, these would be in separate files

// --- Main Component ---
// The 'export default' keywords make this component the main export from this file
// This means other files can import it without using curly braces, like:
// import Dashboard from './components/Dashboard'
export default function Dashboard({ activeTab = 'home' }: DashboardProps) {
  const { user } = useAuth();
  const [equipmentCategories, setEquipmentCategories] = useState<EquipmentCategory[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Use authenticated user data
  const currentUserId = user?.uid || 'guest';
  const userName = (() => {
    if (user?.displayName) {
      // Extract first name from display name
      return user.displayName.split(' ')[0];
    }
    if (user?.email) {
      // Extract first part of email before @ and capitalize
      const emailPrefix = user.email.split('@')[0];
      return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }
    return 'Guest';
  })();

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

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

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

  const renderMainContent = () => {
    if (activeTab === 'profile') {
      return (
        <View style={styles.contentContainer}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <UserProfile />
            <View style={styles.bottomPadding} />
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* --- Search Bar --- */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="What are you looking for?"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* --- Featured/Trending Section --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              <TouchableOpacity style={styles.trendingCard}>
                <Image
                  source={require('../assets/splash.png')}
                  style={styles.trendingImage}
                />
                <View style={styles.trendingOverlay}>
                  <Text style={styles.trendingTitle}>STRENGTH &{'\n'}CARDIO</Text>
                  <Text style={styles.trendingSubtitle}>Peak hours: 6-8 AM</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.stars}>★★★★★</Text>
                    <Text style={styles.ratingText}>4.8 (324)</Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.trendingCard, styles.trendingCardSecond]}>
                <Image
                  source={require('../assets/splash.png')}
                  style={styles.trendingImage}
                />
                <View style={styles.trendingOverlay}>
                  <Text style={styles.trendingTitle}>FUNCTIONAL{'\n'}TRAINING</Text>
                  <Text style={styles.trendingSubtitle}>Available now</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.stars}>★★★★☆</Text>
                    <Text style={styles.ratingText}>4.6 (198)</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* --- Equipment Categories Grid --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Equipment Categories</Text>
            <View style={styles.categoriesGrid}>
              {filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryGridCard}
                    onPress={() => handleBookEquipment(category)}
                  >
                    <View style={[styles.categoryIconLarge, { backgroundColor: category.color || '#FF6B35' }]}>
                      {category.name === 'Free Weights' ? (
                        <FontAwesome5 name="dumbbell" size={24} color="#fff" />
                      ) : category.name === 'Strength' ? (
                        <MaterialIcons name="fitness-center" size={28} color="#fff" />
                      ) : category.name === 'Cardio' ? (
                        <FontAwesome5 name="running" size={24} color="#fff" />
                      ) : (
                        <MaterialIcons name="sports-gymnastics" size={28} color="#fff" />
                      )}
                    </View>
                    <Text style={styles.categoryGridName}>{category.name}</Text>
                    <Text style={styles.categoryGridAvailability}>
                      {category.available}/{category.total} available
                    </Text>
                    <View style={styles.availabilityBar}>
                      <View 
                        style={[
                          styles.availabilityFill, 
                          { width: `${(category.available / category.total) * 100}%` }
                        ]} 
                      />
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyStateText}>No equipment categories match your search.</Text>
              )}
            </View>
          </View>

          {/* --- Upcoming Bookings with Enhanced Design --- */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Bookings</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map(booking => (
                <TouchableOpacity
                  key={booking.id}
                  style={styles.enhancedBookingCard}
                  onPress={() => handleModifyBooking(booking)}
                >
                  <View style={styles.bookingIconContainer}>
                    <MaterialIcons name="fitness-center" size={24} color="#FF6B35" />
                  </View>
                  <View style={styles.bookingDetails}>
                    <Text style={styles.bookingEquipmentName}>{booking.equipmentName}</Text>
                    <Text style={styles.bookingDateTime}>
                      {formatTime(booking.startTime)} • {booking.duration} min
                    </Text>
                    <View style={styles.bookingMeta}>
                      <Text style={styles.bookingLocation}>Gym Floor B</Text>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Confirmed</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.moreButton}>
                    <Text style={styles.moreButtonText}>⋯</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyBookingsContainer}>
                <MaterialIcons name="event-note" size={48} color="#999" style={{ marginBottom: 16 }} />
                <Text style={styles.emptyBookingsTitle}>No bookings yet</Text>
                <Text style={styles.emptyBookingsSubtitle}>Book your first session to get started</Text>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Add some bottom padding for navigation */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Header with Personal Greeting --- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hey, {userName}</Text>
          <Text style={styles.subGreeting}>Ready for your workout?</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileIcon}>
            <Text style={styles.profileIconText}>
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderMainContent()}
    </SafeAreaView>
  );
}

// --- Enhanced Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
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
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  trendingCard: {
    width: screenWidth * 0.75,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  trendingCardSecond: {
    marginRight: 20,
  },
  trendingImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  trendingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  trendingTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 26,
    marginBottom: 8,
  },
  trendingSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    fontSize: 16,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryGridCard: {
    width: (screenWidth - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryGridName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryGridAvailability: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  availabilityBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
  },
  availabilityFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  enhancedBookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bookingDetails: {
    flex: 1,
  },
  bookingEquipmentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  bookingDateTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bookingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingLocation: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  moreButton: {
    padding: 8,
  },
  moreButtonText: {
    fontSize: 20,
    color: '#999',
  },
  emptyBookingsContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyBookingsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyBookingsSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 120,
  },
  contentContainer: {
    flex: 1,
  },
}); 