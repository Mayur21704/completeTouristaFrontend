const bedTypes = [
  "Queen",
  "King",
  "Twin",
  "Double",
  "Single",
  "Bunk",
  "California King",
  "Full",
  "Super King",
];

const getRandomBedType = () =>
  bedTypes[Math.floor(Math.random() * bedTypes.length)];

export const roomTypes = [
  {
    roomType: "Standard",
    roomSize: "25m²",
    bedType: getRandomBedType(),
    highlights: [
      "City view",
      "Free Wi-Fi",
      "Private bathroom",
      "Air conditioning",
    ],
    description:
      "A comfortable room with modern amenities, perfect for short stays.",
    images: [
      "https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJlZHJvb218ZW58MHx8MHx8fDA%3D",
      "https://plus.unsplash.com/premium_photo-1661962493427-910e3333cf5a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg1fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjMyfHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D",
    ],
    cancellationPolicy: "Free cancellation within 24 hours.",
    amenities: [
      "Iron/Ironing Board",
      "Bathroom",
      "24-hour Housekeeping",
      "Laundry Service",
      "Mini Fridge",
      "TV",
      "Shaving Mirror",
      "Hairdryer",
      "Geyser/Water Heater",
      "Shower Cap",
      "Newspaper",
    ],
    offers: [
      {
        roomType: "Room Only",
        description: "Room Only package. Non-Refundable.",
        cancellationPolicy: "Non-Refundable.",
        inclusions: [
          {
            text: "Free Access to Theme Parks",
          },
          {
            text: "20% Off on Laundry service for 1 clothing item(s)",
          },
          {
            text: "Complimentary city map",
          },
          {
            text: "Free bottled water daily",
          },
          {
            text: "Complimentary toiletries",
          },
        ],
      },
      {
        roomType: "Room with Breakfast",
        description: "Room with Breakfast package. Non-Refundable.",

        cancellationPolicy: "Non-Refundable.",
        inclusions: [
          {
            text: "Free Access to Theme Parks",
          },
          {
            text: "10% Off on Spa services",
          },
          {
            text: "Breakfast with fresh fruits and juices",
          },
          {
            text: "Daily fruit basket replenished",
          },
          {
            text: "Free morning newspaper",
          },
        ],
      },
    ],
  },

  {
    roomType: "Deluxe",
    roomSize: "35m²",
    bedType: getRandomBedType(),
    highlights: [
      "Ocean view",
      "Private balcony",
      "Free Wi-Fi",
      "Air conditioning",
    ],
    description:
      "Spacious, luxurious room with stunning ocean views and a private balcony.",
    images: [
      "https://images.unsplash.com/photo-1557127275-f8b5ba93e24e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTUyfHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1661964402307-02267d1423f5?w=600&auto=format&fit=crop&q=60&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww",
      "https://images.unsplash.com/flagged/photo-1556438758-8d49568ce18e?w=600&auto=format&fit=crop&q=60&ixib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWwlMjByb29tfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=600&auto=format&fit=crop&q=60&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGhvdGVsfGVufDB8fDB8fHww",
    ],
    cancellationPolicy: "Free cancellation within 48 hours.",
    amenities: [
      "Bathtub",
      "Iron/Ironing Board",
      "Bathroom",
      "24-hour Housekeeping",
      "Laundry Service",
      "Mini Fridge",
      "Seating Area",
      "TV",
      "Shaving Mirror",
      "Hairdryer",
      "Geyser/Water Heater",
      "Jetspray",
      "Security",
    ],
    offers: [
      {
        roomType: "Room with Breakfast",
        description: "Room with Breakfast package. Non-Refundable.",

        cancellationPolicy: "Non-Refundable.",
        inclusions: [
          {
            text: "Free Access to Theme Parks",
          },
          {
            text: "10% Off on Spa services",
          },
          {
            text: "Breakfast with fresh fruits and juices",
          },
          {
            text: "Daily fruit basket replenished",
          },
          {
            text: "Free morning newspaper",
          },
        ],
      },

      {
        roomType: "Room with Breakfast + Dinner",
        description: "Room with Breakfast + Dinner package. Non-Refundable.",

        cancellationPolicy: "Non-Refundable.",
        inclusions: [
          {
            text: "Breakfast included with fresh fruits and juices",
          },
          {
            text: "3-course gourmet dinner for two",
          },
          {
            text: "Complimentary cocktails during dinner",
          },
          {
            text: "Free access to fitness center",
          },
        ],
      },
    ],
  },
  {
    roomType: "Suite",
    roomSize: "50m²",
    bedType: getRandomBedType(),
    highlights: [
      "Ocean view",
      "Private balcony",
      "Jacuzzi",
      "Free Wi-Fi",
      "Walk-in closet",
    ],
    description:
      "Luxurious suite with private jacuzzi and stunning views of the ocean.",
    images: [
      "https://images.unsplash.com/photo-1587874522487-fe10e954d035?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE4fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1562226243-285c9c57435f?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1521783988139-89397d761dce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fGhvdGVsfGVufDB8fDB8fHww",
    ],
    cancellationPolicy: "Free cancellation within 72 hours.",
    amenities: [
      "Bathtub",
      "Iron/Ironing Board",
      "Bathroom",
      "24-hour Housekeeping",
      "Laundry Service",
      "Mini Fridge",
      "Couch",
      "Seating Area",
      "Closet",
      "Electronic Safe",
      "Shaving Mirror",
      "Hairdryer",
      "Geyser/Water Heater",
      "Jetspray",
      "Security",
      "TV",
    ],
    offers: [
      {
        roomType: "Romantic Package",
        description:
          "Romantic getaway with dinner for two, champagne, and jacuzzi.",
        cancellationPolicy: "Non-Refundable.",
        inclusions: [
          {
            text: "Private jacuzzi access",
          },
          {
            text: "Champagne on arrival",
          },
          {
            text: "Gourmet 3-course dinner",
          },
          {
            text: "Personalized in-room flowers",
          },
          {
            text: "Late check-out",
          },
        ],
      },
      {
        roomType: "Suite with Breakfast",
        description: "Suite with Breakfast included. Non-Refundable.",

        cancellationPolicy: "Non-Refundable.",
        inclusions: [
          {
            text: "Free Breakfast with organic selections",
          },
          {
            text: "Daily fruit basket replenished",
          },
          {
            text: "Free high-speed Wi-Fi",
          },
          {
            text: "Complimentary bottled water daily",
          },
        ],
      },
    ],
  },

  {
    roomType: "Luxury Suite",
    roomSize: "75m²",
    bedType: getRandomBedType(),
    highlights: [
      "Mountain view",
      "Private jacuzzi",
      "Free Wi-Fi",
      "Walk-in closet",
      "Balcony",
    ],
    description:
      "A luxurious suite with private jacuzzi and unparalleled mountain views.",
    images: [
      "https://plus.unsplash.com/premium_photo-1661964225206-fd5d445a6edd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjV8fGhvdGVsfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1561501878-aabd62634533?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fGhvdGVsfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGhvdGVsfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1586611292717-f828b167408c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGhvdGVsfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE1fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D",
    ],
    cancellationPolicy: "Free cancellation within 72 hours.",
    amenities: [
      "Bathtub",
      "Iron/Ironing Board",
      "Bathroom",
      "24-hour Housekeeping",
      "Laundry Service",
      "Mini Fridge",
      "Couch",
      "Seating Area",
      "Closet",
      "Electronic Safe",
      "Safety",
      "Shaving Mirror",
      "Hairdryer",
      "Geyser/Water Heater",
      "Shower Cap",
      "Jetspray",
      "Security",
      "TV",
    ],
    offers: [
      {
        roomType: "Honeymoon Special",
        description: "Perfect for a romantic getaway with special amenities.",

        cancellationPolicy: "Non-Refundable.",
        inclusions: [
          {
            text: "Champagne and chocolate upon arrival",
          },
          {
            text: "Private jacuzzi and spa bath",
          },
          {
            text: "Complimentary candlelit dinner for two",
          },
          {
            text: "Rose petals on the bed",
          },
          {
            text: "Late check-out",
          },
        ],
      },
      {
        roomType: "Suite with Dinner",
        description: "Luxury suite with dinner included for two.",
        cancellationPolicy: "Non-Refundable.",
        inclusions: [
          {
            text: "3-course gourmet dinner for two",
          },
          {
            text: "Daily breakfast with gourmet options",
          },
          {
            text: "Private concierge service",
          },
          {
            text: "Complimentary airport transfers",
          },
        ],
      },
    ],
  },
];
