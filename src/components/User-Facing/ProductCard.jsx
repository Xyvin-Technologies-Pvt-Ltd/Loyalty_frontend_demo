import { useState } from "react";
import { getImageUrl, handleImageError } from "../../utils/imageUtils";

const ProductCard = ({ product, onClick }) => {
  const [expanded, setExpanded] = useState(false);
  const maxChars = 70;
  const description = product?.description?.en || "";

  const shouldTruncate = description.length > maxChars;
  const displayText =
    expanded || !shouldTruncate
      ? description
      : description.slice(0, maxChars) + "...";

  return (
    <div
      onClick={onClick}
      className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-3 border border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95 cursor-pointer"
    >
      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-white/10">
        <img
          src={getImageUrl(product?.image || product?.merchantId?.image)}
          alt={product?.title?.en}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => handleImageError(e)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
        {product?.title?.en || "Untitled"}
      </h3>

      <p className="text-[11px] text-purple-200 leading-snug overflow-hidden">
        {displayText}
        {shouldTruncate && (
          <button
          type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="text-purple-400 ml-1 text-[10px] font-semibold hover:underline"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </p>
    </div>
  );
};

export default ProductCard;
