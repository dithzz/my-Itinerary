// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import { store } from "./src/store/store"; // Import the store
import HomeScreen from "./src/screens/HomeScreen";
import ItineraryScreen from "./src/screens/IteneraryScreen";
import AccommodationListScreen from "./src/screens/AccomodationListScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }} // Disable header for HomeScreen
          />
          <Stack.Screen
            name="ItineraryScreen"
            component={ItineraryScreen}
            options={{ headerShown: false }} // Disable header for ItineraryScreen
          />

          <Stack.Screen
            name="AccommodationListScreen"
            component={AccommodationListScreen}
            options={{ headerShown: false }} // Disable header for ItineraryScreen
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
