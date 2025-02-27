import axios from "axios";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useSelector } from "react-redux";

// Location Component
const Location = () => {
  const hotel = useSelector((state) => state.hotel.selectedHotel);
  const [locationInfo, setLocationInfo] = useState(null);

  useEffect(() => {
    const fetchLocationInfo = async () => {
      const lat = hotel.geoCode?.latitude;
      const lon = hotel.geoCode?.longitude;
      try {
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=b1848a3076274113bdfc659c3e0731bb`
        );
        setLocationInfo(response.data.results[0]);
      } catch (error) {
        console.error("Error fetching location info", error);
      }
    };

    if (hotel.geoCode) {
      fetchLocationInfo();
    }
  }, [hotel]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 py-16"
    >
      <h2 className="text-4xl font-bold mb-12 text-center">Location</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">How to Reach Us</h3>
            <div className="space-y-6">
              {/* Address Section */}
              <div className="flex items-start space-x-4">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Address</h4>
                  {locationInfo ? (
                    <p className="text-gray-600 leading-relaxed">
                      {locationInfo.formatted}
                    </p>
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      Address information is not available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="h-[500px] relative">
          <MapContainer
            center={[
              hotel.geoCode?.latitude || 0,
              hotel.geoCode?.longitude || 0,
            ]}
            zoom={14}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[
                hotel.geoCode?.latitude || 0,
                hotel.geoCode?.longitude || 0,
              ]}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-2">{hotel.name}</h3>
                  <p className="text-sm text-gray-600">
                    Luxury Hotel in{" "}
                    {locationInfo?.components?.city || "Unknown City"}
                  </p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </motion.section>
  );
};

export default Location;
