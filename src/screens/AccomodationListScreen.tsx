import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import { professionalTheme } from "../styles/commonStyles";

const AccommodationListScreen = () => {
  const accommodations = [
    { name: "Hotel A", location: "City Center", price: "$150 per night" },
    { name: "Hotel B", location: "Beachside", price: "$200 per night" },
    { name: "Hotel C", location: "Downtown", price: "$120 per night" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Available Accommodations</Text>
      {accommodations.map((accommodation, index) => (
        <View key={index} style={styles.accommodationCard}>
          <Text style={styles.accommodationName}>{accommodation.name}</Text>
          <Text style={styles.accommodationLocation}>
            {accommodation.location}
          </Text>
          <Text style={styles.accommodationPrice}>{accommodation.price}</Text>
          <Button
            mode="contained"
            onPress={() => alert(`Booking ${accommodation.name}`)} // Implement booking logic
            style={styles.bookButton}
          >
            Book Now
          </Button>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: professionalTheme.colors.BACKGROUND,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: professionalTheme.colors.PRIMARY,
  },
  accommodationCard: {
    backgroundColor: professionalTheme.colors.WHITE,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: professionalTheme.colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accommodationName: {
    fontSize: 18,
    fontWeight: "600",
    color: professionalTheme.colors.PRIMARY,
  },
  accommodationLocation: {
    fontSize: 14,
    color: professionalTheme.colors.TEXT_GRAY,
    marginVertical: 5,
  },
  accommodationPrice: {
    fontSize: 16,
    color: professionalTheme.colors.PRIMARY,
  },
  bookButton: {
    marginTop: 10,
  },
});

export default AccommodationListScreen;
