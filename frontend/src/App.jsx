import { Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import RoleSelect from "./pages/RoleSelect";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import SpotSelection from "./pages/SpotSelection"; // Import the new page
import NearbyParking from "./pages/NearbyParking";
import PaymentPage from "./pages/PaymentPage";
import SimulatedGateway from "./pages/SimulatedGateway";
import BookingSuccess from "./pages/BookingSuccess";
import Services from "./pages/Services";
import YourBookings from "./pages/YourBookings";
import BookingReceipt from "./pages/BookingReceipt";
import ContactUs from "./pages/ContactUs";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/role" element={<RoleSelect />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/signup/:role" element={<Signup />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/spot-selection/:locationId" element={<SpotSelection />} />
      {/* Dynamic route for the specific parking location */}
     <Route path="/payment" element={<PaymentPage />} />
      <Route path="/nearby-parking" element={<NearbyParking />} />
      <Route path="/simulated-gateway" element={<SimulatedGateway />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      <Route path="/services" element={<Services />} />
      <Route path="/your-bookings" element={<YourBookings />} />
      <Route path="/booking-receipt" element={<BookingReceipt />} />
      <Route path="/contact-us" element={<ContactUs />} />
    </Routes>
  );
}

export default App;