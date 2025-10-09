import { useEffect, useState } from "react";
import { GiftIcon, TagIcon, Squares2X2Icon } from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  FireIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import sdkApi from "../../api/sdk";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { useNavigationWithParams } from "../../utils/navigationUtils";
import { getImageUrl, handleImageError } from "../../utils/imageUtils";
import logo from "../../assets/WhatsApp Image 2025-10-05 at 14.08.37_008691b7.jpg";
import { useNavigate, useSearchParams } from "react-router-dom";

const SkeletonBox = ({ className }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-purple-800/20 via-purple-600/20 to-purple-800/20 rounded-2xl ${className} backdrop-blur-sm`}
  ></div>
);

const DemoDashboard = () => {
  const { navigateWithParams } = useNavigationWithParams();
  const { customerID, apiKey, customerData } = useCustomerAuth();
  const [offerData, setOfferData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const [offers, brandData, categoriesData] = await Promise.all([
          sdkApi.getMerchantOffers(customerID, apiKey, { limit: 20 }),
          sdkApi.getBrands(customerID, apiKey, { limit: 20 }),
          sdkApi.getCategories(customerID, apiKey, { limit: 20 }),
        ]);

        setOfferData(offers.data || []);
        setBrands(brandData.data || []);
        setCategories(categoriesData.data || []);
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerID, apiKey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="relative px-6 pt-12 pb-10 flex items-center justify-between">
        <div className="absolute -top-20 left-1/3 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl animate-ping"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 flex flex-col items-start">
          <h2 className="text-sm text-purple-200 font-medium tracking-wide">
            Welcome back,
          </h2>
          <h1 className="text-2xl font-black text-white drop-shadow-lg mt-1">
            {customerData?.name || "Guest"}
          </h1>
          <div className="mt-3 w-20 h-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse"></div>
        </div>

        <div className="relative z-10 group">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-500 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>

          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-2xl flex items-center justify-center shadow-2xl hover:shadow-purple-500/30 transition-all hover:scale-105 duration-500">
            <img
              src={getImageUrl(logo)}
              alt="logo"
              className="w-14 h-14 rounded-xl object-cover shadow-lg"
              onError={(e) => handleImageError(e)}
            />
          </div>
        </div>
      </div>

      <div className="relative px-6">
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            {
              icon: GiftIcon,
              label: "Offers",
              gradient: "from-rose-500 via-pink-500 to-rose-600",
              route: "/bank/offers",
            },
            {
              icon: TagIcon,
              label: "Brands",
              gradient: "from-blue-500 via-cyan-500 to-blue-600",
              route: "/bank/brands",
            },
            {
              icon: Squares2X2Icon,
              label: "Bank Products",
              gradient: "from-emerald-500 via-teal-500 to-emerald-600",
              route: "/bank/categories",
            },
            {
              icon: HeartIcon,
              label: "Favorites",
              gradient: "from-orange-500 via-amber-500 to-orange-600",
              route: "/bank/offers",
            },
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigateWithParams(action.route)}
              className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all active:scale-95 border border-white/10 hover:border-white/20"
            >
              <div
                className={`w-11 h-11 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-lg`}
              >
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-bold text-white">{action.label}</p>
            </button>
          ))}
        </div>

        <SectionHeader
          title="Exclusive Offers"
          icon={<FireIcon className="w-5 h-5 text-orange-400" />}
          btnText="View All"
          onClick={() => navigateWithParams("/bank/offers")}
        />
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 mb-8 -mx-6 px-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <SkeletonBox key={i} className="min-w-[300px] h-[220px]" />
              ))
            : offerData
                .slice(0, 10)
                .map((offer, idx) => (
                  <PremiumOfferCard
                    key={offer._id}
                    data={offer}
                    index={idx}
                    navigateWithParams={navigateWithParams}
                  />
                ))}
        </div>

        <SectionHeader
          title="Featured Brands"
          icon={<TagIcon className="w-5 h-5 text-blue-400" />}
          btnText="See All"
          onClick={() => navigateWithParams("/bank/brands")}
        />
        <div className="grid grid-cols-3 gap-4 mb-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SkeletonBox key={i} className="w-full h-36" />
              ))
            : brands
                .slice(0, 6)
                .map((brand, idx) => (
                  <BrandCard
                    key={brand._id}
                    brand={brand}
                    index={idx}
                    onClick={() =>
                      navigateWithParams("/bank/offers", { brand: brand._id })
                    }
                  />
                ))}
        </div>

        <SectionHeader
          title="Browse Categories"
          icon={<Squares2X2Icon className="w-5 h-5 text-emerald-400" />}
          btnText="Explore"
          onClick={() => navigateWithParams("/bank/categories")}
        />
        <div className="grid grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <SkeletonBox className="w-16 h-16 rounded-full mb-2" />
                  <SkeletonBox className="w-12 h-3 rounded-md" />
                </div>
              ))
            : categories.slice(0, 8).map((category, idx) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  index={idx}
                  onClick={() =>
                    navigateWithParams("/bank/offers", {
                      category: category._id,
                    })
                  }
                />
              ))}
        </div>
      </div>
    </div>
  );
};

const PremiumOfferCard = ({ data, index, navigateWithParams }) => {
  const {
    title,
    merchantId,
    description,
    posterImage,
    discountDetails,
    validityPeriod,
    _id,
  } = data;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  params.set("couponId", _id);
  const couponUrl = `/bank/coupon?${params.toString()}`;

  const discountLabel =
    discountDetails?.type === "PERCENTAGE"
      ? `${discountDetails?.value}% OFF`
      : discountDetails?.type === "FLAT"
      ? `₹${discountDetails?.value} OFF`
      : "Offer";

  const daysLeft = validityPeriod?.endDate
    ? Math.ceil(
        (new Date(validityPeriod.endDate) - new Date()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div
      onClick={() => {
        navigate(couponUrl);
      }}
      className="relative min-w-[220px] aspect-square rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all cursor-pointer group border border-white/10 bg-white/5 backdrop-blur-2xl"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <img
        src={getImageUrl(posterImage)}
        alt={merchantId?.title?.en || title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        onError={(e) => handleImageError(e)}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

      <div className="absolute top-3 right-3 z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-md opacity-60"></div>
          <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full font-black text-[11px] shadow-lg">
            {discountLabel}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-black text-sm mb-1 line-clamp-1 drop-shadow-lg">
          {merchantId?.title?.en || title}
        </h3>
        <p className="text-purple-100 text-[10px] mb-2 line-clamp-2">
          {description?.en}
        </p>

        <div className="flex items-center justify-between">
          {daysLeft && (
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl px-2 py-0.5 rounded-full border border-white/20">
              <svg
                className="w-3 h-3 text-emerald-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-white text-[10px] font-bold">
                {daysLeft}d
              </span>
            </div>
          )}

          <button className="bg-white text-purple-700 px-3 py-1 rounded-full text-[10px] font-black hover:bg-purple-50 transition-all shadow-lg hover:scale-105">
            Claim
          </button>
        </div>
      </div>
    </div>
  );
};

const BrandCard = ({ brand, index, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all cursor-pointer active:scale-95 border border-white/10 hover:border-white/20"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-white/10">
      <img
        src={getImageUrl(brand.image)}
        alt={brand.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        onError={(e) => handleImageError(e)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    <p className="text-sm font-bold text-white text-center truncate">
      {brand.name}
    </p>
  </div>
);

const CategoryCard = ({ category, index, onClick }) => (
  <div
    onClick={onClick}
    className="group flex flex-col items-center cursor-pointer"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity"></div>
      <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-2xl mb-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 group-hover:border-purple-400/50 transition-all group-active:scale-95">
        <img
          src={getImageUrl(category.image)}
          alt={category.title?.en}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => handleImageError(e)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
      </div>
    </div>
    <p className="text-[10px] font-bold text-white text-center line-clamp-2 leading-tight drop-shadow-lg">
      {category.title?.en}
    </p>
  </div>
);

const SectionHeader = ({ title, icon, btnText, onClick }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center border border-white/20">
        {icon}
      </div>
      <h2 className="text-lg font-black text-white drop-shadow-lg">{title}</h2>
    </div>
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-bold text-purple-300 hover:text-white active:scale-95 transition-all bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/20"
    >
      {btnText}
      <ChevronRightIcon className="w-4 h-4" />
    </button>
  </div>
);

export default DemoDashboard;
