import { roomTypes } from "@/src/utils/roomTypes"; // Import the room types
import flightApi from "./flightApi";

const hotelApi = flightApi.injectEndpoints({
  reducerPath: "hotelList",
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: (params) => {
        let query = `/gethotels?city=${params}`;
        return query;
      },
      transformResponse: (response) => {
        const HotelDataForAdultsAndChildren = JSON.parse(
          localStorage.getItem("persist:hotel")
        ).filters;

        const ParsedData = JSON.parse(HotelDataForAdultsAndChildren);
        const { adults, children, numberOfNights } = ParsedData;

        const limitedResponse = response.slice(0, 5);

        return limitedResponse.map((hotel) => {
          const hotelImages = [
            "https://images.unsplash.com/photo-1607320895054-c5c543e9a069?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWwlMjBleHRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG90ZWwlMjBleHRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1570206986634-afd7cccb68d3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvdGVsJTIwZXh0ZXJpb3J8ZW58MHx8MHx8fDA%3D",
            "https://images.unsplash.com/photo-1570206982564-1c5d086f29d6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGhvdGVsJTIwZXh0ZXJpb3J8ZW58MHx8MHx8fDA%3D",
            "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGhvdGVsfGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1578774204375-826dc5d996ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODh8fGhvdGVsfGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1614957004131-9e8f2a13123c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fGhvdGVsfGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1614568112072-770f89361490?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAwfHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D",
          ];

          // Shuffle the images in the hotelImages array randomly
          const shuffledImages = hotelImages.sort(() => Math.random() - 0.5);

          // Select the first 5 images from the shuffled list
          const randomHotelImages = shuffledImages.slice(0, 5);

          // Select two random room types from the `roomTypes` array
          const randomRoomTypes = roomTypes
            .sort(() => Math.random() - 0.5)
            .slice(0, 2); // Select 2 random room types

          const allAmenities = [
            "Spa",
            "Swimming Pool",
            "Gym",
            "Restaurant",
            "Butler Services",
            "Newspaper",
            "Smoke Detector",
            "Housekeeping",
            "Paid Airport Transfers",
            "Paid Shuttle Service",
            "Kids Play Area",
            "Dining Area",
            "Coffee Shop",
            "Kids' Meals",
            "Barbeque",
            "Bakery",
            "Currency Exchange",
            "Electronic Keycard",
            "Fire Extinguishers",
            "Safe",
            "CCTV",
            "Security alarms",
            "Reflexology",
            "First-aid Services",
            "Entertainment",
            "Electrical Chargers",
            "Luggage Storage",
            "Wake-up Call",
            "Concierge",
            "Doctor on Call",
            "Steam and Sauna",
            "Massage",
            "Salon",
            "Vehicle Rentals",
            "Seating Area",
            "Lounge",
            "Balcony/Terrace",
            "Reception",
            "Printer",
            "Photocopying",
            "Conference Room",
            "Business Centre",
            "Fax Service",
            "Kid's Menu",
            "Security Guard",
            "Carbon Monoxide Detector",
          ];

          const randomCount = Math.floor(Math.random() * 9) + 7;
          const shuffledAmenities = allAmenities.sort(
            () => Math.random() - 0.5
          );
          const selectedAmenities = shuffledAmenities.slice(0, randomCount);

          const reviews = {
            totalRatings: (Math.random() * 3 + 2).toFixed(1),
          };

          // Helper function to generate room prices based on room type
          const getPriceForRoomType = (roomType) => {
            let minPrice, maxPrice;

            switch (roomType) {
              case "Standard":
                minPrice = 1000; // Lower price for standard rooms
                maxPrice = 4000;
                break;
              case "Deluxe":
                minPrice = 5000; // Medium price for deluxe rooms
                maxPrice = 8000;
                break;
              case "Luxury Suite":
                minPrice = 9000; // Higher price for luxury suites
                maxPrice = 14000;
                break;
              default:
                minPrice = 2000;
                maxPrice = 8000;
            }

            return (
              Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice
            );
          };

          // Adjusted Room Type logic
          const modifiedRoomTypes = randomRoomTypes.map((room) => ({
            ...room,
            offers: room.offers
              .map((offer) => {
                const roomPrice = getPriceForRoomType(room.roomType); // Get price based on room type
                const discountedPrice = Math.floor(
                  roomPrice * (Math.random() * (0.2 - 0.05) + 0.8)
                ); // Discounted price logic
                const taxesAndFees = Math.floor(
                  discountedPrice * (Math.random() * (0.15 - 0.05) + 0.05)
                ); // Random taxes between 5% to 15%
                const total = discountedPrice + taxesAndFees; // Final total price including taxes

                return {
                  ...offer,
                  price: {
                    discounted: discountedPrice,
                    taxesAndFees: taxesAndFees,
                    total: total * numberOfNights, // Final total price including taxes
                  },
                };
              })
              .sort((a, b) => a.price.total - b.price.total), // Sort offers by total price (ascending)
          }));

          return {
            name: hotel.name,
            geoCode: hotel.geoCode,
            hotelId: hotel.hotelId,
            hotelImages: randomHotelImages,
            amenities: selectedAmenities,
            rooms: modifiedRoomTypes, // Include the modified rooms with random prices
            reviews,
          };
        });
      },
    }),
  }),
});

export const { useLazyGetHotelsQuery } = hotelApi;
export default hotelApi;
