import { useState, useEffect } from "react";
import { FiX, FiUpload } from "react-icons/fi";
import "../styles/components/_employeeForm.scss";

const EmployeeForm = ({ isOpen, onClose, employee, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    state: "",
    active: true,
    image: ""
  });
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        gender: employee.gender || "",
        dob: employee.dob || "",
        state: employee.state || "",
        active: employee.active !== undefined ? employee.active : true,
        image: employee.image || ""
      });
      setImagePreview(employee.image || "");
    } else {
      setFormData({
        name: "",
        gender: "",
        dob: "",
        state: "",
        active: true,
        image: ""
      });
      setImagePreview("");
    }
    setErrors({});
  }, [employee, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: "Only JPEG, PNG, and WebP images are allowed"
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: "Image size should be less than 5MB"
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
        if (errors.image) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.image;
            return newErrors;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Full Name must be at least 2 characters";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      if (dob > today) {
        newErrors.dob = "Date of Birth cannot be in the future";
      }
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const employeeData = {
        ...formData,
        name: formData.name.trim()
      };

      if (employee && employee.id) {
        // Update existing employee
        const response = await fetch(`http://localhost:5000/employees/${employee.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ...employeeData, id: employee.id })
        });
        
        if (!response.ok) throw new Error("Failed to update employee");
      } else {
        // Create new employee
        const response = await fetch("http://localhost:5000/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(employeeData)
        });
        
        if (!response.ok) throw new Error("Failed to create employee");
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Failed to save employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="employee-form-overlay" onClick={onClose}>
      <div className="employee-form-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="employee-form-header">
          <div>
            <h2>{employee ? "Edit Employee" : "Add Employee"}</h2>
            <p>{employee ? "Update employee information" : "Add your employee and necessary information from here"}</p>
          </div>
          <div className="employee-form-header-actions">
            <select className="employee-form-lang">
              <option value="en">en</option>
            </select>
            <button className="employee-form-close" onClick={onClose}>
              <FiX size={24} />
            </button>
          </div>
        </div>

        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="employee-form-field">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="employee-form-field">
            <label>Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={errors.gender ? "error" : ""}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </div>

          <div className="employee-form-field">
            <label>Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={errors.dob ? "error" : ""}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.dob && <span className="error-message">{errors.dob}</span>}
          </div>

          <div className="employee-form-field">
            <label>Profile Image</label>
            <div className="employee-form-image-upload">
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => {
                      setImagePreview("");
                      setFormData(prev => ({ ...prev, image: "" }));
                    }}
                  >
                    <FiX size={20} />
                  </button>
                </div>
              ) : (
                <label className="image-upload-area">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <div className="image-upload-content">
                    <FiUpload size={48} color="#004A8F" />
                    <p>Drag your image here</p>
                    <span>(Only *.jpeg, *.webp and *.png images will be accepted)</span>
                  </div>
                </label>
              )}
            </div>
            {errors.image && <span className="error-message">{errors.image}</span>}
          </div>

          <div className="employee-form-field">
            <label>State *</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={errors.state ? "error" : ""}
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <span className="error-message">{errors.state}</span>}
          </div>

          <div className="employee-form-field">
            <label>Status</label>
            <div className="employee-form-toggle">
              <span className={!formData.active ? "active" : ""}>Inactive</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className={formData.active ? "active" : ""}>Active</span>
            </div>
          </div>

          <div className="employee-form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : employee ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
