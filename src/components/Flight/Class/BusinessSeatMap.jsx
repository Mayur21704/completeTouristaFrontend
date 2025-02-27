import { Armchair, Wine } from "lucide-react";

const BusinessSeatMap = () => {
  return (
    <div className="mb-8 border-b pb-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Wine className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-indigo-900">
            Business Class Seat Map
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur px-4 py-3 rounded-xl shadow-sm border border-indigo-100">
            <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform">
              <Armchair className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="font-medium text-indigo-900">Available Seat</span>
          </div>
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur px-4 py-3 rounded-xl shadow-sm border border-indigo-100">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform">
              <Armchair className="w-6 h-6 text-white" />
            </div>
            <span className="font-medium text-indigo-900">Selected Seat</span>
          </div>
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur px-4 py-3 rounded-xl shadow-sm border border-indigo-100">
            <div className="w-10 h-10 bg-red-400 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform">
              <Armchair className="w-6 h-6 text-white" />
            </div>
            <span className="font-medium text-indigo-900">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSeatMap;
