import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import InputField from "../components/shared/InputField";
import DatePickerButton from "../components/shared/DatePickerButton";
import { setUser } from "../store/userSlice";
import { AppDispatch } from "../store/store";
import { professionalTheme } from "../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";

import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type HomeScreenNavigationProp = StackNavigationProp<any, "HomeScreen">;

const PREDEFINED_BUDGETS = [
  { label: "₹40,000 - ₹80,000", value: "40000-80000" },
  { label: "₹80,000 - ₹1,60,000", value: "80000-160000" },
  { label: "₹1,60,000 - ₹3,20,000", value: "160000-320000" },
  { label: "₹3,20,000 - ₹6,40,000", value: "320000-640000" },
  { label: "₹6,40,000+", value: "640000+" },
];

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [numTravelers, setNumTravelers] = useState("");
  const [loading, setLoading] = useState(false);

  const [budgetType, setBudgetType] = useState("predefined");
  const [budget, setBudget] = useState("40000-80000");
  const [customBudget, setCustomBudget] = useState("");
  const [isCustomBudgetModalVisible, setIsCustomBudgetModalVisible] =
    useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [destination, setDestination] = useState("");
  const [location, setLocation] = useState("");
  const [travelType, setTravelType] = useState("leisure");
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [flightOption, setFlightOption] = useState<
    "withFlight" | "withoutFlight"
  >("withFlight");

  const [itineraryData, setItineraryData] = useState<string>("");

  const handleBudgetSelection = (value: string) => {
    if (value === "custom") {
      setIsCustomBudgetModalVisible(true);
    } else {
      setBudget(value);
      setBudgetType("predefined");
    }
  };

  const handleCustomBudgetConfirm = () => {
    // Validate custom budget
    const sanitizedBudget = customBudget.replace(/[^\d]/g, "");
    if (sanitizedBudget) {
      setBudget(sanitizedBudget);
      setBudgetType("custom");
      setIsCustomBudgetModalVisible(false);
    }
  };

  const handleEndDateSelection = (selectedDate: Date) => {
    if (startDate && selectedDate < startDate) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    setEndDate(selectedDate);
    setEndDatePickerVisible(false);
  };

  const generateItinerary = async () => {
    if (
      !flightOption ||
      !numTravelers ||
      !startDate ||
      !endDate ||
      !destination
    ) {
      alert("All fields are required to proceed.");
      return;
    }

    setLoading(true);

    try {
      const budgetDisplay =
        budgetType === "custom"
          ? `₹${parseInt(budget).toLocaleString()}`
          : `₹${budget}`;

      // Parse dates
      const start = new Date(startDate);
      const end = new Date(endDate);

      console.log(start, "start", end, "end");

      const includeFlights = flightOption === "withFlight";

      // Prepare OpenAI API request
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `
             You are a travel expert creating a COMPLETE structured JSON itinerary.

CRITICAL REQUIREMENTS:
- You MUST generate EXACTLY one detailed day object for EVERY single day between ${start} and ${end}.
- Total number of day objects MUST match the number of days between start and end dates.
- If trip is less than 7 days, provide at least 3-4 activities per day.
- If trip is 7-14 days, provide 2-3 activities per day.
- For trips over 14 days, provide 1-2 key activities per day.
              {
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
                  "numTravelers": ${numTravelers},
                  "budget": "${budgetDisplay}",
                  "travelDates": {
                    "start": "${start.toLocaleDateString()}",
                    "end": "${end.toLocaleDateString()}"
                  },
                  "destination": "${destination}",
                  "travelType": "${travelType}",
                  "flightPreference": "${
                    includeFlights ? "Include flights" : "No flights needed"
                  }"
                },
                "expectedBudget": {
                  "flights": "Estimated cost of flights if included",
                  "accommodation": "Estimated cost of accommodation",
                  "meals": "Estimated cost of meals",
                  "activities": "Estimated cost of activities"
                }
              }

            `,
            },
            {
              role: "user",
              content: `
              Create a fully detailed itinerary for a trip with ${numTravelers} travelers.
              The budget is ${budgetDisplay}. The trip starts on ${start.toLocaleDateString()} and ends on ${end.toLocaleDateString()}.
              The destination is ${destination}. The travel type is ${travelType}.
              Flight preference: ${
                includeFlights ? "Include flights" : "No flights needed"
              }.

              Generate plans for every day from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}, including activities, meals, and accommodations for each day.
            `,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_SECRET}`,
          },
        }
      );

      console.log(
        response.data.choices[0].message.content,
        "response.data.choices[0].message.content"
      );

      try {
        // Remove any potential markdown code blocks or extra text
        const cleanResponse = response.data.choices[0].message.content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const itineraryResponse = JSON.parse(cleanResponse);

        // Success: Set itinerary data
        setItineraryData(itineraryResponse);
        navigation.navigate("ItineraryScreen", {
          itineraryData: itineraryResponse,
          numTravelers: numTravelers,
          budgetDisplay: budgetDisplay,
          start: start.toLocaleDateString(),
          end: end.toLocaleDateString(),
          destination: destination,
          travelType: travelType,
          includeFlights: includeFlights,
        });
      } catch (error) {
        console.error("Error generating itinerary:", error);
        console.log("Raw response:", response.data.choices[0].message.content);
        alert("Failed to generate itinerary. Please try again.");
      }
    } catch (error) {
      console.error("Error generating itinerary:", error);
      alert("Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log(itineraryData, "itineraryResponse");
  useEffect(() => {
    dispatch(setUser({ username: "JohnDoe", email: "john@example.com" }));
  }, [dispatch]);

  const isFormValid = () =>
    flightOption &&
    numTravelers &&
    startDate &&
    endDate &&
    destination &&
    (budgetType === "custom" ? budget : true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[
          professionalTheme.colors.GRADIENT_START,
          professionalTheme.colors.GRADIENT_END,
        ]}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollViewContent}
          extraHeight={100}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
        >
          A Need it like a logo using css I'll create a logo-styled version of
          "MyItinerary" using React Native styling: jsx Copy
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoMyText}>My</Text>
              <Text style={styles.logoItineraryText}>Itinerary</Text>
            </View>
            <Text style={styles.subtitleText}>
              Craft your dream journey with precision and ease
            </Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.radioContainer}>
              <View style={styles.radioButtonGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    flightOption === "withFlight" && styles.selectedRadioButton,
                  ]}
                  onPress={() => setFlightOption("withFlight")}
                >
                  <Text style={styles.radioButtonText}>With Flight</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    flightOption === "withoutFlight" &&
                      styles.selectedRadioButton,
                  ]}
                  onPress={() => setFlightOption("withoutFlight")}
                >
                  <Text style={styles.radioButtonText}>Without Flight</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rest of the form remains the same */}
            <View style={styles.datePickerContainer}>
              <DatePickerButton
                label="Start Date"
                date={startDate}
                isVisible={isStartDatePickerVisible}
                onPress={() => setStartDatePickerVisible(true)}
                onConfirm={(date) => {
                  setStartDate(date);
                  setStartDatePickerVisible(false);
                }}
                onCancel={() => setStartDatePickerVisible(false)}
              />
            </View>
            <View style={styles.datePickerContainer}>
              <DatePickerButton
                label="End Date"
                date={endDate}
                isVisible={isEndDatePickerVisible}
                onPress={() => setEndDatePickerVisible(true)}
                onConfirm={(date) => {
                  handleEndDateSelection(date);
                }}
                onCancel={() => setEndDatePickerVisible(false)}
              />
            </View>
            <InputField
              label="Number of Travelers"
              value={numTravelers}
              onChangeText={setNumTravelers}
              keyboardType="numeric"
            />

            {/* Custom Budget Modal */}
            <Modal
              visible={isCustomBudgetModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsCustomBudgetModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Enter Custom Budget</Text>
                  <TextInput
                    label="Budget in ₹"
                    value={customBudget}
                    onChangeText={setCustomBudget}
                    keyboardType="numeric"
                    style={styles.customBudgetInput}
                    mode="outlined"
                    left={<TextInput.Affix text="₹" />}
                  />
                  <View style={styles.modalButtonContainer}>
                    <Button
                      mode="text"
                      onPress={() => {
                        setIsCustomBudgetModalVisible(false);
                        // Reset to predefined if canceled without a custom budget
                        if (budgetType === "custom" && !customBudget) {
                          setBudgetType("predefined");
                          setBudget("40000-80000");
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      mode="contained"
                      onPress={handleCustomBudgetConfirm}
                      disabled={!customBudget}
                      style={[
                        styles.submitButton,
                        !customBudget && styles.disabledButton,
                      ]}
                    >
                      Confirm
                    </Button>
                  </View>
                </View>
              </View>
            </Modal>

            {flightOption === "withFlight" && (
              <InputField
                label="Location"
                value={location}
                onChangeText={setLocation}
              />
            )}

            <InputField
              label="Destination"
              value={destination}
              onChangeText={setDestination}
            />

            {/* Budget Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Budget Range (₹)</Text>
              {budgetType === "predefined" ? (
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={budget}
                    onValueChange={handleBudgetSelection}
                  >
                    {PREDEFINED_BUDGETS.map((budgetOption) => (
                      <Picker.Item
                        key={budgetOption.value}
                        label={budgetOption.label}
                        value={budgetOption.value}
                      />
                    ))}
                    <Picker.Item label="Custom Budget" value="custom" />
                  </Picker>
                </View>
              ) : (
                <View style={styles.customBudgetDisplay}>
                  <Text style={styles.customBudgetText}>
                    Budget: ₹{parseInt(budget).toLocaleString()}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsCustomBudgetModalVisible(true)}
                    style={styles.editBudgetButton}
                  >
                    <Text style={styles.editBudgetButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {/* Travel Type Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Type of Travel</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={travelType}
                  onValueChange={(itemValue) => setTravelType(itemValue)}
                >
                  <Picker.Item label="Leisure" value="leisure" />
                  <Picker.Item label="Business" value="business" />
                  <Picker.Item label="Adventure" value="adventure" />
                  <Picker.Item label="Cultural" value="cultural" />
                  <Picker.Item label="Romantic" value="romantic" />
                  <Picker.Item label="Family" value="family" />
                </Picker>
              </View>
            </View>
            <Button
              mode="contained"
              onPress={generateItinerary}
              disabled={!isFormValid()}
              style={[
                styles.submitButton,
                !isFormValid() && styles.disabledButton,
              ]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                "Generate Itinerary"
              )}
            </Button>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "700",
    color: professionalTheme.colors.WHITE,
    marginBottom: 10,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: professionalTheme.colors.WHITE,
    borderRadius: 15,
    padding: 20,
    width: width * 0.9,
    alignSelf: "center",
    shadowColor: professionalTheme.colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  datePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  datePickerContainer: {
    width: "100%",
  },
  submitButton: {
    backgroundColor: professionalTheme.colors.ACCENT,
    borderRadius: 30,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  safeArea: {
    flex: 1,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: professionalTheme.colors.PRIMARY,
  },
  pickerWrapper: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: width * 0.85,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  customBudgetInput: {
    width: "100%",
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  customBudgetDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
  },
  customBudgetText: {
    fontSize: 16,
    color: professionalTheme.colors.PRIMARY,
  },
  editBudgetButton: {
    backgroundColor: professionalTheme.colors.ACCENT,
    borderRadius: 5,
    padding: 8,
  },
  editBudgetButtonText: {
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  radioContainer: {
    marginBottom: 15,
  },
  radioButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  selectedRadioButton: {
    borderColor: professionalTheme.colors.ACCENT,
  },
  radioButtonText: {
    color: professionalTheme.colors.PRIMARY,
    fontWeight: "600",
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  logoMyText: {
    fontSize: 28,
    fontWeight: "300",
    color: "#ffffff",
  },
  logoItineraryText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: "#ffffff",
    marginTop: 8,
    textAlign: "center",
  },
});

export default HomeScreen;
