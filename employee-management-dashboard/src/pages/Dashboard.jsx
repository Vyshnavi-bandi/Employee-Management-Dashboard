import { useEffect, useState } from "react";
import { HiUsers, HiCheckCircle, HiXCircle } from "react-icons/hi";
import "../styles/pages/_dashboard.scss";

export const Dashboard = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/employees")
      .then(res => res.json())
      .then(data => setEmployees(data));
  }, []);

  const total = employees.length;
  const active = employees.filter(e => e.active).length;
  const inactive = total - active;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard Summary</h1>

      <div className="dashboard-summary">
        <div className="summary-card total">
          <div className="card-icon">
            <HiUsers size={24} />
          </div>
          <div className="card-content">
            <p className="card-label">Total Employees</p>
            <h2 className="card-value">{total}</h2>
          </div>
        </div>

        <div className="summary-card active">
          <div className="card-icon">
            <HiCheckCircle size={24} />
          </div>
          <div className="card-content">
            <p className="card-label">Active Employees</p>
            <h2 className="card-value">{active}</h2>
            <span className="card-subtext">Currently working</span>
          </div>
        </div>

        <div className="summary-card inactive">
          <div className="card-icon">
            <HiXCircle size={24} />
          </div>
          <div className="card-content">
            <p className="card-label">Inactive Employees</p>
            <h2 className="card-value">{inactive}</h2>
            <span className="card-subtext">Not currently active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
