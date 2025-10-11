import { useEffect, useState } from "react";
import {
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../hooks/useAuthUser";
import sdkApi from "../../api/sdk";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const DemoLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const [newMpin, setNewMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [showMpin, setShowMpin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCustomerAuth } = useAuthUser();

  useEffect(() => {
    const token = localStorage.getItem("jhiejwfiuewyfwuakhfw");
    if (token) {
      navigate("/bank/dashboard");
    }
  }, [navigate]);

  const sendOtp = async (phone) => {
    try {
      setLoading(true);
      setError("");
      const response = await sdkApi.customerLogin({ phone });
      if (response) {
        setStep(3);
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (phone, otpCode) => {
    try {
      setLoading(true);
      setError("");
      const response = await sdkApi.otpVerification({ phone, otp: otpCode });
      if (response) {
        const { token, customer_id, has_mpin } = response.data;
        setCustomerAuth({
          customerId: customer_id,
          apiKey: "H0RIRxapB4Uo7im",
          token,
        });
        console.log("has_mpin", has_mpin);
        if (!has_mpin) {
          setStep(5);
        } else {
          localStorage.setItem("jhiejwfiuewyfwuakhfw", token);
          setStep(6);
          setTimeout(() => navigate("/bank/dashboard"), 1500);
        }
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const loginWithMpin = async (phone, mpinCode) => {
    try {
      setLoading(true);
      setError("");
      const response = await sdkApi.customerLogin({ phone, mpin: mpinCode });
      if (response) {
        const { token, customer_id } = response.data;
        setCustomerAuth({
          customerId: customer_id,
          apiKey: "H0RIRxapB4Uo7im",
          token,
        });
        localStorage.setItem("jhiejwfiuewyfwuakhfw", token);
        setStep(6);
        setTimeout(() => navigate("/bank/dashboard"), 1500);
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid MPIN");
      setMpin("");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const setMpinApi = async (phone, mpinCode) => {
    try {
      setLoading(true);
      setError("");
      const response = await sdkApi.addMpin({ phone, mpin: mpinCode });
      if (response) {
        setStep(6);
        setTimeout(() => navigate("/bank/dashboard"), 1500);
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to set MPIN");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleOtpChoice = () => sendOtp(phoneNumber);
  const handleMpinChoice = () => setStep(4);

  const handleOtpSubmit = () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    verifyOtp(phoneNumber, otp);
  };

  const handleMpinSubmit = () => {
    if (mpin.length !== 4) {
      setError("Please enter a valid 4-digit MPIN");
      return;
    }
    loginWithMpin(phoneNumber, mpin);
  };

  const handleSetMpin = () => {
    if (newMpin.length !== 4 || confirmMpin.length !== 4) {
      setError("MPIN must be 4 digits");
      return;
    }
    if (newMpin !== confirmMpin) {
      setError("MPINs do not match");
      return;
    }
    setMpinApi(phoneNumber, newMpin);
  };

  const handleSkipMpin = () => {
    setStep(6);
    setTimeout(() => navigate("/bank/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden p-4">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "4s" }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Step 1: Phone Number */}
        {step === 1 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl px-8 py-10 shadow-2xl border border-white/20">
            <div className="mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse mb-8" />
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-purple-200 text-sm">
                Enter your phone number to continue
              </p>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Phone Number
                </label>
              <style>{`
                  .PhoneInput {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0.75rem;
                    padding: 0.75rem 1rem;
                    transition: all 0.3s;
                  }
                  .PhoneInput:focus-within {
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.4);
                    border-color: transparent;
                  }
                  .PhoneInputInput {
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 1rem;
                    outline: none;
                    flex: 1;
                  }
                  .PhoneInputInput::placeholder {
                    color: rgba(216, 180, 254, 0.6);
                  }
                  .PhoneInputCountrySelect {
                    background: #1e293b;
                    border: none;
                    color: white;
                    cursor: pointer;
                    margin-right: 0.5rem;
                    padding: 0.25rem;
                    border-radius: 0.5rem;
                    outline: none;
                  }
                  .PhoneInputCountrySelect option {
                    background: #1e293b;
                    color: white;
                    padding: 0.5rem;
                  }
                  .PhoneInputCountrySelect:hover {
                    background: #334155;
                  }
                  .PhoneInputCountrySelectArrow {
                    border-color: white transparent transparent;
                    opacity: 0.6;
                  }
                  .PhoneInputCountryIcon {
                    width: 1.5rem;
                    height: 1.5rem;
                    margin-right: 0.5rem;
                    border: none;
                    outline: none;
                    box-shadow: none;
                  }
                  .PhoneInputCountryIconImg {
                    width: 100%;
                    height: 100%;
                    border: none;
                    outline: none;
                    box-shadow: none;
                    display: block;
                  }
                `}</style>
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder="Enter phone number"
                  className="phone-input-custom"
                />
              </div>
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
                  {error}
                </div>
              )}
              <button
                onClick={handlePhoneSubmit}
                disabled={loading || !phoneNumber}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Login Method */}
        {step === 2 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl px-8 py-10 shadow-2xl border border-white/20">
            <div className="mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse mb-8" />
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white mb-2">
                Choose Login Method
              </h1>
              <p className="text-purple-200 text-sm">
                How would you like to sign in?
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleOtpChoice}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-3"
              >
                <KeyIcon className="w-6 h-6" />
                Login with OTP
              </button>
              <button
                onClick={handleMpinChoice}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-3"
              >
                <ShieldCheckIcon className="w-6 h-6" />
                Login with MPIN
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full text-purple-300 hover:text-white transition-all text-sm font-semibold py-2"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* Step 3: OTP Entry */}
        {step === 3 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl px-8 py-10 shadow-2xl border border-white/20">
            <div className="mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse mb-8" />
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white mb-2">Enter OTP</h1>
              <p className="text-purple-200 text-sm">
                We sent a code to{" "}
                <span className="font-bold">{phoneNumber}</span>
              </p>
            </div>
            <div className="space-y-5">
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && otp.length === 6 && handleOtpSubmit()
                }
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white text-center text-2xl tracking-widest placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-sm focus:border-transparent transition-all"
                maxLength={6}
                autoFocus
              />
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm text-center">
                  {error}
                </div>
              )}
              <button
                onClick={handleOtpSubmit}
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Verify OTP <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
              <button
                onClick={() => sendOtp(phoneNumber)}
                disabled={loading}
                className="w-full text-purple-300 hover:text-white transition-all text-sm font-semibold py-2"
              >
                Resend OTP
              </button>
              <button
                onClick={() => setStep(2)}
                className="w-full text-purple-300 hover:text-white transition-all text-sm font-semibold py-2"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* Step 4: MPIN Entry */}
        {step === 4 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl px-8 py-10 shadow-2xl border border-white/20">
            <div className="mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse mb-8" />
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white mb-2">
                Enter MPIN
              </h1>
              <p className="text-purple-200 text-sm">
                Enter your 4-digit security PIN
              </p>
            </div>
            <div className="space-y-5">
              <div className="flex justify-center gap-3 mb-6">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-all ${
                      mpin.length > index
                        ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg"
                        : "bg-white/5 border border-white/20 text-transparent"
                    }`}
                  >
                    {showMpin && mpin[index]
                      ? mpin[index]
                      : mpin.length > index
                      ? "•"
                      : ""}
                  </div>
                ))}
              </div>
              <div className="relative">
                <input
                  type={showMpin ? "text" : "password"}
                  inputMode="numeric"
                  value={mpin}
                  onChange={(e) =>
                    setMpin(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && mpin.length === 4 && handleMpinSubmit()
                  }
                  placeholder="Enter 4-digit MPIN"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white text-center placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  maxLength={4}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowMpin(!showMpin)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                >
                  {showMpin ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm text-center">
                  {error}
                </div>
              )}
              <button
                onClick={handleMpinSubmit}
                disabled={loading || mpin.length !== 4}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Verify <ShieldCheckIcon className="w-5 h-5" />
                  </>
                )}
              </button>
              <button
                onClick={() => setStep(2)}
                className="w-full text-purple-300 hover:text-white transition-all text-sm font-semibold py-2"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Set MPIN */}
        {step === 5 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl px-8 py-10 shadow-2xl border border-white/20">
            <div className="mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse mb-8" />
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white mb-2">Set MPIN</h1>
              <p className="text-purple-200 text-sm">
                Create a 4-digit PIN for quick login
              </p>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  New MPIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={newMpin}
                  onChange={(e) =>
                    setNewMpin(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="Enter 4-digit MPIN"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white text-center placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  maxLength={4}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Confirm MPIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={confirmMpin}
                  onChange={(e) =>
                    setConfirmMpin(
                      e.target.value.replace(/\D/g, "").slice(0, 4)
                    )
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    newMpin.length === 4 &&
                    confirmMpin.length === 4 &&
                    handleSetMpin()
                  }
                  placeholder="Re-enter 4-digit MPIN"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white text-center placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  maxLength={4}
                />
              </div>
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm text-center">
                  {error}
                </div>
              )}
              <button
                onClick={handleSetMpin}
                disabled={
                  loading || newMpin.length !== 4 || confirmMpin.length !== 4
                }
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Set MPIN <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
              <button
                onClick={handleSkipMpin}
                className="w-full text-purple-300 hover:text-white transition-all text-sm font-semibold py-2"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Success */}
        {step === 6 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl px-6 py-14 shadow-2xl border border-white/20 flex flex-col items-center justify-center">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-24 h-24 rounded-full mb-6 flex items-center justify-center shadow-lg animate-bounce">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Success!</h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoLogin;