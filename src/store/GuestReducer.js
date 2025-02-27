// store/hotelGuestReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adults: [], // Array to store adult passengers
  children: [], // Array to store child passengers
  email: "",
};

const hotelGuestSlice = createSlice({
  name: "hotelGuest",
  initialState,
  reducers: {
    setGuestDetails: (state, action) => {
      const { adults, children, email } = action.payload;
      state.adults = adults;
      state.children = children;
      state.email = email;
    },
    clearGuestDetails: (state) => {
      state.firstName = "";
      state.lastName = "";
      state.email = "";
    },
  },
});

export const { setGuestDetails, clearGuestDetails } = hotelGuestSlice.actions;

export default hotelGuestSlice.reducer;
