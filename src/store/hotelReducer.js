import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: {
    location: "",
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
    numberOfNights: 0, // Add numberOfNights to store the calculated value
  },
  hotelData: [],
  selectedHotel: null,
  selectedRoomWithHotel: {
    hotel: null,
    room: null,
    offer: null,
  },
};

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      const newFilters = { ...state.filters, ...action.payload };

      // Check if both checkInDate and checkOutDate are present to calculate numberOfNights
      if (newFilters.checkInDate && newFilters.checkOutDate) {
        const checkIn = new Date(newFilters.checkInDate);
        const checkOut = new Date(newFilters.checkOutDate);

        // Calculate the difference in days
        const timeDiff = checkOut - checkIn;
        const numberOfNights = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days

        // Update the numberOfNights
        newFilters.numberOfNights = numberOfNights >= 0 ? numberOfNights : 0;
      } else {
        newFilters.numberOfNights = 0; // If no dates are provided, reset numberOfNights
      }

      // Update the state with the new filters
      state.filters = newFilters;
    },
    setHotelData: (state, action) => {
      state.hotelData = action.payload;
    },

    setSelectedHotelFromRedux: (state, action) => {
      state.selectedHotel = action.payload;
    },

    setSelectedRoomWithHotel: (state, action) => {
      const { hotel, room, offer } = action.payload;

      const { rooms, ...updatedHotelWithoutrooms } = hotel;

      const { offers, ...updatedRoom } = room;

      state.selectedRoomWithHotel.hotel = updatedHotelWithoutrooms;
      state.selectedRoomWithHotel.room = updatedRoom;
      state.selectedRoomWithHotel.offer = offer;
    },
    resetData: (state) => {
      state.filters = {
        location: "",
        checkInDate: "",
        checkOutDate: "",
        adults: 1,
        children: 0,
        numberOfNights: 0, // Reset numberOfNights on reset
      };
      state.hotelData = [];
      state.selectedHotel = null;
      state.selectedRoomWithHotel = {
        hotel: null,
        room: null,
        offer: null,
      };
    },
  },
});

export const {
  setFilters,
  setHotelData,
  setSelectedHotelFromRedux,
  setSelectedRoomWithHotel,
  resetData,
} = hotelSlice.actions;

export default hotelSlice.reducer;
