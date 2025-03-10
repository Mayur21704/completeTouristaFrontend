import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  Briefcase,
  Calendar,
  Clock,
  Filter,
  MapPin,
  Plane,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useLazyGetRoundFlightsQuery,
  useLazyGetSingleFlightsQuery,
} from "../../store/api/flightApi";
import {
  setFilters,
  setRoundTripFlights,
  setSelectedFlight,
  setSingleFlights,
} from "../../store/flightReducer";

const FlightResult = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filters, currencyCode, currencySymbol } = useSelector(
    (state) => state.flight
  );
  const [lastFilters, setLastFilters] = useState(filters);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterChanging, setIsFilterChanging] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState("");

  const handleMoreDetailsClick = (flight) => {
    dispatch(setSelectedFlight(flight));
    navigate(`/flightDetails/${flight.id}`);
  };

  const [
    getSingleFlights,
    { data: singleFlightData, isLoading: isSingleLoading },
  ] = useLazyGetSingleFlightsQuery();
  const [
    getRoundFlights,
    { data: roundFlightData, isLoading: isRoundLoading },
  ] = useLazyGetRoundFlightsQuery();

  // Function to fetch flights based on current filters
  const fetchFlights = () => {
    setIsLoading(true);

    const commonParams = {
      origin: filters.origin,
      destination: filters.destination,
      date: filters.date,
      adults: filters.adults,
      travelClass: filters.travelClass,
      currencyCode,
    };

    if (filters.children > 0) {
      commonParams.children = filters.children;
    }

    if (filters.tripType === "oneWay") {
      getSingleFlights(commonParams)
        .unwrap()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    } else {
      const roundTripParams = {
        ...commonParams,
        returnDate: filters.returnDate,
      };
      getRoundFlights(roundTripParams)
        .unwrap()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchFlights();
  }, []);

  // Handle filter changes
  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(lastFilters)) {
      setLastFilters(filters);
      setIsFilterChanging(true);

      // Add a small delay to prevent rapid API calls and ensure UI updates
      const timer = setTimeout(() => {
        fetchFlights();
        setIsFilterChanging(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [
    filters.tripType,
    filters.origin,
    filters.destination,
    filters.date,
    filters.returnDate,
    filters.adults,
    filters.travelClass,
    filters.children,
    currencyCode,
  ]);

  // Update redux store with API results
  useEffect(() => {
    if (filters.tripType === "oneWay" && singleFlightData) {
      dispatch(setSingleFlights({ data: singleFlightData?.data || [] }));
    } else if (filters.tripType === "roundTrip" && roundFlightData) {
      dispatch(setRoundTripFlights({ data: roundFlightData?.data || [] }));
    }
  }, [singleFlightData, roundFlightData, filters.tripType, dispatch]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "airline") {
      setSelectedAirline(checked ? value : "");
    } else {
      // Set loading state immediately when filter changes
      setIsLoading(true);

      dispatch(setFilters({ [name]: value }));
    }
  };

  const flights =
    filters.tripType === "oneWay"
      ? singleFlightData?.data || []
      : roundFlightData?.data || [];

  const filteredAndSortedFlights = useMemo(() => {
    let result = [...flights];

    // Apply airline filter if selected
    if (selectedAirline) {
      result = result.filter(
        (flight) => flight.airlineName === selectedAirline
      );
    }

    // Apply price sorting
    result.sort((a, b) => {
      const priceA = parseFloat(a.price?.total);
      const priceB = parseFloat(b.price?.total);
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });

    return result;
  }, [flights, selectedAirline, sortOrder]);

  const airlines =
    flights.length > 0
      ? [...new Set(flights.map((flight) => flight.airlineName))]
      : [];

  const date = new Date(filters.date);
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Show loading state when any loading state is true
  if (isSingleLoading || isRoundLoading || isLoading || isFilterChanging) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
          <div className="relative w-20 h-20">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0"
            >
              <Plane className="w-20 h-20 text-blue-500" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-lg font-medium text-gray-700"
          >
            {isFilterChanging
              ? "Updating your search..."
              : "Finding the best flights..."}
          </motion.p>
        </div>
      </div>
    );
  }

  if (filteredAndSortedFlights.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center"
          >
            <Plane className="w-12 h-12 text-blue-500 transform rotate-45" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No Flights Found
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any flights matching your criteria. Try adjusting
            your search parameters.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/flightSearch")}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium shadow-lg hover:bg-blue-600 transition-all duration-200"
          >
            Modify Search
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
      className="min-h-screen bg-gray-50"
    >
      {/* Flight Summary Header */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -20 },
          show: { opacity: 1, y: 0 },
        }}
        className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">
                  {filters.origin} → {filters.destination}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>
                  {filters.adults +
                    (filters.children > 0 ? ` + ${filters.children}` : "")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>{filters.travelClass}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="flex items-center px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-sm"
              >
                <ArrowUpDown className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">
                  Price: {sortOrder === "asc" ? "Low to High" : "High to Low"}
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="md:hidden flex items-center px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-sm"
              >
                <Filter className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">Filters</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            <motion.div
              initial={false}
              animate={{
                x: isFilterOpen ? 0 : window.innerWidth >= 768 ? 0 : -300,
                opacity: isFilterOpen ? 1 : window.innerWidth >= 768 ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`w-full md:w-80 bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-xl ${
                isFilterOpen
                  ? "fixed md:relative inset-0 z-50 md:z-auto overflow-y-auto"
                  : "hidden md:block"
              }`}
            >
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
                {isFilterOpen && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsFilterOpen(false)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </motion.button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Class
                  </label>
                  <select
                    name="travelClass"
                    value={filters.travelClass || ""}
                    onChange={handleFilterChange}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white hover:border-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="BUSINESS">Business</option>
                    <option value="ECONOMY">Economy</option>
                    <option value="FIRST">First</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Airlines ({airlines.length})
                  </h4>
                  <div className="space-y-3">
                    {airlines.map((airline, idx) => (
                      <motion.label
                        key={idx}
                        className="flex items-center cursor-pointer group rounded-lg p-2 hover:bg-blue-50 transition-colors duration-200"
                        whileHover={{ x: 5 }}
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-500 border-gray-300 rounded transition-colors duration-200 focus:ring-blue-500"
                          onChange={handleFilterChange}
                          name="airline"
                          value={airline}
                          checked={selectedAirline === airline}
                        />
                        <span className="ml-3 text-sm text-gray-600 group-hover:text-blue-500 transition-colors duration-200">
                          {airline}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Showing</span>
                    <span className="font-medium text-blue-500">
                      {filteredAndSortedFlights.length} flights
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Flight Results */}
          <div className="flex-1 space-y-6">
            <AnimatePresence>
              {filteredAndSortedFlights.map((flight, index) => {
                const itineraries = flight.itineraries;
                const firstLeg = itineraries[0].segments[0];
                const returnLeg = itineraries[1]?.segments[0];

                const departureDateFirstLeg = new Date(firstLeg.departure.at);
                const arrivalDateFirstLeg = new Date(firstLeg.arrival.at);
                const departureTimeFirstLeg =
                  departureDateFirstLeg.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                const arrivalTimeFirstLeg =
                  arrivalDateFirstLeg.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                const departureDateReturnLeg = returnLeg
                  ? new Date(returnLeg.departure.at)
                  : null;
                const arrivalDateReturnLeg = returnLeg
                  ? new Date(returnLeg.arrival.at)
                  : null;
                const departureTimeReturnLeg =
                  departureDateReturnLeg?.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                const arrivalTimeReturnLeg =
                  arrivalDateReturnLeg?.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                const durationFirstLeg = itineraries[0].duration;
                const durationReturnLeg = itineraries[1]?.duration;

                return (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-400 transition-all duration-300 shadow-lg"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Airline Info */}
                      <motion.div
                        className="flex items-center"
                        whileHover={{ x: 5 }}
                      >
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mr-4 border-2 border-blue-100"
                        >
                          {flight.airlineLogo ? (
                            <img
                              src={flight.airlineLogo}
                              alt={flight.airlineName}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <Plane className="w-8 h-8 text-blue-500" />
                          )}
                        </motion.div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {flight.airlineName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Flight {firstLeg.aircraft.code}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                              {filters.travelClass}
                            </span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Flight Times */}
                      <div className="flex-1 space-y-6">
                        {/* Outbound Flight */}
                        <motion.div className="relative" whileHover={{ y: -5 }}>
                          <div className="flex items-center justify-between max-w-md mx-auto">
                            <div className="text-center">
                              <motion.div
                                className="flex items-center space-x-2"
                                whileHover={{ scale: 1.05 }}
                              >
                                <Clock className="w-4 h-4 text-blue-500" />
                                <p className="text-xl font-bold text-gray-800">
                                  {departureTimeFirstLeg}
                                </p>
                              </motion.div>
                              <p className="text-sm font-medium text-gray-500">
                                {firstLeg.departure.terminal
                                  ? `Terminal ${firstLeg.departure.terminal}`
                                  : filters.origin}
                              </p>
                            </div>

                            <motion.div
                              className="flex-1 mx-4"
                              whileHover={{ scale: 1.1 }}
                            >
                              <div className="relative flex items-center">
                                <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>
                                <motion.div
                                  animate={{
                                    x: [0, 100, 0],
                                    y: [0, -10, 0],
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                  className="absolute w-full"
                                >
                                  <Plane className="w-5 h-5 text-blue-500 transform -rotate-90" />
                                </motion.div>
                              </div>
                              <p className="text-center text-sm font-medium text-blue-500 mt-2">
                                {durationFirstLeg}
                              </p>
                            </motion.div>

                            <div className="text-center">
                              <motion.div
                                className="flex items-center space-x-2"
                                whileHover={{ scale: 1.05 }}
                              >
                                <Clock className="w-4 h-4 text-blue-500" />
                                <p className="text-xl font-bold text-gray-800">
                                  {arrivalTimeFirstLeg}
                                </p>
                              </motion.div>
                              <p className="text-sm font-medium text-gray-500">
                                {firstLeg.arrival.terminal
                                  ? `Terminal ${firstLeg.arrival.terminal}`
                                  : filters.destination}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Return Flight */}
                        {filters.tripType === "roundTrip" && returnLeg && (
                          <motion.div
                            className="relative pt-6 mt-6 border-t border-gray-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="flex items-center justify-between max-w-md mx-auto">
                              <div className="text-center">
                                <motion.div
                                  className="flex items-center space-x-2"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <Clock className="w-4 h-4 text-blue-500" />
                                  <p className="text-xl font-bold text-gray-800">
                                    {departureTimeReturnLeg}
                                  </p>
                                </motion.div>
                                <p className="text-sm font-medium text-gray-500">
                                  {returnLeg.departure.terminal
                                    ? `Terminal ${returnLeg.departure.terminal}`
                                    : filters.destination}
                                </p>
                              </div>

                              <motion.div
                                className="flex-1 mx-4"
                                whileHover={{ scale: 1.1 }}
                              >
                                <div className="relative flex items-center">
                                  <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>
                                  <motion.div
                                    animate={{
                                      x: [100, 0, 100],
                                      y: [0, -10, 0],
                                    }}
                                    transition={{
                                      duration: 3,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                    className="absolute w-full"
                                  >
                                    <Plane className="w-5 h-5 text-blue-500 transform rotate-90" />
                                  </motion.div>
                                </div>
                                <p className="text-center text-sm font-medium text-blue-500 mt-2">
                                  {durationReturnLeg}
                                </p>
                              </motion.div>

                              <div className="text-center">
                                <motion.div
                                  className="flex items-center space-x-2"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <Clock className="w-4 h-4 text-blue-500" />
                                  <p className="text-xl font-bold text-gray-800">
                                    {arrivalTimeReturnLeg}
                                  </p>
                                </motion.div>
                                <p className="text-sm font-medium text-gray-500">
                                  {returnLeg.arrival.terminal
                                    ? `Terminal ${returnLeg.arrival.terminal}`
                                    : filters.origin}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Price and Button */}
                      <motion.div
                        className="flex flex-col items-center lg:items-end gap-3"
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.div
                          className="text-center lg:text-right"
                          whileHover={{ y: -2 }}
                        >
                          <p className="text-sm font-medium text-gray-500">
                            Total Price
                          </p>
                          <p className="text-3xl font-bold text-gray-900">
                            {currencySymbol} {flight.price?.total}
                          </p>
                        </motion.div>
                        <motion.button
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: "#2563EB",
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMoreDetailsClick(flight)}
                          className="w-full lg:w-auto px-8 py-3 bg-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          Select Flight
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightResult;
