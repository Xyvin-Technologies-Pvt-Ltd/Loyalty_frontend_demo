import { ArrowLeftIcon, ClockIcon, MapPinIcon, GiftIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useNavigate, useSearchParams } from "react-router-dom";
import RedeemCard from "../../components/User-Facing/RedeemCard";
import { useEffect, useState } from "react";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import sdkApi from "../../api/sdk";
import moment from "moment";

const DemoCouponDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [offerData, setOfferData] = useState(null);
  const couponId = searchParams.get("couponId");
  const [showRedeemCard, setShowRedeemCard] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        setLoading(true);
        const offers = await sdkApi.getCouponId(couponId);
        setOfferData(offers.data);
      } catch (err) {
        console.error("Error fetching offer data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOfferData();
  }, [ couponId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200 text-sm">Loading offer details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 text-white poppins-text pb-24">
      {/* Header with Poster Image */}
      <div className="relative">
        <div className="relative h-96 overflow-hidden">
          <img
            src={offerData?.posterImage}
            alt="Offer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-950"></div>
          
          {/* Back Button */}
          <button
            className="absolute top-6 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-lg hover:bg-white/30 transition-all"
            onClick={() => navigate("/bank/offers")}
          >
            <ArrowLeftIcon className="w-5 h-5 text-white" />
          </button>

          {/* Floating Discount Badge (Optional - if you have discount data) */}
          {offerData?.discount && (
            <div className="absolute top-6 right-4 bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
              <p className="text-sm font-bold">{offerData.discount}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Card */}
      <div className="px-4 -mt-12 relative z-10 max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/20">
          {/* Merchant Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                <img
                  src={offerData?.merchantId?.image}
                  alt="Merchant"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">
                {offerData?.merchantId?.title?.en}
              </h3>
              <div className="flex items-center gap-1.5 text-purple-200 text-sm mt-1">
                <ClockIcon className="w-3.5 h-3.5" />
                <span>
                  {moment(offerData?.validityPeriod?.startDate).format("DD MMM")} -{" "}
                  {moment(offerData?.validityPeriod?.endDate).format("DD MMM YYYY")}
                </span>
              </div>
            </div>
          </div>

          {/* Offer Title */}
          <h1 className="text-2xl font-bold text-white mb-4 leading-tight">
            {offerData?.title?.en}
          </h1>

          {/* Description Section */}
          {offerData?.merchantId?.description?.en && (
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4">
              <p className="text-purple-100 text-sm leading-relaxed break-words whitespace-pre-line">
                {offerData.merchantId.description.en}
              </p>
            </div>
          )}

          {/* Locations (if available) */}
          {offerData?.locations && (
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-purple-400/20 mb-4">
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-purple-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-purple-200 mb-1">STORE LOCATIONS</p>
                  <p className="text-sm text-purple-100">{offerData.locations}</p>
                </div>
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          {offerData?.termsAndConditions?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <SparklesIcon className="w-4 h-4 text-purple-300" />
                <h3 className="text-sm font-semibold text-purple-200">Terms & Conditions</h3>
              </div>
              <ul className="space-y-2">
                {offerData.termsAndConditions.map((term, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-purple-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Redeem Button */}
          <button
            onClick={() => setShowRedeemCard(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <GiftIcon className="w-5 h-5" />
            Redeem Coupon
          </button>
        </div>
      </div>

      {/* Redeem Modal */}
      {showRedeemCard && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl">
            <RedeemCard
              onClose={() => setShowRedeemCard(false)}
              image={offerData?.posterImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoCouponDetails;