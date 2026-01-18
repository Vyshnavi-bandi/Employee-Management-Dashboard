import { useEffect, useState } from "react";
import { FiUpload, FiTrash2, FiPlus, FiSearch, FiEdit, FiPrinter } from "react-icons/fi";
import { HiOutlineUsers } from "react-icons/hi";
import EmployeeForm from "../components/EmployeeForm";
import "../styles/pages/_employees.scss";

export const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [employees, searchTerm, genderFilter, statusFilter]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/employees");
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...employees];

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by gender
    if (genderFilter) {
      filtered = filtered.filter(emp => emp.gender === genderFilter);
    }

    // Filter by status
    if (statusFilter !== "") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter(emp => emp.active === isActive);
    }

    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/employees/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("Failed to delete employee");
      
      await fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee. Please try again.");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    // Store previous state for potential rollback
    const previousEmployees = [...employees];
    
    // Optimistic update - update UI immediately
    const updatedEmployees = employees.map(emp =>
      emp.id === id ? { ...emp, active: !currentStatus } : emp
    );
    setEmployees(updatedEmployees);

    try {
      const employee = previousEmployees.find(emp => emp.id === id);
      if (!employee) {
        // Revert on error
        setEmployees(previousEmployees);
        return;
      }

      const response = await fetch(`http://localhost:5000/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...employee, active: !currentStatus })
      });

      if (!response.ok) {
        // Revert on error
        setEmployees(previousEmployees);
        throw new Error("Failed to update status");
      }
      
      // Refresh to ensure sync with server
      await fetchEmployees();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update employee status. Please try again.");
      // Ensure we refresh to get correct state
      await fetchEmployees();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Employees List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #111827; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #004A8F; color: white; }
            tr:nth-child(even) { background-color: #f9fafb; }
            img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; }
          </style>
        </head>
        <body>
          <h1>Employees List</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Profile</th>
                <th>Full Name</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>State</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredEmployees.map(emp => `
                <tr>
                  <td>${emp.id}</td>
                  <td>${emp.image ? `<img src="${emp.image}" alt="${emp.name}" />` : "N/A"}</td>
                  <td>${emp.name}</td>
                  <td>${emp.gender}</td>
                  <td>${emp.dob}</td>
                  <td>${emp.state}</td>
                  <td>${emp.active ? "Active" : "Inactive"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <p style="margin-top: 20px; text-align: center; color: #6b7280;">
            Total Employees: ${filteredEmployees.length}
          </p>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (id) => {
    setSelectedEmployees(prev =>
      prev.includes(id)
        ? prev.filter(empId => empId !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedEmployees.length === 0) {
      alert("Please select employees to delete");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedEmployees.length} employee(s)?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedEmployees.map(id =>
          fetch(`http://localhost:5000/employees/${id}`, { method: "DELETE" })
        )
      );
      setSelectedEmployees([]);
      await fetchEmployees();
    } catch (error) {
      console.error("Error deleting employees:", error);
      alert("Failed to delete employees. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="employees">
      <div className="employees-header">
        <h1>Employees</h1>
        <div className="employees-header-actions">
          <button className="btn-export" onClick={handlePrint}>
            <FiUpload size={16} />
            Export / Print
          </button>
          {selectedEmployees.length > 0 && (
            <button className="btn-bulk-delete" onClick={handleBulkDelete}>
              <FiTrash2 size={16} />
              Delete ({selectedEmployees.length})
            </button>
          )}
          <button className="btn-add" onClick={handleAddEmployee}>
            <FiPlus size={16} />
            Add Employee
          </button>
        </div>
      </div>

      <div className="employees-filters">
        <div className="search-box">
          <FiSearch className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search Employee"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="filter-actions">
          <button
            className="btn-filter"
            onClick={() => {
              setSearchTerm("");
              setGenderFilter("");
              setStatusFilter("");
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="employees-loading">
          <div className="loading-spinner"></div>
          <p>Loading employees...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="employees-empty">
          <HiOutlineUsers size={64} />
          <h3>No employees found</h3>
          <p>{searchTerm || genderFilter || statusFilter ? "Try adjusting your filters" : "Get started by adding your first employee"}</p>
        </div>
      ) : (
        <div className="employees-table-container">
          <table className="employees-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>EMPLOYEE ID</th>
                <th>PROFILE IMAGE</th>
                <th>FULL NAME</th>
                <th>GENDER</th>
                <th>DATE OF BIRTH</th>
                <th>STATE</th>
                <th>STATUS</th>
                <th>ACTIVE / INACTIVE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => handleSelectEmployee(emp.id)}
                    />
                  </td>
                  <td>{emp.id}</td>
                  <td>
                    {emp.image ? (
                      <img src={emp.image} alt={emp.name} className="employee-avatar" />
                    ) : (
                      <div className="employee-avatar-placeholder">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="employee-name">{emp.name}</td>
                  <td>{emp.gender}</td>
                  <td>{formatDate(emp.dob)}</td>
                  <td>{emp.state}</td>
                  <td>
                    <span className={`status-badge ${emp.active ? "active" : "inactive"}`}>
                      {emp.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={emp.active}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(emp.id, emp.active);
                        }}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </td>
                  <td className="table-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditEmployee(emp)}
                      title="Edit"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteEmployee(emp.id)}
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                    {/* <button
                      className="action-btn print"
                      onClick={handlePrint}
                      title="Print"
                    >
                      <FiPrinter size={16} />
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EmployeeForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEmployee(null);
        }}
        employee={editingEmployee}
        onSave={fetchEmployees}
      />
    </div>
  );
};
