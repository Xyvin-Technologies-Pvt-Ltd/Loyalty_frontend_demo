import { useEffect, useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  XMarkIcon,
  PencilSquareIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../hooks/useAuthUser";
import { set } from "react-hook-form";
import sdkApi from "../../api/sdk";

const DemoSettings = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({});
  const [editedCustomer, setEditedCustomer] = useState({});
  const { clearCustomerAuth } = useAuthUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sdkApi.getCustomerDetails();
        setCustomer(response.data);
        setEditedCustomer(response.data);
      } catch (err) {
        console.error("Error fetching  data:", err);
      }
    };
    fetchData();
  }, []);

  console.log(customer._id, "customer");

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        // Save changes
        await sdkApi.updateCustomer( editedCustomer);
        setCustomer(editedCustomer);
        setIsEditing(false);
      } catch (err) {
        console.error("Error updating customer data:", err);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditedCustomer(customer);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogout = () => {
    clearCustomerAuth();
    localStorage.removeItem("customer-auth");
    localStorage.removeItem("jhiejwfiuewyfwuakhfw");
    sessionStorage.clear();
    navigate("/");
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

      {/* Content Section */}
      <div className="relative px-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-xl font-black text-white">Profile Details</h2>
            <button
              onClick={handleEditToggle}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                isEditing
                  ? "bg-gradient-to-br from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/50"
                  : "bg-gradient-to-br from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50"
              }`}
            >
              {isEditing ? (
                <CheckIcon className="w-5 h-5 text-white" />
              ) : (
                <PencilSquareIcon className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-300 mb-1 font-semibold">
                  Name
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedCustomer?.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-white font-bold truncate">
                    {customer?.name || "Loading..."}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                <EnvelopeIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-300 mb-1 font-semibold">
                  Email
                </p>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedCustomer?.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                ) : (
                  <p className="text-white font-bold truncate">
                    {customer?.email || "Loading..."}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                <PhoneIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-300 mb-1 font-semibold">
                  Phone Number
                </p>
                <p className="text-white font-bold truncate">
                  {customer?.mobile || "Loading..."}
                </p>
                {isEditing && (
                  <p className="text-xs text-purple-400 mt-1">
                    Phone number cannot be changed
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cancel Button - Only shown when editing */}
          {isEditing && (
            <button
              onClick={handleCancel}
              className="w-full mt-4 bg-white/5 border border-white/20 text-white py-3 rounded-xl font-bold hover:bg-white/10 transition-all active:scale-95"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Logout Button */}
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
              Are you sure you want to logout? You'll need to sign in again to
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
