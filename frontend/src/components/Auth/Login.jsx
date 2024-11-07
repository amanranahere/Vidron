import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { login } from "../../store/authSlice.js";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios.helper.js";
import Logo from "../Logo";
import Input from "../Input";
import Button from "../Button";
import { icons } from "../Icons.jsx";

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
    <div className="h-screen w-full overflow-y-auto bg-[#121212] text-white">
      <div className="mx-auto my-28 flex w-full max-w-sm flex-col px-4">
        <div className="mx-auto inline-block">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="my-4 w-full text-center text-xl font-semibold">
          Log in to your account
        </div>

        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

        <form
          onSubmit={handleSubmit(handleLogin)}
          className="mx-auto mt-2 flex w-full max-w-sm flex-col px-4"
        >
          {/* email input */}
          <Input
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            className="px-2 rounded-lg"
            required
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Email address must be a valid address",
              },
            })}
          />

          {errors.email && (
            <p className="text-red-600 px-2 mt-1">{errors.email.message}</p>
          )}

          {/* password input */}
          <Input
            label="Password"
            className="px-2 rounded-lg"
            className2="pt-5"
            type={passwordVisible ? "text" : "password"}
            placeholder="Enter your password"
            required
            {...register("password", {
              required: "Password is required",
            })}
          />

          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              id="togglePassword"
              className="mr-2"
              onChange={() => setPasswordVisible(!passwordVisible)}
            />
            <label htmlFor="togglePassword">Show Password</label>
          </div>

          {errors.password && (
            <p className="text-red-600 px-2 mt-1">{errors.password.message}</p>
          )}

          {/* submit button */}
          <Button
            type="submit"
            disabled={loading}
            className="mt-5 disabled:cursor-not-allowed py-2 rounded-lg"
            bgColor={loading ? "bg-pink-800" : "bg-pink-600"}
          >
            {loading ? <span>{icons.loading}</span> : "Sign in"}
          </Button>
        </form>

        <h6 className="mx-auto mt-4">
          Don't have an Account yet?{" "}
          <Link
            to={"/signup"}
            className="font-semibold text-blue-600 hover:text-blue-500"
          >
            Sign up now
          </Link>
        </h6>
      </div>
    </div>
  );
}

export default Login;
