import { motion } from "framer-motion";
import {
  Armchair,
  ArrowLeft,
  ArrowRight,
  Check,
  Crown,
  DoorOpen,
  Plane,
  RefreshCw,
  Users,
  Wine,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  resetPassengerSeats,
  setSelectedSeat,
} from "../../store/passengerReducer";

const ReturnSeatBooking = () => {
  const { id, passengerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.flight);

  const { adults, children } = filters;
  const totalPassengers = Number(adults) + Number(children);

  const { adults: passengerAdults, children: passengerChildren } = useSelector(
    (state) => state.passenger
  );

  const currentPassengerIndex = parseInt(passengerId) - 1;
  const currentPassenger =
    currentPassengerIndex < passengerAdults.length
      ? passengerAdults[currentPassengerIndex]
      : passengerChildren[currentPassengerIndex - passengerAdults.length];

  // Get the selected flight from persisted data
  const persistedData =
    JSON.parse(localStorage.getItem("persist:flight")) || {};
  const selectedFlight = JSON.parse(persistedData.selectedFlight);

  const rows = [
    ["5A", "5B", "", "", "6C", "6D"],
    ["7A", "7B", "", "", "7E", "7F"],
    ["8A", "8B", "", "", "8E", "8F"],
    ["9A", "9B", "", "", "9E", "9F"],
    ["10A", "10B", "", "", "10E", "10F"],
    ["11A", "11B", "", "", "11E", "11F"],
    ["12A", "12B", "", "", "12E", "12F"],
    ["15A", "15B", "", "", "15E", "15F"],
    ["16A", "16B", "16C", "16D", "16E", "16F"],
    ["17A", "17B", "", "", "17E", "17F"],
    ["18A", "18B", "", "", "18E", "18F"],
    ["19A", "19B", "", "", "19E", "19F"],
    ["21A", "21B", "", "", "21E", "21F"],
    ["24A", "24B", "24C", "", "24D", "24E", "24F"],
    ["25A", "25B", "", "", "25E", "25F"],
    ["26A", "26B", "", "", "26E", "26F"],
    ["27A", "27B", "", "", "27E", "27F"],
    ["28A", "28B", "", "", "28E", "28F"],
    ["29A", "29B", "", "", "29E", "29F"],
  ];

  const businessRows = [
    ["1A", "1B", "1C", "1D", "1E"],
    ["2A", "2B", "2C", "2D", "2E"],
    ["3A", "3B", "3C", "3D", "3E"],
    ["4A", "4B", "4C", "4D", "4E"],
    ["5A", "5B", "5C", "5D", "5E"],
  ];

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [unavailableSeats, setUnavailableSeats] = useState([]);
  const [currentPassengerLocal, setCurrentPassenger] = useState(
    parseInt(passengerId)
  );
  const [bookedSeats, setBookedSeats] = useState([]);
  const [seatsLocked, setSeatsLocked] = useState(false);

  useEffect(() => {
    const generateUnavailableSeats = () => {
      const allSeats = rows.flat().filter((seat) => seat !== "");
      const randomUnavailableSeats = [];
      while (randomUnavailableSeats.length < 8) {
        const randomIndex = Math.floor(Math.random() * allSeats.length);
        const seat = allSeats[randomIndex];
        if (!randomUnavailableSeats.includes(seat)) {
          randomUnavailableSeats.push(seat);
        }
      }
      setUnavailableSeats(randomUnavailableSeats);
    };
    generateUnavailableSeats();
  }, [dispatch]);

  useEffect(() => {
    const newBookedSeats = selectedSeats.filter(Boolean);
    setBookedSeats(newBookedSeats);
    if (newBookedSeats.length === totalPassengers) {
      setSeatsLocked(true);
    }
  }, [selectedSeats, totalPassengers]);

  const handleSeatClick = (seat) => {
    if (
      !seat ||
      bookedSeats.includes(seat) ||
      unavailableSeats.includes(seat) ||
      seatsLocked
    ) {
      return;
    }

    dispatch(
      setSelectedSeat({
        passengerId: currentPassenger.travelerId,
        seatNumber: seat,
        segment: "return",
      })
    );

    const updatedSelectedSeats = [...selectedSeats];
    updatedSelectedSeats[currentPassengerLocal - 1] = seat;
    setSelectedSeats(updatedSelectedSeats);

    const updatedPassengerData =
      JSON.parse(localStorage.getItem("persist:passenger")) || {};
    updatedPassengerData.selectedSeats = updatedSelectedSeats;
    localStorage.setItem(
      "persist:passenger",
      JSON.stringify(updatedPassengerData)
    );

    if (currentPassengerLocal < totalPassengers) {
      const nextPassenger = currentPassengerLocal + 1;
      setCurrentPassenger(nextPassenger);
      navigate(`/returnSeatBooking/${id}/return/${nextPassenger}`);
    }
  };

  const handleResetSeat = () => {
    setSelectedSeats(new Array(totalPassengers).fill(""));
    setBookedSeats([]);
    setCurrentPassenger(1);
    setSeatsLocked(false);
    dispatch(resetPassengerSeats());
    navigate(`/seatBooking/${id}/1`);
  };

  const currentCabin =
    selectedFlight?.travelerPricings[0]?.fareDetailsBySegment[1]?.cabin;

  const getSeatStyles = (seat, isBusinessOrFirst) => {
    if (!seat) return "invisible";

    if (bookedSeats.includes(seat)) {
      return isBusinessOrFirst
        ? "bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-600 text-white shadow-lg shadow-emerald-200"
        : "bg-green-500 border-green-600 text-white";
    }

    if (unavailableSeats.includes(seat)) {
      return isBusinessOrFirst
        ? "bg-gradient-to-br from-red-400 to-red-500 border-red-500 text-white cursor-not-allowed shadow-lg shadow-red-200"
        : "bg-red-400 border-red-500 text-white cursor-not-allowed";
    }

    return isBusinessOrFirst
      ? "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 hover:from-gray-200 hover:to-gray-300 text-gray-700 shadow-lg hover:shadow-xl"
      : "bg-gray-200 border-gray-300 hover:bg-gray-300 text-gray-700";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto py-6 sm:py-8 flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* Main Content */}
        <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="flex-1">
          {/* Flight Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 sm:mb-8">
            <div
              className={`p-4 sm:p-6 ${
                currentCabin === "FIRST"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                  : currentCabin === "BUSINESS"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                  : "bg-gradient-to-r from-blue-600 to-blue-400"
              }`}
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center">
                  {currentCabin === "FIRST" ? (
                    <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  ) : currentCabin === "BUSINESS" ? (
                    <Wine className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  ) : (
                    <Plane className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    {selectedFlight.airlineName}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90 mt-1">
                    <span className="text-sm sm:text-base">
                      {
                        selectedFlight.itineraries[1].segments[0].departure
                          .iataCode
                      }
                    </span>
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-sm sm:text-base">
                      {
                        selectedFlight.itineraries[1].segments[0].arrival
                          .iataCode
                      }
                    </span>
                    <span className="text-xs sm:text-sm ml-2">
                      Flight{" "}
                      {selectedFlight.itineraries[1].segments[0].aircraft.code}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seat Selection Area */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 overflow-x-auto"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <div className="text-center mb-6 sm:mb-8">
              <h2
                className={`text-xl sm:text-2xl font-bold mb-2 ${
                  currentCabin === "FIRST"
                    ? "text-amber-800"
                    : currentCabin === "BUSINESS"
                    ? "text-indigo-900"
                    : "text-gray-800"
                }`}
              >
                Select Your Return{" "}
                {currentCabin.charAt(0) + currentCabin.slice(1).toLowerCase()}{" "}
                Class Seat
              </h2>
              <p className="text-sm sm:text-base text-gray-500">
                Passenger {currentPassengerLocal} of {totalPassengers}
              </p>
            </div>

            {/* Seat Map Legend */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${
                    currentCabin === "FIRST" || currentCabin === "BUSINESS"
                      ? "bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300"
                      : "bg-gray-200 border-2 border-gray-300"
                  }`}
                ></div>
                <span className="text-xs sm:text-sm text-gray-600">
                  Available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${
                    currentCabin === "FIRST" || currentCabin === "BUSINESS"
                      ? "bg-gradient-to-br from-emerald-500 to-green-600 border-2 border-emerald-600"
                      : "bg-green-500 border-2 border-green-600"
                  }`}
                ></div>
                <span className="text-xs sm:text-sm text-gray-600">
                  Selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${
                    currentCabin === "FIRST" || currentCabin === "BUSINESS"
                      ? "bg-gradient-to-br from-red-400 to-red-500 border-2 border-red-500"
                      : "bg-red-400 border-2 border-red-500"
                  }`}
                ></div>
                <span className="text-xs sm:text-sm text-gray-600">
                  Unavailable
                </span>
              </div>
            </div>

            {/* Airplane Body */}
            <div className="relative max-w-4xl mx-auto min-w-[320px]">
              {/* Airplane Nose */}
              <div
                className={`w-32 h-32 sm:w-48 sm:h-48 mx-auto mb-6 sm:mb-8 relative ${
                  currentCabin === "FIRST"
                    ? "bg-gradient-to-b from-amber-100 to-amber-200"
                    : currentCabin === "BUSINESS"
                    ? "bg-gradient-to-b from-indigo-100 to-indigo-200"
                    : "bg-gradient-to-b from-gray-100 to-gray-200"
                } rounded-t-full`}
              >
                <div
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-8 sm:h-12 rounded-t-lg flex items-center justify-center ${
                    currentCabin === "FIRST"
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                      : currentCabin === "BUSINESS"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                      : "bg-gradient-to-r from-blue-500 to-blue-600"
                  }`}
                >
                  <span className="text-sm sm:text-base text-white font-medium">
                    Cockpit
                  </span>
                </div>
              </div>

              {/* Exit Row Indicator - Front */}
              <div className="flex justify-between mb-4">
                <div className="flex items-center text-red-500">
                  <DoorOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Emergency Exit</span>
                </div>
                <div className="flex items-center text-red-500">
                  <DoorOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Emergency Exit</span>
                </div>
              </div>

              {/* Seat Grid */}
              <div
                className={`relative p-4 sm:p-6 lg:p-8 rounded-lg overflow-x-auto ${
                  currentCabin === "FIRST"
                    ? "bg-gradient-to-br from-amber-50 to-yellow-50"
                    : currentCabin === "BUSINESS"
                    ? "bg-gradient-to-br from-indigo-50 to-purple-50"
                    : "bg-gray-100"
                }`}
              >
                {/* Aisle Label */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs sm:text-sm font-medium text-gray-500">
                    Aisle
                  </span>
                </div>

                {/* Economy Seats */}
                {currentCabin === "ECONOMY" && (
                  <div className="space-y-3 sm:space-y-4">
                    {rows.map((row, rowIndex) => (
                      <motion.div
                        key={rowIndex}
                        className="flex justify-center gap-8 sm:gap-16"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: rowIndex * 0.02 }}
                      >
                        {/* Left Side Seats */}
                        <div className="flex gap-1 sm:gap-2">
                          {row.slice(0, 3).map((seat, seatIndex) => (
                            <motion.button
                              key={seatIndex}
                              whileHover={
                                seat &&
                                !unavailableSeats.includes(seat) &&
                                !bookedSeats.includes(seat)
                                  ? { scale: 1.1 }
                                  : {}
                              }
                              whileTap={
                                seat &&
                                !unavailableSeats.includes(seat) &&
                                !bookedSeats.includes(seat)
                                  ? { scale: 0.95 }
                                  : {}
                              }
                              onClick={() => handleSeatClick(seat)}
                              disabled={
                                !seat ||
                                unavailableSeats.includes(seat) ||
                                bookedSeats.includes(seat)
                              }
                              className={`
                                relative w-8 h-8 sm:w-12 sm:h-12 rounded-t-xl border-2 transition-all duration-200
                                ${getSeatStyles(seat, false)}
                              `}
                            >
                              <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-medium">
                                {seat}
                              </span>
                              <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-1 sm:h-2 bg-gray-300 rounded-b-sm"></div>
                            </motion.button>
                          ))}
                        </div>

                        {/* Right Side Seats */}
                        <div className="flex gap-1 sm:gap-2">
                          {row.slice(3).map((seat, seatIndex) => (
                            <motion.button
                              key={seatIndex}
                              whileHover={
                                seat &&
                                !unavailableSeats.includes(seat) &&
                                !bookedSeats.includes(seat)
                                  ? { scale: 1.1 }
                                  : {}
                              }
                              whileTap={
                                seat &&
                                !unavailableSeats.includes(seat) &&
                                !bookedSeats.includes(seat)
                                  ? { scale: 0.95 }
                                  : {}
                              }
                              onClick={() => handleSeatClick(seat)}
                              disabled={
                                !seat ||
                                unavailableSeats.includes(seat) ||
                                bookedSeats.includes(seat)
                              }
                              className={`
                                relative w-8 h-8 sm:w-12 sm:h-12 rounded-t-xl border-2 transition-all duration-200
                                ${getSeatStyles(seat, false)}
                              `}
                            >
                              <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-medium">
                                {seat}
                              </span>
                              <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-1 sm:h-2 bg-gray-300 rounded-b-sm"></div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Business Class Seats */}
                {currentCabin === "BUSINESS" && (
                  <div className="space-y-6 sm:space-y-8">
                    {businessRows.map((row, rowIndex) => (
                      <motion.div
                        key={rowIndex}
                        className="flex justify-center gap-12 sm:gap-20"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: rowIndex * 0.02 }}
                      >
                        {row.map((seat, seatIndex) => (
                          <motion.button
                            key={seatIndex}
                            whileHover={
                              seat &&
                              !unavailableSeats.includes(seat) &&
                              !bookedSeats.includes(seat)
                                ? { scale: 1.05, y: -5 }
                                : {}
                            }
                            whileTap={
                              seat &&
                              !unavailableSeats.includes(seat) &&
                              !bookedSeats.includes(seat)
                                ? { scale: 0.95 }
                                : {}
                            }
                            onClick={() => handleSeatClick(seat)}
                            disabled={
                              !seat ||
                              unavailableSeats.includes(seat) ||
                              bookedSeats.includes(seat)
                            }
                            className={`
                              relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl border-2 transition-all duration-300
                              ${getSeatStyles(seat, true)}
                            `}
                          >
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <Armchair
                                className={`w-6 h-6 sm:w-8 sm:h-8 mb-1 ${
                                  bookedSeats.includes(seat)
                                    ? "text-white"
                                    : unavailableSeats.includes(seat)
                                    ? "text-white"
                                    : "text-indigo-600"
                                }`}
                              />
                              <span className="text-xs sm:text-sm font-medium">
                                {seat}
                              </span>
                            </div>
                            <div className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-2 sm:h-3 bg-gray-300 rounded-b-sm"></div>
                          </motion.button>
                        ))}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* First Class Seats */}
                {currentCabin === "FIRST" && (
                  <div className="space-y-8 sm:space-y-10">
                    {businessRows.map((row, rowIndex) => (
                      <motion.div
                        key={rowIndex}
                        className="flex justify-center gap-16 sm:gap-24"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: rowIndex * 0.02 }}
                      >
                        {row.map((seat, seatIndex) => (
                          <motion.button
                            key={seatIndex}
                            whileHover={
                              seat &&
                              !unavailableSeats.includes(seat) &&
                              !bookedSeats.includes(seat)
                                ? { scale: 1.05, y: -5 }
                                : {}
                            }
                            whileTap={
                              seat &&
                              !unavailableSeats.includes(seat) &&
                              !bookedSeats.includes(seat)
                                ? { scale: 0.95 }
                                : {}
                            }
                            onClick={() => handleSeatClick(seat)}
                            disabled={
                              !seat ||
                              unavailableSeats.includes(seat) ||
                              bookedSeats.includes(seat)
                            }
                            className={`
                              relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl border-2 transition-all duration-300
                              ${getSeatStyles(seat, true)}
                            `}
                          >
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <Crown
                                className={`w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 ${
                                  bookedSeats.includes(seat)
                                    ? "text-white"
                                    : unavailableSeats.includes(seat)
                                    ? "text-white"
                                    : "text-amber-600"
                                }`}
                              />
                              <span className="text-sm sm:text-lg font-medium">
                                {seat}
                              </span>
                            </div>
                            <div className="absolute -bottom-2 sm:-bottom-4 left-0 right-0 h-2 sm:h-4 bg-gray-300 rounded-b-sm"></div>
                          </motion.button>
                        ))}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Exit Row Indicator - Back */}
              <div className="flex justify-between mt-4">
                <div className="flex items-center text-red-500">
                  <DoorOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Emergency Exit</span>
                </div>
                <div className="flex items-center text-red-500">
                  <DoorOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Emergency Exit</span>
                </div>
              </div>

              {/* Airplane Tail */}
              <div
                className={`w-24 h-24 sm:w-32 sm:h-32 mx-auto mt-6 sm:mt-8 ${
                  currentCabin === "FIRST"
                    ? "bg-gradient-to-b from-amber-200 to-amber-100"
                    : currentCabin === "BUSINESS"
                    ? "bg-gradient-to-b from-indigo-200 to-indigo-100"
                    : "bg-gradient-to-b from-gray-200 to-gray-100"
                } rounded-b-full`}
              ></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          className="w-full lg:w-96"
        >
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-8">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Users
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    currentCabin === "FIRST"
                      ? "text-amber-500"
                      : currentCabin === "BUSINESS"
                      ? "text-indigo-500"
                      : "text-blue-500"
                  }`}
                />
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  Passengers
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {passengerAdults
                  .concat(passengerChildren)
                  .map((passenger, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p between p-2 sm:p-3 rounded-xl ${
                        currentCabin === "FIRST"
                          ? "bg-amber-50"
                          : currentCabin === "BUSINESS"
                          ? "bg-indigo-50"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                            currentCabin === "FIRST"
                              ? "bg-amber-100"
                              : currentCabin === "BUSINESS"
                              ? "bg-indigo-100"
                              : "bg-blue-100"
                          }`}
                        >
                          <Users
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${
                              currentCabin === "FIRST"
                                ? "text-amber-500"
                                : currentCabin === "BUSINESS"
                                ? "text-indigo-500"
                                : "text-blue-500"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-medium text-gray-800">
                            {passenger.firstName} {passenger.lastName}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {selectedSeats[index] ? (
                              <span
                                className={
                                  currentCabin === "FIRST"
                                    ? "text-amber-500"
                                    : currentCabin === "BUSINESS"
                                    ? "text-indigo-500"
                                    : "text-blue-500"
                                }
                              >
                                Seat {selectedSeats[index]}
                              </span>
                            ) : (
                              <span className="text-gray-400">
                                No seat selected
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      {selectedSeats[index] ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleResetSeat}
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-red-600 transition-colors duration-200 text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                Reset Seats
              </motion.button>

              {seatsLocked && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/bookingsummary/${id}`)}
                  className={`w-full flex items-center justify-center gap-2 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-xl transition-colors duration-200 text-sm sm:text-base ${
                    currentCabin === "FIRST"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : currentCabin === "BUSINESS"
                      ? "bg-indigo-500 hover:bg-indigo-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  Go to Booking Summary
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/passenger/${id}`)}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-600 py-2 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Go Back
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReturnSeatBooking;
