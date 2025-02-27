import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { airlines } from "../../utils/airline"; // Assuming this is a list of available airlines with their names and logos
const flightApi = createApi({
  reducerPath: "flightSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://completouristabackend.onrender.com/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Attach the token to the Authorization header
      }
      return headers;
    },
  }),
  tagTypes: ["Flight", "Airports"],
  endpoints: (builder) => ({
    getAirports: builder.query({
      query: (params) => `/searchCity?keyword=${params.keyword}`,
      providesTags: ["Airports"],
      // Add error handling or validation if needed
      transformResponse: (response) => {
        if (response.error) {
          console.error("Error fetching airports:", response.error);
          throw new Error("Unable to fetch airports");
        }
        return response;
      },
    }),

    getSingleFlights: builder.query({
      query: (params) => {
        const {
          origin,
          destination,
          date,
          adults,
          children,
          travelClass,
          currencyCode,
        } = params;

        let queryUrl = `/flightOffers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=${adults}&travelClass=${
          travelClass || "ECONOMY"
        }&currencyCode=${currencyCode}`;

        if (children > 0) {
          queryUrl += `&children=${children}`;
        }

        return queryUrl;
      },
      providesTags: ["Flight"],
      transformResponse: (response) => {
        const flightsWithAirlines = [];
        const addedPrices = new Set();

        response.data.forEach((flight) => {
          const randomAirline =
            airlines[Math.floor(Math.random() * airlines.length)];
          const flightPrice = parseFloat(flight.price.total);

          // Calculate the updated flight price
          let updatedFlightPrice = flightPrice;

          // Ensure the new price doesn't already exist (to avoid duplicates)
          if (addedPrices.has(updatedFlightPrice.toFixed(2))) return;

          flightsWithAirlines.push({
            ...flight,
            price: {
              ...flight.price,
              total: updatedFlightPrice.toFixed(2), // Updated total price
            },
            airlineName: randomAirline.name,
            airlineLogo: randomAirline.logo,
          });

          addedPrices.add(updatedFlightPrice.toFixed(2));
        });

        return { ...response, data: flightsWithAirlines };
      },
    }),

    // Round-trip flights endpoint
    getRoundFlights: builder.query({
      query: (params) => {
        const {
          origin,
          destination,
          date,
          adults,
          children,
          travelClass,
          returnDate,
          currencyCode,
        } = params;
        let queryUrl = `/flightOffers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&returnDate=${returnDate}&adults=${adults}&travelClass=${
          travelClass || "ECONOMY"
        }&currencyCode=${currencyCode}`;
        if (children > 0) queryUrl += `&children=${children}`;
        return queryUrl;
      },
      providesTags: ["Flight"],
      // transformResponse: (response) => {
      //   const roundTripsWithAirlines = response.data.map((flight) => {

      //     const randomAirline =
      //       airlines[Math.floor(Math.random() * airlines.length)];

      //     const updatedItineraries = flight.itineraries.map((itinerary) => {
      //       const updatedSegments = itinerary.segments.map((segment) => ({
      //         ...segment,
      //         airlineName: randomAirline.name,
      //         airlineLogo: randomAirline.logo,
      //       }));
      //       return { ...itinerary, segments: updatedSegments };
      //     });
      //     return {
      //       ...flight,
      //       itineraries: updatedItineraries,
      //       airlineName: randomAirline.name,
      //       airlineLogo: randomAirline.logo,
      //     };
      //   });
      //   return { ...response, data: roundTripsWithAirlines };
      // },
      transformResponse: (response) => {
        const flightsWithAirlines = [];
        const addedPrices = new Set();

        response.data.forEach((flight) => {
          const randomAirline =
            airlines[Math.floor(Math.random() * airlines.length)];
          const flightPrice = parseFloat(flight.price.total);
          // Calculate the updated flight price
          let updatedFlightPrice = flightPrice;

          // Ensure the new price doesn't already exist (to avoid duplicates)
          if (addedPrices.has(updatedFlightPrice.toFixed(2))) return;

          flightsWithAirlines.push({
            ...flight,
            price: {
              ...flight.price,
              total: updatedFlightPrice.toFixed(2), // Updated total price
            },
            airlineName: randomAirline.name,
            airlineLogo: randomAirline.logo,
          });
          addedPrices.add(updatedFlightPrice.toFixed(2));
        });
        return { ...response, data: flightsWithAirlines };
      },
    }),
  }),
});

export const {
  useLazyGetSingleFlightsQuery,
  useLazyGetRoundFlightsQuery,
  useLazyGetAirportsQuery,
} = flightApi;
export default flightApi;
