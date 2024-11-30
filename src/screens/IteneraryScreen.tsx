import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { professionalTheme } from "../styles/commonStyles";
import { IconButton, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
  meals?: Meal[];
  accommodation?: string;
}

interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
  bookingLink?: string;
  estimatedCost?: number;
}

interface Meal {
  type: "Breakfast" | "Lunch" | "Dinner";
  restaurant?: string;
  cuisine?: string;
}

interface Recommendation {
  title: string;
  description: string;
  link: string;
}

const ItineraryScreen: React.FC<any> = ({ route }) => {
  const [isAdjustmentModalVisible, setIsAdjustmentModalVisible] =
    useState(false);
  const [adjustmentPrompt, setAdjustmentPrompt] = useState("");
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [itineraryData, setItineraryData] = useState<any | null>(null);

  const { itineraryData: routeItineraryData } = route.params;

  useEffect(() => {
    // Simulate loading or actual data fetching
    const loadItineraryData = async () => {
      try {
        // In a real app, this might be an API call
        setItineraryData(routeItineraryData);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load itinerary", error);
        setIsLoading(false);
      }
    };

    loadItineraryData();
  }, [routeItineraryData]);

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Error opening link: ", err)
    );
  };

  const renderActivityItem = (activity: Activity, index: number) => (
    <View key={index} style={styles.activityCard}>
      <Text style={styles.activityTime}>{activity.time}</Text>
      <Text style={styles.activityTitle}>{activity.title}</Text>
      <Text style={styles.activityDescription}>{activity.description}</Text>
      {/* {activity.bookingLink && (
        <Button
          mode="outlined"
          onPress={() => handleLinkPress(activity.bookingLink)}
          style={styles.bookingButton}
        >
          Book Activity
        </Button>
      )} */}
    </View>
  );

  const renderDayPlan = (dayPlan: DayPlan) => (
    <View key={dayPlan.day} style={styles.dayContainer}>
      <Text style={styles.dayHeader}>
        Day {dayPlan.day} - {dayPlan.date}
      </Text>
      {dayPlan.activities.map(renderActivityItem)}

      {dayPlan.meals && (
        <View style={styles.mealsContainer}>
          <Text style={styles.mealsHeader}>Meals</Text>
          {dayPlan.meals.map((meal, idx) => (
            <Text key={idx} style={styles.mealText}>
              {meal.type}: {meal.restaurant || "Local dining"}
              {meal.cuisine && ` (${meal.cuisine})`}
            </Text>
          ))}
        </View>
      )}

      {/* {dayPlan.accommodation && (
        <View style={styles.accommodationContainer}>
          <Text style={styles.accommodationHeader}>Accommodation</Text>
          <Text style={styles.accommodationText}>{dayPlan.accommodation}</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("AccommodationListScreen")}
            style={styles.bookingButton}
          >
            Book Accommodation
          </Button>
        </View>
      )} */}
    </View>
  );

  const renderRecommendations = () => {
    const recommendations: Recommendation[] = [
      {
        title: "Local Experiences",
        description: "Discover unique activities at your destination",
        link: "https://www.getyourguide.com",
      },
      {
        title: "Travel Insurance",
        description: "Protect your trip with comprehensive coverage",
        link: "https://www.worldnomads.com",
      },
    ];

    return (
      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionTitle}>Travel Recommendations</Text>
        {recommendations.map((rec, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recommendationCard}
            onPress={() => handleLinkPress(rec.link)}
          >
            <Text style={styles.recommendationTitle}>{rec.title}</Text>
            <Text style={styles.recommendationDescription}>
              {rec.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={professionalTheme.colors.PRIMARY}
        />
        <Text>Loading your personalized itinerary...</Text>
      </View>
    );
  }

  if (!itineraryData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No itinerary data available</Text>
        <Button onPress={() => navigation.goBack()}>Go Back</Button>
      </View>
    );
  }

  const handleItineraryAdjustment = async () => {
    if (!adjustmentPrompt) {
      Alert.alert("Error", "Please provide adjustment details");
      return;
    }

    setIsLoading(true);
    setIsAdjustmentModalVisible(false);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o", // or gpt-4
          messages: [
            {
              role: "system",
              content: `
                You are an expert travel planner. 
                Carefully modify the existing itinerary based on user's request.
                Maintain the original JSON structure exactly.
                Ensure comprehensive and realistic modifications.
              `,
            },
            {
              role: "user",
              content: `
                Current Itinerary Details:
            ${JSON.stringify(itineraryData)}

                Adjustment Request: ${adjustmentPrompt}

                INSTRUCTIONS:
                1. Review the current itinerary carefully
                2. Apply the requested changes
                3. Maintain the exact JSON structure as  {
                "destination": "City Name",
                "startDate": "DD/MM/YYYY",
                "endDate": "DD/MM/YYYY",
                "days": [
                  {
                    "day": 1,
                    "date": "DD/MM/YYYY",
                    "activities": [
                      {
                        "time": "Morning/Afternoon/Evening",
                        "title": "Activity Name",
                        "description": "Detailed description",
                        "location": "Location Name",
                        "bookingLink": "Optional booking URL",
                        "estimatedCost": 0
                      }
                    ],
                    "meals": [
                      {
                        "type": "Breakfast/Lunch/Dinner",
                        "restaurant": "Optional restaurant name",
                        "cuisine": "Optional cuisine type"
                      }
                    ],
                    "accommodation": "Optional hotel name"
                  }
                ],
                "summary": {
                  "numTravelers": ${route.numTravelers},
                  "budget": "${route.budgetDisplay}",
                  "travelDates": {
                    "start": "${route.start}",
                    "end": "${route.end}"
                  },
                  "destination": "${route.destination}",
                  "travelType": "${route.travelType}",
                  "flightPreference": "${
                    route.includeFlights
                      ? "Include flights"
                      : "No flights needed"
                  }"
                },
                "expectedBudget": {
                  "flights": "Estimated cost of flights if included",
                  "accommodation": "Estimated cost of accommodation",
                  "meals": "Estimated cost of meals",
                  "activities": "Estimated cost of activities"
                }
              }
                4. Provide detailed, realistic modifications
                5. Ensure all days are fully populated
              `,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_SECRET}`,

            "Content-Type": "application/json",
          },
        }
      );

      // Parse the AI response
      const aiResponse = response.data.choices[0].message.content;
      console.log(aiResponse, "aiResponse");

      try {
        // Extract JSON from the code block
        const jsonMatch = aiResponse.match(/```json\n([\s\S]*?\n)```/);

        if (jsonMatch) {
          const cleanResponse = jsonMatch[1].trim();
          const parsedItinerary = JSON.parse(cleanResponse);
          setItineraryData(parsedItinerary);
        } else {
          // If no code block found, try parsing the entire response
          const parsedItinerary = JSON.parse(aiResponse);
          setItineraryData(parsedItinerary);
        }
      } catch (parseError) {
        console.error("Parsing Error Details:", parseError);
        console.log("Raw AI Response:", aiResponse);
        Alert.alert(
          "Parsing Error",
          "Unable to process the generated itinerary. Please try again."
        );
      }
    } catch (error) {
      console.error("Itinerary Adjustment Error:", error);
      Alert.alert(
        "Error",
        "Failed to adjust itinerary. Please check your internet connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[
          professionalTheme.colors.GRADIENT_START,
          professionalTheme.colors.GRADIENT_END,
        ]}
        style={styles.gradientContainer}
      >
        <View style={styles.headerContainer}>
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
            iconColor="white"
          />
          <Text style={styles.headerTitle}>
            {itineraryData?.destination} Itinerary
          </Text>
          <IconButton
            icon="pencil"
            onPress={() => setIsAdjustmentModalVisible(true)}
            iconColor="white"
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Trip Summary Section */}
          <View style={styles.tripSummaryContainer}>
            <Text style={styles.tripSummaryTitle}>Trip Summary</Text>
            <Text style={styles.tripSummaryText}>
              Destination: {itineraryData.destination}
            </Text>
            <Text style={styles.tripSummaryText}>
              Dates: {itineraryData.startDate} to {itineraryData.endDate}
            </Text>
          </View>

          {itineraryData?.days?.map(renderDayPlan)}

          {renderRecommendations()}

          <View style={styles.ctaContainer}>
            <Button
              mode="contained"
              onPress={() => handleLinkPress("https://www.booking.com")}
              style={styles.ctaButton}
              labelStyle={styles.ctaLabel}
            >
              Book Hotels
            </Button>
            <Button
              mode="contained"
              onPress={() => handleLinkPress("https://www.skyscanner.com")}
              style={styles.ctaButton}
              labelStyle={styles.ctaLabel}
            >
              Find Flights
            </Button>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Adjustment Modal */}
      <Modal
        visible={isAdjustmentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAdjustmentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adjust Your Itinerary</Text>
            <TextInput
              multiline
              placeholder="Describe how you'd like to modify your trip"
              style={styles.adjustmentInput}
              value={adjustmentPrompt}
              onChangeText={setAdjustmentPrompt}
            />
            <View style={styles.modalButtonContainer}>
              <Button
                mode="contained"
                onPress={handleItineraryAdjustment}
                loading={isLoading}
              >
                Adjust Itinerary
              </Button>
              <Button
                mode="outlined"
                onPress={() => setIsAdjustmentModalVisible(false)}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: professionalTheme.colors.WHITE,
    fontSize: 22,
    fontWeight: "700",
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tripSummaryContainer: {
    backgroundColor: professionalTheme.colors.WHITE,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  tripSummaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: professionalTheme.colors.PRIMARY,
    marginBottom: 10,
  },
  tripSummaryText: {
    fontSize: 16,
    color: professionalTheme.colors.SECONDARY,
  },
  dayContainer: {
    backgroundColor: professionalTheme.colors.WHITE,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: professionalTheme.colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: professionalTheme.colors.PRIMARY,
    marginBottom: 15,
  },
  activityCard: {
    marginBottom: 10,
  },
  activityTime: {
    fontSize: 14,
    color: professionalTheme.colors.SECONDARY,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: professionalTheme.colors.PRIMARY,
  },
  activityDescription: {
    fontSize: 14,
    color: professionalTheme.colors.SECONDARY,
    marginTop: 5,
  },
  bookingButton: {
    marginTop: 10,
    backgroundColor: professionalTheme.colors.PRIMARY,
  },
  mealsContainer: {
    marginTop: 15,
  },
  mealsHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: professionalTheme.colors.PRIMARY,
  },
  mealText: {
    fontSize: 14,
    color: professionalTheme.colors.SECONDARY,
  },
  accommodationContainer: {
    marginTop: 15,
  },
  accommodationHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: professionalTheme.colors.PRIMARY,
  },
  accommodationText: {
    fontSize: 14,
    color: professionalTheme.colors.SECONDARY,
  },
  recommendationsContainer: {
    marginTop: 25,
    backgroundColor: professionalTheme.colors.WHITE,
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: professionalTheme.colors.PRIMARY,
    marginBottom: 15,
  },
  recommendationCard: {
    padding: 12,
    marginBottom: 15,
    backgroundColor: professionalTheme.colors.LIGHT_BACKGROUND,
    borderRadius: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: professionalTheme.colors.PRIMARY,
  },
  recommendationDescription: {
    fontSize: 14,
    color: professionalTheme.colors.SECONDARY,
    marginTop: 5,
  },
  ctaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  ctaButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: professionalTheme.colors.PRIMARY,
  },
  ctaLabel: {
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: professionalTheme.colors.ERROR,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: professionalTheme.colors.WHITE,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: professionalTheme.colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: professionalTheme.colors.PRIMARY,
    marginBottom: 15,
  },
  adjustmentInput: {
    width: "100%",
    height: 120,
    borderColor: professionalTheme.colors.SECONDARY,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: "top",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  // Additional Header Styles
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
});

export default ItineraryScreen;
