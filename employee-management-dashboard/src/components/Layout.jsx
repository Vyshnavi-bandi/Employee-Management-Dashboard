import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import Navbar from "./Navbar";
import "../styles/components/_layout.scss";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar isOpen={sidebarOpen} />
      {!sidebarOpen && (
        <div className="layout_overlay" onClick={toggleSidebar}></div>
      )}

      <div className="layout_main">
        <Navbar onMenuClick={toggleSidebar} />
        <div className="layout_content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
