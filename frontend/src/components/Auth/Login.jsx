import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { login } from "../../store/authSlice.js";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios.helper.js";
import Logo from "../Logo";
import { icons } from "../Icons.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/users/login", data);

      if (response?.data?.data) {
        dispatch(login(response.data.data.user));
        localStorage.setItem("accessToken", response.data.data.accessToken);

        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      if (error.status === 401) {
        setError("Invalid credentials");
      } else if (error.status === 500) {
        setError("Server is not working");
      } else if (error.status === 404) {
        setError("User does not exist");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-[#121212] text-white flex justify-center items-center">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="p-8 bg-[#1a1a1a] rounded-[20px] border border-[#333]"
      >
        <p className="signup-title">Login</p>
        <p className="signup-message">
          Great to see you again! Ready to dive in?{" "}
        </p>

        {error && <p className="text-red-600 mt-3 text-center">{error}</p>}

        <div className="h-full w-full mt-6">
          <div className="signup-form">
            {/* email input */}
            <label>
              <input
                className="signup-input"
                type="email"
                placeholder=""
                required
                {...register("email", {
                  required: "Email required",
                  validate: {
                    matchPattern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                        value
                      ) || "Email address must be a valid address",
                  },
                })}
              />
              <span>Email</span>
            </label>

            {errors.email && (
              <p className="text-red-600 px-2 mt-1">{errors.email.message}</p>
            )}

            {/* password input */}
            <label className="relative">
              <input
                className="signup-input pr-10"
                type={passwordVisible ? "text" : "password"}
                placeholder=""
                required
                {...register("password", {
                  required: "Password required",
                })}
              />
              <span>Password</span>

              <div className="absolute inset-y-0 right-2 flex items-center">
                {passwordVisible ? (
                  <FaEye
                    className="cursor-pointer"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  />
                ) : (
                  <FaEyeSlash
                    className="cursor-pointer"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  />
                )}
              </div>
            </label>

            {errors.password && (
              <p className="text-red-600 px-2 mt-1">
                {errors.password.message}
              </p>
            )}

            {/* submit button */}
            <button
              className="signup-submit select-none"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="w-full h-full flex justify-center items-center">
                  {icons.loading}
                </span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </div>

        <h6 className="signup-signin mt-4">
          Don't have an Account yet ?{" "}
          <Link
            to={"/signup"}
            className="font-semibold text-blue-600 hover:text-blue-500"
          >
            Sign up now
          </Link>
        </h6>
      </form>
    </div>
  );
}

export default Login;
