import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  singleFlights: { data: [] },
  roundTripFlights: { data: [] },
  error: null,
  airports: [
    { type: "origin", cityName: "" },
    { type: "destination", cityName: "" },
  ],
  filters: {
    origin: "",
    destination: "",
    date: "",
    returnDate: "",
    adults: 1,
    children: 0,
    tripType: "oneWay",
    travelClass: "ECONOMY",
  },
  currencyCode: "INR",
  currencySymbol: "₹",
  selectedFlight: null,
};

const flightSlice = createSlice({
  name: "flightReducer",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }; // Update filters in Redux state
    },
    setSingleFlights: (state, action) => {
      state.singleFlights = action.payload;
    },
    setRoundTripFlights: (state, action) => {
      state.roundTripFlights = action.payload;
    },
    setAirports: (state, action) => {
      const { type, cityName } = action.payload;
      const airport = state.airports.find((air) => air.type === type);
      if (airport) airport.cityName = cityName;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSelectedFlight: (state, action) => {
      state.selectedFlight = action.payload;
    },
    setCurrencyCode: (state, action) => {
      state.currencyCode = action.payload;
    },
    setCurrencySymbol: (state, action) => {
      state.currencySymbol = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        origin: "",
        destination: "",
        date: "",
        returnDate: "",
        adults: 1,
        children: 0,
        tripType: "oneWay",
        travelClass: "ECONOMY",
      };
    },
    resetFlightsData: (state) => {
      state.singleFlights = { data: [] };
      state.roundTripFlights = { data: [] };
    },
  },
});

export const {
  setFilters,
  setSingleFlights,
  setRoundTripFlights,
  setError,
  setAirports,
  setSelectedFlight,
  setCurrencyCode,
  setCurrencySymbol,
  resetFilters,
  resetFlightsData,
} = flightSlice.actions;

export default flightSlice.reducer;
