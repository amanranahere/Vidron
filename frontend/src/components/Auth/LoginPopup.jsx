import React, { useRef, useImperativeHandle, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { login } from "../../store/authSlice.js";
import { useNavigate, Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios.helper.js";
import { icons } from "../Icons.jsx";
import { IoClose } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../Logo";

function LoginPopup({ route }, ref) {
  const dialog = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useImperativeHandle(
    ref,
    () => {
      return {
        open() {
          setShowPopup(true);
        },
        close() {
          handleClose();
        },
      };
    },
    []
  );

  useEffect(() => {
    if (showPopup) {
      dialog.current.showModal();
    }
  }, [showPopup]);

  const handleLogin = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/users/login", data);

      if (response?.data?.data) {
        dispatch(login(response.data.data.user));
        localStorage.setItem("accessToken", response.data.data.accessToken);
        toast.success(response.data.message);

        if (route) {
          navigate(route);
        }

        dialog.current.close();
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

  const handleClose = () => {
    dialog.current.close();
    setShowPopup(false);

    if (route) navigate(route);
  };

  return (
    <div className="absolute">
      {showPopup &&
        createPortal(
          <dialog
            ref={dialog}
            onClose={handleClose}
            className="p-4 md:p-8 bg-[#1a1a1a] rounded-[20px] border border-[#333] backdrop:backdrop-blur-sm"
          >
            <div className="">
              <button
                autoFocus
                type="button"
                onClick={handleClose}
                className="absolute right-2 top-3 h-7 w-7 focus:border-dotted hover:bg-gray-700 hover:rounded-[20px] text-[#00bfff]"
              >
                <IoClose className="w-7 h-7 transform origin-center" />
              </button>

              <form onSubmit={handleSubmit(handleLogin)} className="">
                <p className="signup-title">Login</p>
                <p className="signup-message">
                  Great to see you again! Ready to dive in?{" "}
                </p>

                {error && (
                  <p className="text-red-600 mt-3 text-center">{error}</p>
                )}

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
                      <p className="text-red-600 px-2 mt-1">
                        {errors.email.message}
                      </p>
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
                      {loading ? <span>{icons.loading}</span> : "Login"}
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
          </dialog>,
          document.getElementById("popup-models")
        )}
    </div>
  );
}

export default React.forwardRef(LoginPopup);
