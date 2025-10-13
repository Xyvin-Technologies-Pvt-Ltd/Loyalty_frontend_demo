import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import sdkApi from "../../api/sdk";
import OfferView from "../../components/User-Facing/OfferView";

const DemoOffers = () => {
  const [activeCategory, setActiveCategory] = useState("");
  const [offerData, setOfferData] = useState([]);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const brandId = location?.state?.brand;
  const categoryId = location?.state?.category;
  const [rows] = useState(100);
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (categoryId) setActiveCategory(categoryId);
  }, [categoryId]);

  const fetchOfferData = async (resetData = false) => {
    try {
      setLoading(true);
      const currentPage = resetData ? 1 : page;

      const offers = await sdkApi.getMerchantOffers({
        categoryId: activeCategory,
        page: currentPage,
        limit: rows,
        search: searchQuery.trim(),
        ...(brandId && { brandId }),
      });

      const newOffers = offers.data || [];

      if (resetData) {
        setOfferData(newOffers);
        setPage(2);
      } else {
        setOfferData((prev) => [...prev, ...newOffers]);
        if (newOffers.length >= rows) setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await sdkApi.getCategories({
        limit: 100,
      });
      const allCategory = { _id: "", title: { en: "All" } };
      setCategories([allCategory, ...categoriesData.data]);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setOfferData([]);
    setPage(1);
    setInitialLoading(true);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    fetchOfferData(true);
  }, [activeCategory, searchQuery]);

  const handleSearchChange = useCallback(
    (value) => {
      if (searchTimeout) clearTimeout(searchTimeout);
      const timeout = setTimeout(() => setSearchQuery(value), 500);
      setSearchTimeout(timeout);
    },
    [searchTimeout]
  );

  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);
  const filteredCategories = categories?.filter(
    (category) =>
      ![
        "6880c1ec15086f43fc3adf76",
        "6880c20615086f43fc3adf82",
        "688896cc423cb682aa18d8da",
      ].includes(category._id)
  );

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
    </div>
  );

  const NoOffersFound = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-6xl text-purple-300 mb-4">🔍</div>
      <h3 className="text-lg font-semibold text-purple-200 mb-2">
        No offers found
      </h3>
      <p className="text-sm text-purple-300 text-center">
        {searchQuery
          ? `No offers found for "${searchQuery}". Try another search.`
          : "Try selecting a different category or check back later for new offers."}
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
            Offers
          </h1>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 mb-4 mt-3">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {filteredCategories?.map((category) => (
            <button
              key={category?._id}
              onClick={() => setActiveCategory(category?._id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-200 backdrop-blur-md ${
                activeCategory === category?._id
                  ? "bg-white/20 text-white border border-white/20"
                  : "bg-white/10 text-purple-200 border border-white/10 hover:bg-white/20"
              }`}
            >
              {category?.title?.en}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-200" />
          <input
            type="text"
            placeholder="Search offers or merchants..."
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 outline-none backdrop-blur-md"
          />
        </div>
      </div>

      {/* Offer Grid */}
      <div className="px-4 pb-6">
        {initialLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 gap-3 mt-4">
            {offerData?.length === 0 ? (
              <NoOffersFound />
            ) : (
              offerData?.map((offer, index) => {
                const params = new URLSearchParams(searchParams);
                params.set("couponId", offer?._id);
                const couponUrl = `/bank/coupon?${params.toString()}`;

                return (
                  <div key={index}>
                    <OfferView
                      onClick={() => navigate(couponUrl)}
                      product={offer}
                    />
                    {index !== offerData.length - 1 && (
                      <div className="my-2 border-b border-white/10" />
                    )}
                  </div>
                );
              })
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

export default DemoOffers;
