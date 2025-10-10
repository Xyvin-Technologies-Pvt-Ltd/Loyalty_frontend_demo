import { useState } from "react";
import {
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const DUMMY_CREDENTIALS = {
  phoneNumber: "9876543210",
  password: "12345",
  mpin: "1234",
};

const DemoLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [mpin, setMpin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhonePasswordSubmit = () => {
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (
        phoneNumber === DUMMY_CREDENTIALS.phoneNumber &&
        password === DUMMY_CREDENTIALS.password
      ) {
        setStep(2);
        setError("");
      } else {
        setError("Invalid phone number or password");
      }
      setLoading(false);
    }, 1000);
  };

  const handleMpinSubmit = () => {
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (mpin === DUMMY_CREDENTIALS.mpin) {
        setStep(3);
        setTimeout(() => {
          navigate(
            "/bank/dashboard?customerID=77751283&apiKey=H0RIRxapB4Uo7im"
          );
        }, 1500);
      } else {
        setError("Invalid MPIN");
        setMpin("");
      }
      setLoading(false);
    }, 1000);
  };

  const handleMpinChange = (value) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setMpin(value);
      setError("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="relative w-full max-w-md">
        {step === 1 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <PhoneIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-purple-200 text-sm">Sign in to continue</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handlePhonePasswordSubmit()
                    }
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handlePhonePasswordSubmit}
                disabled={loading || !phoneNumber || !password}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Continue
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ShieldCheckIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2">
                Enter MPIN
              </h1>
              <p className="text-purple-200 text-sm">
                Enter your 4-digit security PIN
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-center gap-3 mb-6">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-all ${
                        mpin.length > index
                          ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg"
                          : "bg-white/5 border border-white/20 text-transparent"
                      }`}
                    >
                      {mpin[index] || "•"}
                    </div>
                  ))}
                </div>

                <input
                  type="password"
                  inputMode="numeric"
                  value={mpin}
                  onChange={(e) => handleMpinChange(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && mpin.length === 4 && handleMpinSubmit()
                  }
                  placeholder="Enter 4-digit MPIN"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white text-center placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  maxLength={4}
                  autoFocus
                />
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
                    Verify
                    <ShieldCheckIcon className="w-5 h-5" />
                  </>
                )}
              </button>

             <button
                onClick={() => {
                  setStep(1);
                  setMpin("");
                  setError("");
                }}
                className="w-full flex items-center justify-center gap-2 text-purple-300 hover:text-white transition-all text-sm font-semibold py-2 rounded-xl hover:bg-white/5"
              >
                <ArrowRightIcon className="w-4 h-4 rotate-180" />
                Back to login
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
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

            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoLogin;
