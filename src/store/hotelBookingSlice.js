import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hotelbookingData: null,
  status: "idle", // 'loading', 'succeeded', 'failed'
  error: null,
};

const hotelBookingSlice = createSlice({
  name: "hotelbooking",
  initialState,
  reducers: {
    setBooking: (state, action) => {
      state.hotelbookingData = action.payload;
    },
    clearBooking: (state) => {
      state.booking = null;
    },
  },
});

export const { setBooking, clearBooking } = hotelBookingSlice.actions;
export default hotelBookingSlice.reducer;
