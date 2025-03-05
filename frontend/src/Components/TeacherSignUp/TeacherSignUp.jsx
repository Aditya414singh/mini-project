import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL_PRODUCTION ||
  import.meta.env.VITE_BACKEND_URL_LOCAL;

const TeacherSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    school: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    // Clear error when user starts typing
    setErrors({ ...errors, [id]: "" });
  };

  // Validate form inputs
  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.school.trim())
      newErrors.school = "School/Institute name is required";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
        const res = await axios.post(`${backendUrl}/api/auth/teacher/register`, {

        name: formData.fullName,
        email: formData.email,
        institute: formData.school,
        password: formData.password,
      });
      console.log(res);
      navigate("/teacher/signin");
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({ ...errors, api: "Registration failed. Try again." });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-lg text-white flex flex-col border border-gray-700 p-6 rounded-lg shadow-xl backdrop-blur-lg bg-white/10"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Teacher Sign Up
        </h2>

        {[
          { id: "fullName", label: "Full Name", type: "text" },
          { id: "email", label: "Email", type: "email" },
          { id: "school", label: "School/Institute Name", type: "text" },
          { id: "password", label: "Password", type: "password" },
          { id: "confirmPassword", label: "Confirm Password", type: "password" },
        ].map(({ id, label, type }) => (
          <div key={id} className="flex flex-col mb-4">
            <label htmlFor={id} className="mb-1 text-gray-300">
              {label}:
            </label>
            <input
              id={id}
              type={type}
              className="p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={formData[id]}
              onChange={handleInputChange}
            />
            {errors[id] && <p className="text-red-400 text-sm">{errors[id]}</p>}
          </div>
        ))}

        {errors.api && <p className="text-red-400 text-center">{errors.api}</p>}

        <button
          type="submit"
          className="mt-4 w-full bg-green-600 text-white p-3 rounded-lg font-bold shadow-md transition-all duration-300 ease-in-out hover:bg-green-700 active:scale-95"
        >
          Sign Up
        </button>

        <div className="flex justify-center space-x-2 mt-3 text-gray-300">
          <span>Already have an account?</span>
          <Link to="/teacher/signin" className="text-green-400 hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default TeacherSignUp;