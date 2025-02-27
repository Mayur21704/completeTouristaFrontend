import { FaTimesCircle } from "react-icons/fa";

const CanceledPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-red-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <FaTimesCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Payment Canceled
        </h2>
        <p className="text-gray-500">
          It looks like you canceled the payment. Please try again later.
        </p>
      </div>
    </div>
  );
};

export default CanceledPage;
