import { Navigate, Outlet } from "react-router-dom";

export default function BankProtectedLayout() {
  const token = localStorage.getItem("jhiejwfiuewyfwuakhfw");
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
