import { useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../hooks/useAuthUser";

const DemoSettings = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { clearCustomerAuth } = useAuthUser();

  const handleLogout = () => {
    clearCustomerAuth();
    localStorage.removeItem("customerAuth");
    sessionStorage.clear();
    navigate("/bank/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Header */}
      <div className="relative px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ChevronRightIcon className="w-5 h-5 text-white rotate-180" />
          </button>
          <h1 className="text-2xl font-black text-white drop-shadow-lg">
            Settings
          </h1>
          <div className="w-10 h-10"></div>
        </div>
        <div className="mt-3 w-20 h-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse"></div>
      </div>

      {/* Logout Section */}
      <div className="relative px-6">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:shadow-red-500/50 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6" />
          Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>

            <div className="mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 animate-pulse mb-6" />

            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <ArrowRightOnRectangleIcon className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl font-black text-white mb-3 text-center">
              Logout?
            </h2>
            <p className="text-purple-200 text-sm text-center mb-8">
              Are you sure you want to logout? You’ll need to sign in again to
              access your account.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-red-500/50 active:scale-95"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full bg-white/5 border border-white/20 text-white py-3 rounded-xl font-bold hover:bg-white/10 transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoSettings;
