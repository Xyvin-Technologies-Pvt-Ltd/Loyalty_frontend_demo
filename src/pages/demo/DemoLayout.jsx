import { useState, useEffect } from "react";
import {
  HomeIcon,
  ClockIcon,
  TagIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolidIcon,
  ClockIcon as ClockSolidIcon,
  TagIcon as TagSolidIcon,
  Squares2X2Icon,
  Squares2X2Icon as Squares2X2SolidIcon,
  Cog6ToothIcon as Cog6ToothSolidIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import PropTypes from "prop-types";
import { useAuthUser } from "../../hooks/useAuthUser";

const DemoLayout = ({ children, currentPage = "home" }) => {
  const [activePage, setActivePage] = useState(currentPage);

  const navigate = useNavigate();
  const location = useLocation();
  const { name } = useCustomerAuth();
  const { apiKey, customerId } = useAuthUser();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("dashboard")) setActivePage("home");
    else if (path.includes("history")) setActivePage("history");
    else if (path.includes("offers")) setActivePage("offers");
    else if (path.includes("categories")) setActivePage("categories");
    else if (path.includes("settings")) setActivePage("settings");
  }, [location.pathname]);

  const navigationItems = [
    {
      id: "home",
      label: "Home",
      icon: HomeIcon,
      activeIcon: HomeSolidIcon,
      href: "/bank/dashboard",
    },
    {
      id: "history",
      label: "History",
      icon: ClockIcon,
      activeIcon: ClockSolidIcon,
      href: "/bank/history",
    },
    {
      id: "categories",
      label: "Categories",
      icon: Squares2X2Icon,
      activeIcon: Squares2X2SolidIcon,
      href: "/bank/categories",
    },
    {
      id: "offers",
      label: "Offers",
      icon: TagIcon,
      activeIcon: TagSolidIcon,
      href: "/bank/offers",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Cog6ToothIcon,
      activeIcon: Cog6ToothSolidIcon,
      href: "/bank/settings",
    },
  ];

  const handleNavigation = (item) => {
    setActivePage(item.id);

    const searchParams = new URLSearchParams();
    if (customerId && apiKey) {
      searchParams.set("customerID", customerId);
      searchParams.set("apiKey", apiKey);
    }
    if (name) searchParams.set("name", name);

    const url = searchParams.toString()
      ? `${item.href}?${searchParams.toString()}`
      : item.href;
    navigate(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1c0632] via-[#25084a] to-[#100223] poppins-text text-white">
      <main className="pb-28 relative z-10">{children}</main>

      {/* Floating Frosted Nav Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => {
            const isActive = activePage === item.id;
            const IconComponent = isActive ? item.activeIcon : item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`flex flex-col items-center justify-center space-y-1 py-2 px-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "text-white scale-105"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(to bottom right, rgba(216,128,255,0.6), rgba(255,156,243,0.5))",
                        boxShadow:
                          "0 0 25px rgba(234,76,255,0.6), inset 0 0 10px rgba(255,255,255,0.3)",
                      }
                    : {}
                }
              >
                <IconComponent className="w-6 h-6" />
                <span className="text-[11px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-fuchsia-600/30 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
    </div>
  );
};

DemoLayout.propTypes = {
  children: PropTypes.node.isRequired,
  currentPage: PropTypes.string,
};

export default DemoLayout;
