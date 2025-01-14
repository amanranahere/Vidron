import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../Button.jsx";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios.helper.js";
import Input from "../Input.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ChangePassword() {
  const defaultValues = {
    oldPassword: "",
    newPassword: "",
    confPassword: "",
  };

  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [data, setData] = useState(defaultValues);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleSaveChange = async (newData) => {
    if (newData.newPassword !== newData.confPassword) {
      toast.error("Confirm password not matching");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/users/change-password`,
        newData
      );
      toast.success(response.data.message);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Invalid current password");
      } else {
        toast.error("Couldn't update password. Try again!");
      }
      console.log("Error while updating the password", error);
    }
  };

  return (
    <div className="">
      <div className="w-full my-3 md:my-6 pl-3">
        <p className="text-gray-300 font-semibold text-xl md:text-3xl">
          Update your password
        </p>
      </div>

      <div className="lg:w-[70%]">
        <form onSubmit={handleSubmit(handleSaveChange)}>
          {/* current password input */}
          <div className="relative w-full px-4 py-2">
            <Input
              label="Current Password"
              type={oldPasswordVisible ? "text" : "password"}
              id="old-pwd"
              className="px-2 py-2 rounded-lg"
              placeholder="Enter your current password"
              required
              {...register("oldPassword", { required: true })}
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  oldPassword: e.target.value,
                }))
              }
            />

            <div className="absolute inset-y-0 right-6 top-7 flex items-center">
              {oldPasswordVisible ? (
                <FaEye
                  className="cursor-pointer"
                  onClick={() => setOldPasswordVisible(!oldPasswordVisible)}
                />
              ) : (
                <FaEyeSlash
                  className="cursor-pointer"
                  onClick={() => setOldPasswordVisible(!oldPasswordVisible)}
                />
              )}
            </div>
          </div>

          {/* new password input */}
          <div className="relative w-full px-4 py-2">
            <Input
              label="New Password"
              placeholder="Enter your new password"
              type={newPasswordVisible ? "text" : "password"}
              className="px-2 py-2 rounded-lg"
              required
              {...register("newPassword", {
                required: true,
                validate: {
                  passLength: (value) =>
                    value.length > 8 ||
                    "Password must be more than 8 characters",
                },
              })}
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  newPassword: e.target.value,
                }))
              }
            />

            <div className="absolute inset-y-0 right-6 top-7 flex items-center">
              {newPasswordVisible ? (
                <FaEye
                  className="cursor-pointer"
                  onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                />
              ) : (
                <FaEyeSlash
                  className="cursor-pointer"
                  onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                />
              )}
            </div>

            {errors.newPassword && (
              <p className="text-red-600 px-2 mt-0.5 text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* confirm password input */}
          <div className="w-full px-4 py-2">
            <Input
              label="Confirm Password"
              placeholder="Enter your new password again"
              type="text"
              className="px-2 py-2 rounded-lg"
              required
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  confPassword: e.target.value,
                }))
              }
            />
          </div>

          {/* save and cancel buttons */}
          <div className="flex items-center justify-start gap-4 p-4 mt-4">
            <button
              type="submit"
              disabled={JSON.stringify(data) === JSON.stringify(defaultValues)}
              className="inline-block rounded-lg px-5 py-1.5 bg-[#00bfff] hover:bg-[#00bfff96] active:bg-[#00bfff63] active:scale-95 disabled:cursor-not-allowed"
            >
              Update Password
            </button>

            <button
              onClick={() => {
                reset();
                setData(defaultValues);
              }}
              disabled={JSON.stringify(data) === JSON.stringify(defaultValues)}
              className="bg-red-400 px-8 py-1.5 inline-block rounded-lg hover:bg-red-400/70 active:bg-red-400/60 active:scale-95 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
