import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local storage for persistence
import guestReducer from "./GuestReducer"; // Import the new passenger slice
import adminApi from "./api/adminApi";
import authApi from "./api/authApi";
import { bookingApi } from "./api/bookingApi";
import flightApi from "./api/flightApi";
import hotelApi from "./api/hotelApi";
import hotelpaymentApi from "./api/hotelPaymentApi";
import hotelbookingApi from "./api/hotelbookingApi";
import authReducer from "./authReducer";
import flightBookingReducer from "./flightBookingSlice";
import flightReducer from "./flightReducer";
import hotelBookingReducer from "./hotelBookingSlice"; // Import the new passenger slice
import hotelReducer from "./hotelReducer";
import passengerReducer from "./passengerReducer"; // Import the new passenger slice

// Define separate persist configs for flight and passenger reducers
const flightPersistConfig = {
  key: "flight", // Unique key for flight data
  storage, // Local storage to store the data
};
const flightBookingPersistConfig = {
  key: "flightBooking", // Unique key for flight data
  storage, // Local storage to store the data
};
const hotelPersistConfig = {
  key: "hotel", // Unique key for flight data
  storage, // Local storage to store the data
};
const hotelBookingPersistConfig = {
  key: "hotelBooking", // Unique key for flight data
  storage, // Local storage to store the data
};

const passengerPersistConfig = {
  key: "passenger", // Unique key for passenger data
  storage, // Local storage to store the data
};
const guestPersistConfig = {
  key: "guest", // Unique key for passenger data
  storage, // Local storage to store the data
};
const authPersistConfig = {
  key: "auth", // Unique key for passenger data
  storage, // Local storage to store the data
};

// Persist the flightReducer and passengerReducer with different keys
const persistedFlightReducer = persistReducer(
  flightPersistConfig,
  flightReducer
);
const persistedFlightBookingReducer = persistReducer(
  flightBookingPersistConfig,
  flightBookingReducer
);
const persistedHotelBookingReducer = persistReducer(
  hotelBookingPersistConfig,
  hotelBookingReducer
);
const persistedHotelReducer = persistReducer(hotelPersistConfig, hotelReducer);

const persistedPassengerReducer = persistReducer(
  passengerPersistConfig,
  passengerReducer
);
const persistedGuestReducer = persistReducer(guestPersistConfig, guestReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Configure the store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // No persistence for authReducer
    flight: persistedFlightReducer, // Persisted flightReducer with its own key
    booking: persistedFlightBookingReducer,
    hotelbooking: persistedHotelBookingReducer,
    passenger: persistedPassengerReducer, // Persisted passengerReducer with its own key
    hotel: persistedHotelReducer,
    guest: persistedGuestReducer,
    [flightApi.reducerPath]: flightApi.reducer, // API slice reducer
    [bookingApi.reducerPath]: bookingApi.reducer,
    [hotelbookingApi.reducerPath]: hotelbookingApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [hotelApi.reducerPath]: hotelApi.reducer,
    [hotelpaymentApi.reducerPath]: hotelpaymentApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      flightApi.middleware,
      bookingApi.middleware,
      hotelbookingApi.middleware,
      hotelApi.middleware,
      hotelpaymentApi.middleware,
      adminApi.middleware
    ), // Add the API middleware
});

// Create the persistor
export const persistor = persistStore(store);
