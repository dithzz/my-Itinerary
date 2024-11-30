// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state using TypeScript types
interface UserState {
  username: string;
  email: string;
}

const initialState: UserState = {
  username: "",
  email: "",
};

// Create the slice for user data
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    clearUser(state) {
      state.username = "";
      state.email = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
