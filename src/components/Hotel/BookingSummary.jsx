import { BedDouble, Building, Calendar, Info, Users } from "lucide-react";
import { useSelector } from "react-redux";

const BookingSummary = () => {
  const { adults, children, checkInDate, checkOutDate, numberOfNights } =
    useSelector((state) => state.hotel.filters);
  const selectedRoom = useSelector(
    (state) => state.hotel.selectedRoomWithHotel
  );

  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
        <Building className="text-gray-600 flex-shrink-0" size={24} />
        <div>
          <h3 className="font-medium">{selectedRoom?.hotel?.name}</h3>
          <p className="text-gray-600 text-sm">
            {selectedRoom?.room?.roomType}
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
        <BedDouble className="text-gray-600 flex-shrink-0" size={24} />
        <div>
          <h3 className="font-medium">{selectedRoom?.room?.bedType}</h3>
          <p className="text-gray-600 text-sm">
            {selectedRoom?.room?.roomSize}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
        <Calendar className="text-gray-600" size={24} />
        <div>
          <h3 className="font-medium">Stay Duration</h3>
          <p className="text-gray-600 text-sm">
            {formatDate(checkInDate)} - {formatDate(checkOutDate)}
          </p>
          <p className="text-gray-600 text-sm mt-1">
            {numberOfNights} {numberOfNights === 1 ? "night" : "nights"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
        <Users className="text-gray-600" size={24} />
        <div>
          <h3 className="font-medium">Guests</h3>
          <p className="text-gray-600 text-sm">
            {adults} Adults{children > 0 ? ` + ${children} Children` : ""}
          </p>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Room Rate</span>
          <span className="font-medium">
            ₹{selectedRoom?.offer?.price?.discounted}/night
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Number of Nights</span>
          <span className="font-medium">{numberOfNights}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Taxes & Fees</span>
          <span className="font-medium">
            ₹{selectedRoom?.offer?.price?.taxesAndFees * numberOfNights}
          </span>
        </div>
        <div className="flex justify-between items-center text-xl font-bold pt-4 border-t">
          <span>Total Amount</span>
          <span>₹{selectedRoom?.offer?.price?.total}</span>
        </div>
      </div>

      {selectedRoom?.offer?.cancellationPolicy && (
        <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 flex items-start space-x-3">
          <Info size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
          <p>{selectedRoom.offer.cancellationPolicy}</p>
        </div>
      )}
    </div>
  );
};

export default BookingSummary;
