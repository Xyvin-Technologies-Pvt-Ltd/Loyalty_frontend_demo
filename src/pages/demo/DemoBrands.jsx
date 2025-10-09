import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import ProductCard from "../../components/User-Facing/ProductCard";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import sdkApi from "../../api/sdk";
import { useNavigationWithParams } from "../../utils/navigationUtils";

const DemoBrands = () => {
  const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(1);
  const [rows] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { customerID, apiKey } = useCustomerAuth();
  const navigate = useNavigate();
  const { navigateWithParams } = useNavigationWithParams();

  const fetchData = async (reset = false) => {
    try {
      setLoading(true);
      const brandData = await sdkApi.getBrands(customerID, apiKey, {
        page: reset ? 1 : page,
        limit: rows,
        search: searchTerm,
      });

      const newBrands = brandData.data || [];
      if (reset) {
        setBrands(newBrands);
      } else {
        setBrands((prev) => [...prev, ...newBrands]);
      }

      if (newBrands.length >= rows && !reset) {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch brand data:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (customerID && apiKey) {
      fetchData(true);
    }
  }, [customerID, apiKey, searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
    </div>
  );

  const NoBrandsFound = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 col-span-2">
      <div className="text-6xl text-purple-300 mb-4">🏢</div>
      <h3 className="text-lg font-semibold text-purple-200 mb-2">
        No brands found
      </h3>
      <p className="text-sm text-purple-300 text-center">
        Check back later for new brands and offers.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 poppins-text">
      {/* Header */}
      <div className="flex justify-between items-center p-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-full p-2 transition-all backdrop-blur-xl"
          >
            <ArrowLeftIcon className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white tracking-wide drop-shadow-md">
            Brands
          </h1>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-200" />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 outline-none backdrop-blur-md"
          />
        </div>
      </div>

      {/* Brand Grid */}
      <div className="px-4 pb-6">
        {initialLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {brands?.length === 0 ? (
              <NoBrandsFound />
            ) : (
              brands?.map((brand, index) => (
                <ProductCard
                  key={index}
                  product={brand}
                  onClick={() =>
                    navigateWithParams("/bank/offers", {
                      brand: brand?._id,
                    })
                  }
                />
              ))
            )}
          </div>
        )}
        {loading && !initialLoading && (
          <div className="px-4 pb-4">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoBrands;
