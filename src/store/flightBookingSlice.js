import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookingData: null,
  status: "idle", // 'loading', 'succeeded', 'failed'
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBooking: (state, action) => {
      state.bookingData = action.payload;
    },
    clearBooking: (state) => {
      state.booking = null;
    },
  },
});

export const { setBooking, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
