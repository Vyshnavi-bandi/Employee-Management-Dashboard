import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineHome, HiOutlineUsers } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import "../styles/components/_sidebar.scss";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("isAuth");
    navigate("/");
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar_logo">
      <img src="/logo.webp" alt="Logo" width={100} height={100}  className="sidebar_logo_img" />

      </div>

      <nav className="sidebar_nav">
        <NavLink to="/dashboard" className="nav_item">
          <HiOutlineHome size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/employees" className="nav_item">
          <HiOutlineUsers size={20} />
          <span>Employees</span>
        </NavLink>
        <button className="sidebar_logout" onClick={handleLogout}>
        <FiLogOut size={20} />
        <span>Log Out</span>
      </button>
      </nav>
    </aside>
  );
};

export { Sidebar };
export default Sidebar;
