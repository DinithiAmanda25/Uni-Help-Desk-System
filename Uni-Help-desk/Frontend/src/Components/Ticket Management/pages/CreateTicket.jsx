import { useState, useRef } from "react";
import { createTicket } from "../services/ticketService";

function CreateTicket() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Low",
    studentName: "",
    studentId: "",
    studentEmail: "",
    createdDate: "",
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const validate = () => {
    let newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title required";
    if (!form.description.trim()) newErrors.description = "Description required";
    if (!form.category.trim()) newErrors.category = "Category required";
    if (!form.studentName.trim()) newErrors.studentName = "Student name required";

    if (!form.studentId.trim()) {
      newErrors.studentId = "Student ID required";
    } else if (form.studentId.trim().length !== 10) {
      newErrors.studentId = "Student ID must be exactly 10 characters";
    }

    if (!form.studentEmail.trim()) {
      newErrors.studentEmail = "Email required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.studentEmail)) {
      newErrors.studentEmail = "Invalid email format";
    }

    if (!form.createdDate) newErrors.createdDate = "Date required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (file) {
        formData.append("attachment", file);
      }

      await createTicket(formData);

      alert("✅ Ticket Created Successfully");

      setForm({
        title: "",
        description: "",
        category: "",
        priority: "Low",
        studentName: "",
        studentId: "",
        studentEmail: "",
        createdDate: "",
      });

      setFile(null);
      setErrors({});

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log("Create ticket error:", error);
      console.log("Response data:", error?.response?.data);
      alert(error?.response?.data?.message || "❌ Failed to create ticket");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Create Ticket</h3>

      <form onSubmit={handleSubmit}>
        <input
          className={`form-control mb-1 ${errors.title ? "is-invalid" : ""}`}
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        {errors.title && (
          <small className="text-danger d-block mb-2">{errors.title}</small>
        )}

        <textarea
          className={`form-control mb-1 ${errors.description ? "is-invalid" : ""}`}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {errors.description && (
          <small className="text-danger d-block mb-2">{errors.description}</small>
        )}

        <select
          className={`form-control mb-1 ${errors.category ? "is-invalid" : ""}`}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>
          <option value="Account">Account</option>
          <option value="Technical">Technical</option>
          <option value="Academic">Academic</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && (
          <small className="text-danger d-block mb-2">{errors.category}</small>
        )}

        <select
          className="form-control mb-2"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <input
          className={`form-control mb-1 ${errors.studentName ? "is-invalid" : ""}`}
          placeholder="Student Name"
          value={form.studentName}
          onChange={(e) => setForm({ ...form, studentName: e.target.value })}
        />
        {errors.studentName && (
          <small className="text-danger d-block mb-2">{errors.studentName}</small>
        )}

        <input
  className={`form-control mb-1 ${errors.studentId ? "is-invalid" : ""}`}
  placeholder="Student ID"
  value={form.studentId}
  maxLength={10}   // 🔥 LIMIT 10 CHARACTERS
  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
/>
        <input
          type="email"
          className={`form-control mb-1 ${errors.studentEmail ? "is-invalid" : ""}`}
          placeholder="Student Email"
          value={form.studentEmail}
          onChange={(e) => setForm({ ...form, studentEmail: e.target.value })}
        />
        {errors.studentEmail && (
          <small className="text-danger d-block mb-2">{errors.studentEmail}</small>
        )}

        <input
          type="date"
          className={`form-control mb-1 ${errors.createdDate ? "is-invalid" : ""}`}
          value={form.createdDate}
          onChange={(e) => setForm({ ...form, createdDate: e.target.value })}
        />
        {errors.createdDate && (
          <small className="text-danger d-block mb-2">{errors.createdDate}</small>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="form-control mb-2"
          onChange={handleFileChange}
        />

        {file && (
          <div className="d-flex justify-content-between align-items-center border rounded p-2 mb-3 bg-light">
            <span>{file.name}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={handleRemoveFile}
            >
              Remove File
            </button>
          </div>
        )}

        <button className="btn btn-primary w-100">
          Submit Ticket
        </button>
      </form>
    </div>
  );
}

export default CreateTicket;