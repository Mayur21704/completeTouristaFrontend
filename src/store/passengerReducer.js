import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adults: [], // Array to store adult passengers
  children: [], // Array to store child passengers
  email: "", // Email of the user
  outboundSeats: {}, // Seat selection for the outbound flight (DEL → BOM)
  returnSeats: {}, // Seat selection for the return flight (BOM → DEL)
};

const passengerSlice = createSlice({
  name: "passenger",
  initialState,
  reducers: {
    // Set initial passenger details (adults, children, email)
    setPassengerDetails: (state, action) => {
      const { adults, children, email } = action.payload;
      state.adults = adults;
      state.children = children;
      state.email = email;
    },

    // Update passenger data (adult/child)
    updatePassenger: (state, action) => {
      const { type, index, field, value } = action.payload;

      if (type === "adult") {
        state.adults[index][field] = value;
      } else if (type === "child") {
        state.children[index][field] = value;
      }
    },

    // Set selected seat for a specific passenger on a specific segment (outbound or return)
    setSelectedSeat: (state, action) => {
      const { passengerId, seatNumber, segment } = action.payload;

      // Find the passenger by travelerId (either adult or child)
      const passenger =
        state.adults.find((p) => p.travelerId === passengerId) ||
        state.children.find((p) => p.travelerId === passengerId);

      if (passenger) {
        // Update the seat number for the passenger
        passenger.seatNumber = seatNumber;
      }

      // Update the appropriate seat mapping for outbound or return segment
      if (segment === "outbound") {
        if (seatNumber) {
          state.outboundSeats[seatNumber] = passengerId;
        } else {
          delete state.outboundSeats[seatNumber];
        }
      } else if (segment === "return") {
        if (seatNumber) {
          state.returnSeats[seatNumber] = passengerId;
        } else {
          delete state.returnSeats[seatNumber];
        }
      }
    },
    resetPassengerData: (state) => {
      state.adults = [];
      state.children = [];
      state.email = "";
    },

    // Reset only the seat information (for single flight only)
    resetPassengerSeats: (state) => {
      state.outboundSeats = {}; // Clear only the outbound seats mapping
      state.returnSeats = {};
    },
  },
});

export const {
  setPassengerDetails,
  updatePassenger,
  setSelectedSeat,
  resetPassengerData,
  resetPassengerSeats, // New action for resetting seats
} = passengerSlice.actions;

export default passengerSlice.reducer;
