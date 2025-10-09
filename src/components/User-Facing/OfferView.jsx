import { CalendarDateRangeIcon } from "@heroicons/react/24/outline";
import moment from "moment/moment";

const OfferView = ({ product, onClick }) => {
  // Force English locale for this component
  const formatDate = (date) => {
    return moment(date).locale('en').format("DD MMM YYYY");
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
              {formatDate(product?.validityPeriod?.startDate)} – {formatDate(product?.validityPeriod?.endDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferView;