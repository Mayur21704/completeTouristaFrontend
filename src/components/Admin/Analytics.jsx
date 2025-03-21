import { useGetUsersAnalyticsQuery } from "@/src/store/api/adminApi";
import { motion } from "framer-motion";
import { Hotel, Map, Plane, TrendingUp, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

// Prepare data for charts
const prepareMonthlyUserData = (data) => {
  return data.monthlyUserData
    .slice()
    .reverse()
    .map((item) => ({
      name: `${item.month.substring(0, 3)} ${item.year}`,
      active: item.activeUsers,
      new: item.newUsers,
    }));
};

const prepareSalesDistribution = (data) => {
  return [
    { name: "Flight Bookings", value: data.totalFlightBookings },
    { name: "Hotel Bookings", value: data.totalHotelBookings },
  ];
};

const prepareMonthlyBookingsData = (data) => {
  const combinedData = [];

  // Combine flight and hotel bookings by month
  data.monthlyFlightBookingsData.forEach((flightItem) => {
    const monthYear = `${flightItem.month.substring(0, 3)} ${flightItem.year}`;
    const hotelItem = data.monthlyHotelBookingsData.find(
      (item) => item.month === flightItem.month && item.year === flightItem.year
    );

    combinedData.push({
      name: monthYear,
      flights: flightItem.flightBookings,
      hotels: hotelItem ? hotelItem.hotelBookings : 0,
    });
  });

  return combinedData.slice().reverse();
};

const Analytics = () => {
  // Use the actual data from the API response
  const { data, isLoading } = useGetUsersAnalyticsQuery();

  if (isLoading) {
    return <div>Loading</div>;
  }

  // Prepare data for charts
  const userActivityData = prepareMonthlyUserData(data);
  const salesDistribution = prepareSalesDistribution(data);
  const monthlyBookingsData = prepareMonthlyBookingsData(data);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold text-white">
                {data.totalUsers}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="flex items-center text-green-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+{data.newUsersPercentage}% new users</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Flight Bookings</p>
              <h3 className="text-2xl font-bold text-white">
                {data.totalFlightBookings}
              </h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Plane className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Hotel Bookings</p>
              <h3 className="text-2xl font-bold text-white">
                {data.totalHotelBookings}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Hotel className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Top Destinations</p>
              <h3 className="text-2xl font-bold text-white">
                {data.topDestinations.length}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <Map className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div className="flex items-center text-green-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+8% new destinations</span>
          </div>
        </motion.div>
      </div>

      {/* User Activity and Booking Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-6 rounded-xl shadow-xl"
        >
          <h3 className="text-xl font-bold text-white mb-6">User Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={userActivityData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#6e98d2",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ color: "#fff" }}
                formatter={(value) => [value, ""]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="new"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.2}
                name="New Users"
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="active"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
                name="Active Users"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 p-6 rounded-xl shadow-xl"
        >
          <h3 className="text-xl font-bold text-white mb-6">
            Booking Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {salesDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ color: "#fff" }}
                formatter={(value) => [value, "Bookings"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Monthly Bookings and Top Destinations */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 p-6 rounded-xl shadow-xl"
        >
          <h3 className="text-xl font-bold text-white mb-6">
            Monthly Bookings
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyBookingsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend />
              <Bar
                dataKey="flights"
                name="Flight Bookings"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="hotels"
                name="Hotel Bookings"
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
