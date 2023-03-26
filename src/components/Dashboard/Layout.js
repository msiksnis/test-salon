// components/Dashboard/Layout.js
import SidebarMenu from "./SidebarMenu";
import Header from "./Header";
import { useState } from "react";

export default function Layout({ children }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState("");

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleMenuItemClick = (treatmentType) => {
    setSelectedTreatment(treatmentType);
  };

  return (
    <div className="relative min-h-screen">
      <Header />
      <SidebarMenu
        isExpanded={isSidebarExpanded}
        toggleMenu={toggleSidebar}
        onMenuItemClick={handleMenuItemClick}
      />
      <div
        className={`relative pt-20 pb-4 transition-all duration-300 ${
          isSidebarExpanded ? "left-64" : "left-20"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
