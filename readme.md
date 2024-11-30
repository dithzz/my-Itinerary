# AI-Generated Itinerary App

## Overview

This is an open-source React Native Expo mobile app that leverages AI to help users plan personalized itineraries for their trips or events. The app generates travel itineraries based on user preferences, travel dates, destination, and more. It uses the OpenAI API to suggest destinations, activities, and routes.

## Features

- **Personalized Itinerary Generation**: AI generates tailored itineraries based on user preferences such as travel type, budget, and interests.
- **AI-Powered Suggestions**: Recommends destinations, activities, and travel routes based on the trip details.
- **Real-Time Data**: Fetches real-time data like weather, events, and local attractions to enrich itinerary planning.
- **User-Friendly Interface**: Provides an intuitive mobile-optimized experience with easy navigation.

## Tech Stack

- **Frontend**: React Native Expo (for building cross-platform mobile apps)
- **AI**: OpenAI API (used for generating trip itineraries and recommendations)
- **Backend**: Node.js (optional, can be used for managing backend services if required)

## Prerequisites

- Node.js
- npm or yarn
- Expo CLI
- OpenAI API Key

## Installation

### 1. Install Expo CLI

```bash
npm install -g expo-cli
```

### 2. Clone the Repository

```bash
git clone https://github.com/dithzz/my-itenerary.git
cd my-itenerary
```

### 3. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 4. Set Up OpenAI API Key

1. Create a `.env` file in the root of the project
2. Add the following line to the `.env` file:

```
OPENAI_SECRET=your-openai-api-key-here
```

**Note**: Replace `your-openai-api-key-here` with your actual OpenAI API key.
**Important**: Ensure `.env` is added to `.gitignore` to prevent committing sensitive information.

### 5. Running the App

#### Using Expo Go (Recommended)

1. Install the Expo Go app on your mobile device:

   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Start the development server:

```bash
npx expo start
```

3. Scan the QR code with the Expo Go app on your mobile device

#### Alternatively, Run on Simulator/Emulator

For iOS (macOS):

```bash
npx expo start --ios
```

For Android:

```bash
npx expo start --android
```

## Usage

1. **Trip Planning**: Enter your destination, travel dates, and preferences (e.g., adventure, luxury, family, etc.)
2. **Generate Itinerary**: The app will call the OpenAI API to generate a personalized itinerary
3. **View Suggestions**: Get AI-powered recommendations for daily activities, routes, and nearby attractions

## Contributing

We welcome contributions!

### How to Contribute

1. Fork the repository
2. Clone your fork to your local machine
3. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes and commit them:
   ```bash
   git commit -m "Add new feature or fix issue"
   ```
5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a pull request with a description of your changes

### Code of Conduct

Please follow the standard Contributor Covenant code of conduct when contributing.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI API for providing AI-powered suggestions and itinerary generation
- Expo and React Native for building cross-platform mobile apps
- The open-source community for supporting and improving the software

⚠️ IMPORTANT NOTICE ⚠️
NO INDIVIDUAL OR ENTITY IS PERMITTED TO CLAIM ORIGINAL AUTHORSHIP OF THIS PROJECT. THIS IS AN OPEN-SOURCE COLLABORATIVE PROJECT. ANY CLAIMS OF SOLE OWNERSHIP ARE STRICTLY PROHIBITED.
