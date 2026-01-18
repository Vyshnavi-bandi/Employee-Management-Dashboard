import { useNavigate } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { HiMoon } from "react-icons/hi";
import { HiBell } from "react-icons/hi";
import "../styles/components/_navbar.scss";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("isAuth");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar_left">
        <button className="navbar_menu" onClick={onMenuClick}>
          <HiMenu size={24} />
        </button>
      </div>

      <div className="navbar_right">
        <div className="navbar_profile">
          <p>P</p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
