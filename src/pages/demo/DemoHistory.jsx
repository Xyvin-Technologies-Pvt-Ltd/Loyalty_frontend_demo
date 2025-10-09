import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import sdkApi from "../../api/sdk";
import {
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  AdjustmentsHorizontalIcon,
  XCircleIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  GiftIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const PAGE_SIZE = 20;

const getTransactionMeta = (transaction) => {
  switch (transaction.type) {
    case "earn":
      return {
        title: "Points Earned",
        icon: <ArrowUpCircleIcon className="w-6 h-6 text-green-400" />,
        bg: "bg-green-500/10",
        color: "text-green-400",
        sign: "+",
      };
    case "redeem":
      return {
        title: "Points Redeemed",
        icon: <ArrowDownCircleIcon className="w-6 h-6 text-red-400" />,
        bg: "bg-red-500/10",
        color: "text-red-400",
        sign: "-",
      };
    case "adjust":
      return {
        title: "Points Adjusted",
        icon: <AdjustmentsHorizontalIcon className="w-6 h-6 text-blue-400" />,
        bg: "bg-blue-500/10",
        color: "text-blue-400",
        sign: "",
      };
    case "expire":
      return {
        title: "Points Expired",
        icon: <XCircleIcon className="w-6 h-6 text-gray-400" />,
        bg: "bg-gray-500/10",
        color: "text-gray-400",
        sign: "-",
      };
    case "tier_downgrade":
      return {
        title: "Tier Downgrade",
        icon: <ArrowTrendingDownIcon className="w-6 h-6 text-orange-400" />,
        bg: "bg-orange-500/10",
        color: "text-orange-400",
        sign: "",
      };
    case "tier_upgrade":
      return {
        title: "Tier Upgrade",
        icon: <ArrowTrendingUpIcon className="w-6 h-6 text-purple-400" />,
        bg: "bg-purple-500/10",
        color: "text-purple-400",
        sign: "",
      };
    case "offer-redeem":
      return {
        title: "Offer Redeemed",
        icon: <GiftIcon className="w-6 h-6 text-pink-400" />,
        bg: "bg-pink-500/10",
        color: "text-pink-400",
        sign: "",
      };
    default:
      return {
        title: "Transaction",
        icon: <AdjustmentsHorizontalIcon className="w-6 h-6 text-gray-400" />,
        bg: "bg-gray-500/10",
        color: "text-gray-400",
        sign: "",
      };
  }
};

const DemoHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const { customerID, apiKey, isAuthenticated } = useCustomerAuth();

  const fetchTransactionHistory = useCallback(
    async (pageToLoad = 1) => {
      if (!isAuthenticated || !customerID || !apiKey) {
        setError("Customer ID and API Key are required");
        setInitialLoading(false);
        return;
      }
      try {
        if (pageToLoad === 1) {
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await sdkApi.getTransactionHistory(
          customerID,
          apiKey,
          pageToLoad,
          PAGE_SIZE
        );
        
        if (response.status === 200 && response.data) {
          setPagination(response.data.pagination);
          if (pageToLoad === 1) {
            setTransactions(response.data.transactions || []);
          } else {
            setTransactions((prev) => [
              ...prev,
              ...(response.data.transactions || []),
            ]);
          }
        } else {
          setError("Failed to fetch transaction history");
        }
      } catch (err) {
        setError(
          `Error loading transaction history: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setLoading(false);
        setInitialLoading(false);
        setIsLoadingMore(false);
      }
    },
    [customerID, apiKey, isAuthenticated]
  );

  useEffect(() => {
    if (customerID && apiKey && isAuthenticated) {
      setPage(1);
      setError(null);
      fetchTransactionHistory(1);
    }
  }, [customerID, apiKey, isAuthenticated]);

  useEffect(() => {
    if (page === 1) return;
    fetchTransactionHistory(page);
  }, [page, fetchTransactionHistory]);

  const observer = useRef();
  const lastRowRef = useCallback(
    (node) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          pagination?.has_next &&
          !isLoadingMore
        ) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, pagination]
  );

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
    </div>
  );

  const NoTransactionsFound = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* <div className="text-6xl text-purple-300 mb-4">📊</div> */}
      <h3 className="text-lg font-semibold text-purple-200 mb-2">
        No transaction history found
      </h3>
      <p className="text-sm text-purple-300 text-center">
        Your transaction history will appear here once you start earning or
        redeeming points
      </p>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl max-w-md mx-auto overflow-hidden p-6 text-center">
          <div className="text-red-400 text-lg font-semibold mb-2">
            Authentication Required
          </div>
          <p className="text-purple-200 text-sm mb-4">
            Please access this page with valid customer credentials.
          </p>
          <div className="bg-white/5 rounded-lg p-3 text-xs text-purple-300">
            <p className="font-medium mb-1">Required URL format:</p>
            <p className="font-mono text-xs break-all">
              ?customerID=YOUR_ID&apiKey=YOUR_KEY
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl max-w-md mx-auto overflow-hidden p-6 text-center">
          <div className="text-red-400 text-lg font-semibold mb-2">
            Error Loading History
          </div>
          <p className="text-purple-200 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 poppins-text">
      <div className="flex justify-between items-center p-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-full p-2 transition-all backdrop-blur-xl"
          >
            <ArrowLeftIcon className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white tracking-wide drop-shadow-md">
            Transaction History
          </h1>
        </div>
      </div>

      <div className="px-4 pb-6">
        {initialLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-3 mt-4">
            {transactions?.length === 0 ? (
              <NoTransactionsFound />
            ) : (
              <>
                {transactions.map((item, idx) => {
                  const lastItem = transactions.length === idx + 1;
                  const meta = getTransactionMeta(item);

                  return (
                    <div
                      key={item.id}
                      ref={lastItem ? lastRowRef : null}
                      className="flex items-center gap-4 p-4 w-full bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/20 transition-all"
                    >
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full ${meta.bg} flex-shrink-0`}
                      >
                        {meta.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm mb-1">
                          {meta.title}
                        </p>
                        <p className="text-xs text-purple-300">
                          {item.transaction_id}
                        </p>
                      </div>
                      {item.type !== "offer-redeem" && (
                        <div className="text-right">
                          <p className={`font-semibold text-sm ${meta.color}`}>
                            {meta.sign}
                            {item.points} pts
                          </p>
                          <p className="text-xs text-purple-300 mt-1">
                            {item.date}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoadingMore && (
                  <div className="py-3">
                    <LoadingSpinner />
                  </div>
                )}

                {!pagination?.has_next && transactions.length > 0 && (
                  <div className="flex justify-center py-3 text-purple-300 text-xs">
                    You've reached the end of last one year transaction history
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoHistory;