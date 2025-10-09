import { CalendarDateRangeIcon } from "@heroicons/react/24/outline";
import moment from "moment/moment";
moment.locale("en");

const OfferView = ({ product, onClick }) => {
  const getDiscountLabel = () => {
    if (!product?.discountDetails) return "";
    const { type, value } = product.discountDetails;
    return type === "FIXED" ? `OMR ${value} off` : `${value}% off`;
  };

  return (
    <div
      className="flex items-center gap-4 p-4 cursor-pointer w-full max-w-xl bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all"
      onClick={onClick}
    >
      {/* Poster Image */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <img
          src={product?.posterImage}
          alt={product?.title?.en}
          className="w-20 h-20 rounded-lg object-cover"
        />

        {product?.merchantId?.image && (
          <img
            src={product?.merchantId?.image}
            alt={product?.merchantId?.title?.en}
            className="absolute top-1 left-1 w-[37px] h-[37px] rounded-lg bg-black/20 p-[0.6px] object-contain shadow"
          />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <p className="text-base font-semibold text-white poppins-text line-clamp-2">
            {product?.title?.en}
          </p>
          <p className="text-sm text-purple-200 poppins-text mt-1 line-clamp-1">
            {product?.merchantId?.title?.en || "Biriyani Bowl Restaurant"}
          </p>
        </div>

        {/* Validity and discount */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <CalendarDateRangeIcon className="w-4 h-4" />
            <span>
              {moment(product?.validityPeriod?.startDate).format("DD MMM YYYY")} –{" "}
              {moment(product?.validityPeriod?.endDate).format("DD MMM YYYY")}
            </span>
          </div>
{/* 
          {product?.discountDetails && (
            <span className="text-xs font-semibold text-white bg-purple-600/30 px-2 py-1 rounded-md">
              {getDiscountLabel()}
            </span>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default OfferView;
