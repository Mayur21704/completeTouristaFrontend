import cc from "currency-codes";
import getSymbolFromCurrency from "currency-symbol-map";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrencyCode, setCurrencySymbol } from "../store/flightReducer";

const CurrencySelector = () => {
  const [currencies, setCurrencies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const [selectedCurrency, setSelectedCurrency] = useState(null); // Store selected currency temporarily
  const [searchQuery, setSearchQuery] = useState(""); // To handle keyboard input

  const dispatch = useDispatch();
  const currencyCode = useSelector((state) => state.flight.currencyCode);

  // Fetch the currency codes when the component mounts
  useEffect(() => {
    const currencyList = cc.codes();
    setCurrencies(currencyList);
  }, []);

  // Handle the selection of a currency
  const handleCurrencyChange = (currencyCode) => {
    setSelectedCurrency(currencyCode);
  };

  // Confirm the selection and update the state
  const confirmCurrency = () => {
    if (selectedCurrency) {
      dispatch(setCurrencyCode(selectedCurrency));
      dispatch(setCurrencySymbol(getSymbolFromCurrency(selectedCurrency)));
    }
    setIsModalOpen(false); // Close the modal after selection
  };

  // Handle search query and focus on matching option
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter currencies based on the search query
  const filteredCurrencies = currencies.filter((currencyCode) => {
    return currencyCode.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="currency-selector fixed top-4 right-4 z-50">
      {/* Display selected currency or a button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 bg-blue-500 text-white rounded-md shadow-md flex justify-end "
      >
        {currencyCode ? `${currencyCode}` : "Select Currency"}
      </button>

      {/* Modal popup */}
      {isModalOpen && (
        <div className="modal fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-center mb-4">
              Select Currency
            </h3>

            {/* Search input */}
            <input
              type="text"
              placeholder="Search currency (e.g., USD)"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            {/* Currency List */}
            <div className="currency-list overflow-y-auto max-h-60 mb-4">
              {filteredCurrencies.map((currencyCode) => {
                const currency = cc.code(currencyCode);
                const countries = currency.countries
                  ? currency.countries.join(", ")
                  : "";
                const isSelected = selectedCurrency === currencyCode;

                return (
                  <div
                    key={currencyCode}
                    className={`cursor-pointer p-2 hover:bg-gray-100 rounded-md ${
                      isSelected ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleCurrencyChange(currencyCode)}
                  >
                    {currencyCode} - {countries}
                  </div>
                );
              })}
            </div>

            {/* Buttons to confirm or close */}
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmCurrency}
                className="p-2 bg-blue-500 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
