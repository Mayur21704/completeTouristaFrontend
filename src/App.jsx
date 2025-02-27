import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import the Navbar component

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure to import the CSS
import About from "./components/About";
import Admin from "./components/Admin/Admin";
import CheckoutPageHotel from "./components/Hotel/CheckoutPageHotel";
import HotelDetail from "./components/Hotel/HotelDetail";
import HotelPaymentSuccess from "./components/Hotel/HotelPaymentSuccess";
import HotelResult from "./components/Hotel/HotelResult";
import HotelSearch from "./components/Hotel/HotelSearch";
import SelectRoomWithHotel from "./components/Hotel/SelectRoomWithHotel";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute
import ResetPassword from "./components/ResetPassword";

const Register = lazy(() => import("./components/Register"));
const SignIn = lazy(() => import("./components/SignIn"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));

const Home = lazy(() => import("./components/Home"));
const Search = lazy(() => import("./components/Flight/Search"));
const FlightResult = lazy(() => import("./components/Flight/FlightResult"));
const FlightDetails = lazy(() => import("./components/Flight/FlightDetails"));
const SeatBooking = lazy(() => import("./components/SeatBooking"));
const PassengerInfo = lazy(() => import("./components/Flight/PassengerInfo"));
const ReturnSeatBooking = lazy(() => import("./components/ReturnSeatBooking"));
const BookingSummary = lazy(() => import("./components/BookingSummary"));
const CanceledPage = lazy(() => import("./components/CanceledPage"));
const Checkout = lazy(() => import("./components/Checkout"));
const PaymentSuccess = lazy(() => import("./components/PaymentSuccess"));
const Profile = lazy(() => import("./components/Profile"));

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword/:token" element={<ResetPassword />} />
            <Route path="/flightSearch" element={<Search />} />
            <Route path="/hotelSearch" element={<HotelSearch />} />
            <Route path="/about" element={<About />} />

            <Route
              path="/admin"
              element={<ProtectedRoute element={Admin} isAdminRoute={true} />}
            />

            {/* Protected Route */}
            <Route
              path="/flights"
              element={<ProtectedRoute element={FlightResult} />}
            />
            <Route
              path="/flightDetails/:id"
              element={<ProtectedRoute element={FlightDetails} />}
            />
            <Route
              path="/passenger/:id"
              element={<ProtectedRoute element={PassengerInfo} />}
            />
            <Route
              path="/seatBooking/:id/:passengerId"
              element={<ProtectedRoute element={SeatBooking} />}
            />
            <Route
              path="/returnSeatBooking/:id/return/:passengerId"
              element={<ProtectedRoute element={ReturnSeatBooking} />}
            />
            <Route
              path="/bookingsummary/:id"
              element={<ProtectedRoute element={BookingSummary} />}
            />
            <Route
              path="/profile/:userId"
              element={<ProtectedRoute element={Profile} />}
            />

            {/* Hotel  */}
            <Route
              path="/hotels"
              element={<ProtectedRoute element={HotelResult} />}
            />
            <Route
              path="/hotelDetail/:hotelId"
              element={<ProtectedRoute element={HotelDetail} />}
            />
            <Route
              path="/booking/:hotelId/:roomType"
              element={<ProtectedRoute element={SelectRoomWithHotel} />}
            />

            {/* payment route */}

            <Route
              path="/checkouthotel"
              element={<ProtectedRoute element={CheckoutPageHotel} />}
            />

            <Route
              path="/checkout"
              element={<ProtectedRoute element={Checkout} />}
            />
            <Route
              path="/success"
              element={<ProtectedRoute element={PaymentSuccess} />}
            />
            <Route
              path="/successhotel"
              element={<ProtectedRoute element={HotelPaymentSuccess} />}
            />
            <Route
              path="/canceled"
              element={<ProtectedRoute element={CanceledPage} />}
            />
          </Routes>
        </Suspense>

        <ToastContainer
          position="top-right"
          autoClose={1000}
          closeButton={false}
        />
      </div>
    </Router>
  );
};

export default App;
