import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { addWorkerAPI } from "../../services/Allapi";
import { toast, ToastContainer } from "react-toastify";


const WorkerForm = () => {
  const [formData, setFormData] = useState({
    place: "",
    district: "",
    age: "",
    serviceType: "",
    experience: "", // New field
    resume: null,
    profilepic: null,
  });

  const [errors, setErrors] = useState({
    age: "",
    experience: "", // New error field
    resume: "",
    profilepic: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMsg = "";

    // Validation logic
    switch (name) {
      case "age":
        const age = Number(value);
        if (age < 18 || age > 60) {
          errorMsg = "Age must be between 18 and 60.";
        }
        break;

      case "experience":
        const experience = Number(value);
        if (experience < 0 || experience > 50) {
          errorMsg = "Experience must be between 0 and 50 years.";
        }
        break;

      default:
        break;
    }

    // Update errors and form data
    setErrors({ ...errors, [name]: errorMsg });
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    let errorMsg = "";

    // File validation
    if (files[0]) {
      if (name === "resume" && files[0].type !== "application/pdf") {
        errorMsg = "Only PDF files are allowed for resume.";
      } else if (name === "profilepic" && !["image/jpeg", "image/png"].includes(files[0].type)) {
        errorMsg = "Only JPG and PNG files are allowed for profile picture.";
      }
    }

    // Update errors and form data
    setErrors({ ...errors, [name]: errorMsg });
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmitFormData = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("place", formData.place);
    formDataToSend.append("district", formData.district);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("serviceType", formData.serviceType);
    formDataToSend.append("experience", formData.experience); // Append the new field

    if (formData.resume) {
      formDataToSend.append("resume", formData.resume);
    }
    if (formData.profilepic) {
      formDataToSend.append("profilePic", formData.profilepic);
    }

    try {
      const reqHeader = {
        Authorization: `Bearer ${token}`,
      };

      const result = await addWorkerAPI(formDataToSend, reqHeader);
      console.log("API Response:", result);

      if (result.status === 200) {
        console.log("Worker details added successfully!");
        toast.success("Updated Details successfully!", { position: "top-center" });

        setFormData({
          place: "",
          district: "",
          age: "",
          serviceType: "",
          experience: "", // Reset the new field
          resume: null,
          profilepic: null,
        });
      } else {
        toast.error("Updated Details Faild", { position: "top-center" });

        console.error("Failed to add worker details:", result.data);
      }
    } catch (err) {
      console.error("Error in API call:", err);
      toast.error("Something went wrong", { position: "top-center" });

    }
  };

  return (
    <div className="container mt-4 p-4 border rounded shadow bg-light">
      <h2 className="mb-4 text-center text-primary">Worker Registration Form</h2>
      <form onSubmit={handleSubmitFormData}>
        {/* Place Field */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Place</label>
            <input
              type="text"
              name="place"
              className="form-control"
              placeholder="Enter Place"
              value={formData.place}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* District  */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">District</label>
            <select
              name="district"
              className="form-select"
              value={formData.district}
              onChange={handleChange}
            >
              <option value="">Select District</option>
              <option>Thiruvananthapuram</option>
              <option>Kollam</option>
              <option>Pathanamthitta</option>
              <option>Alappuzha</option>
              <option>Kottayam</option>
              <option>Idukki</option>
              <option>Ernakulam</option>
              <option>Thrissur</option>
              <option>Palakkad</option>
              <option>Malappuram</option>
              <option>Kozhikode</option>
              <option>Wayanad</option>
              <option>Kannur</option>
              <option>Kasaragod</option>
            </select>
          </div>
          
        </div>

        {/* Service Type Field */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Service Type</label>
            <select
              name="serviceType"
              className="form-select"
              value={formData.serviceType}
              onChange={handleChange}
            >
              <option value="">Select Service Type</option>
              <option value="Plumber">Plumber</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Electrician">Electrician</option>
            </select>
          </div>
        </div>

        {/* Age Field */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Age</label>
            <input
              type="number"
              name="age"
              className="form-control"
              placeholder="Enter Age"
              min="18"
              max="60"
              value={formData.age}
              onChange={handleChange}
            />
            {errors.age && <small className="text-danger">{errors.age}</small>}
          </div>
        </div>

        {/* Experience Field */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Experience (in years)</label>
            <input
              type="number"
              name="experience"
              className="form-control"
              placeholder="Enter Experience"
              min="0"
              max="50"
              value={formData.experience}
              onChange={handleChange}
            />
            {errors.experience && <small className="text-danger">{errors.experience}</small>}
          </div>
        </div>

        {/* File Uploads */}
        <div className="mb-3">
          <label className="form-label fw-bold">Upload Resume (Only PDF Allowed)</label>
          <input
            type="file"
            name="resume"
            className="form-control"
            accept=".pdf"
            onChange={handleFileChange}
          />
          {errors.resume && <small className="text-danger">{errors.resume}</small>}
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Upload Profile Picture (Only JPG and PNG Allowed)</label>
          <input
            type="file"
            name="profilepic"
            className="form-control"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
          />
          {errors.profilepic && <small className="text-danger">{errors.profilepic}</small>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default WorkerForm;