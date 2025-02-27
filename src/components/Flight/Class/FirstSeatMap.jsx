import { Armchair, Crown } from "lucide-react";

const FirstSeatMap = () => {
  return (
    <div className="mb-8 border-b pb-6">
      <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-xl p-6 border border-amber-200">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Crown className="w-7 h-7 text-amber-600" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
            First Class Seat Map
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <div className="group flex items-center space-x-3 bg-white px-5 py-4 rounded-2xl shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Armchair className="w-7 h-7 text-amber-600" />
            </div>
            <span className="font-semibold text-gray-800">Available Seat</span>
          </div>
          <div className="group flex items-center space-x-3 bg-white px-5 py-4 rounded-2xl shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Armchair className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-gray-800">Selected Seat</span>
          </div>
          <div className="group flex items-center space-x-3 bg-white px-5 py-4 rounded-2xl shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Armchair className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-gray-800">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstSeatMap;
