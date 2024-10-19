import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios.helper";
import { icons } from "../../assets/Icons.jsx";
import { toast } from "react-toastify";
import Logo from "../Logo";
import Input from "../Input";
import Button from "../Button";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const signup = async (data) => {
    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }

    formData.append("avatar", (data.avatar = [0]));

    if (data.coverImage) {
      formData.append("coverImage", data.coverImage[0]);
    }

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/users/register", formData);

      if (response?.data?.data) {
        toast.success("Account created successfully");
        navigate("/login");
      }
    } catch (error) {
      if (error.status === 409) {
        setError("User with email or username already exists");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-[#121212] text-white">
      <div className="mx-auto my-10 flex w-full max-w-sm flex-col px-4">
        <div className="mx-auto inline-block">
          <Link to="/">
            <Logo />
          </Link>

          <div className="my-4 w-full text-center text-xl font-semibold">
            Create an Account
          </div>

          <h6 className="mx-auto mb-1">
            Already have an Account?{" "}
            <Link
              to={"/login"}
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              Sign in now
            </Link>
          </h6>

          {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

          <form
            onSubmit={handleSubmit(signup)}
            className="mx-auto mt-2 flex w-full max-w-sm flex-col px-4"
          >
            {/* full name input */}
            <Input
              label="Full Name"
              required
              className="px-2 rounded-lg"
              placeholder="Enter your full name"
              {...register("fullname", {
                required: "Full name required",
                maxLength: {
                  value: 25,
                  message: "Full name can't exceed 25 characters",
                },
              })}
            />

            {errors.fullname && (
              <p className="text-red-600 px-2 mt-1">
                {errors.fullname.message}
              </p>
            )}

            {/* username input */}
            <Input
              label="Username"
              required
              placeholder="Choose your username"
              className="px-2 rounded-lg"
              className2="pt-5"
              {...register("username", {
                required: "Username required",
                maxLength: {
                  value: 25,
                  message: "Username can't exceed 25 characters",
                },
              })}
            />

            {errors.username && (
              <p className="text-red-600 px-2 mt-1">
                {errors.username.message}
              </p>
            )}

            {/* email input */}
            <Input
              label="Email Address"
              required
              placeholder="Enter your email address"
              type="email"
              className="px-2 rounded-lg"
              className2="pt-5"
              {...register("email", {
                required: "Email required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Email address must be a valid address",
                },
              })}
            />

            {errors.email && (
              <p text-red-600 px-2 mt-1>
                {errors.email.message}
              </p>
            )}

            {/* password input */}
            <Input
              label="Password"
              placeholder="Create your password"
              type={passwordVisible ? "text" : "password"}
              className="px-2 rounded-lg"
              className2="pt-5"
              {...register("password", {
                required: "Password required",
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
              <p className="text-red-600 px-2 mt-1">
                {errors.password.message}
              </p>
            )}

            {/* avatar input */}
            <Input
              label="Avatar"
              type="file"
              required
              placeholder="Upload your avatar"
              {...register("avatar", {
                required: "Avatar required",
                validate: (file) => {
                  const allowedExtension = [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                  ];
                  const fileType = file[0]?.type;
                  return allowedExtension.includes(fileType)
                    ? true
                    : "Invalid file type! Only .jpeg .jpg .png files are accepted";
                },
              })}
            />

            {errors.avatar && (
              <p className="text-red-600 px-2 mt-1">{errors.avatar.message}</p>
            )}

            {/* cover image input */}
            <Input
              label="Cover Image"
              type="file"
              placeholder="Upload your cover image"
              className="px-2 rounded-lg"
              className2="pt-5"
              {...register("coverImage", {
                required: false,
                validate: (file) => {
                  if (!file[0]) return true;

                  const allowedExtensions = [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                  ];
                  const fileType = file[0].type;
                  return allowedExtensions.includes(fileType)
                    ? true
                    : "Invalid file type! Only .jpeg .jpg .png files are accepted";
                },
              })}
            />

            {errors.coverImage && (
              <p className="text-red-600 px-2 mt-1">
                {errors.coverImage.message}
              </p>
            )}

            {/* submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="mt-5 disabled:cursor-not-allowed py-2 rounded-lg"
              bgColor={loading ? "bg-pink-800" : "bg-pink-600"}
            >
              {loading ? <span>{icons.loading}</span> : "Sign up"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
