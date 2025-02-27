import { Armchair } from "lucide-react";

const EconomySeatMap = () => {
  return (
    <div className="mb-8 border-b pb-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
        <h3 className="text-xl font-bold text-blue-800 text-center mb-4">
          Economy Class Seat Map
        </h3>
        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <Armchair className="w-5 h-5 text-gray-600" />
            </div>
            <span className="font-medium text-gray-700">Available Seat</span>
          </div>
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Armchair className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-700">Selected Seat</span>
          </div>
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-red-400 rounded-lg flex items-center justify-center">
              <Armchair className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-700">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EconomySeatMap;
