import { useGetUsersQuery } from "@/src/store/api/adminApi";
import { Mail, MoreVertical, Phone } from "lucide-react";

const UserManagement = () => {
  const { data, isLoading } = useGetUsersQuery();
  // console.log(data);
  const userss = data?.users;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">User Management</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-4">User</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Last Active</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody>
              {userss.map((user) => (
                <tr key={user.id} className="border-b border-gray-700">
                  <td className="py-4">
                    <div className="flex items-center">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-white font-medium">
                          {user.name}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-gray-400">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.status === "active"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-white">{user.role}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-gray-400">{user.lastActive}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
