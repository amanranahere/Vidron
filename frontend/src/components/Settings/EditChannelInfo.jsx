import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Button from "../Button.jsx";
import { toast } from "react-toastify";
import { login } from "../../store/authSlice.js";
import axiosInstance from "../../utils/axios.helper.js";

function EditChannelInfo() {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const defaultValues = {
    username: userData?.username || "",
    description: userData?.description || "",
  };

  const [data, setData] = useState(defaultValues);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleSaveChange = async (newData) => {
    if (defaultValues.username === newData?.username) {
      newData = { ...newData, username: "" };
    }
    try {
      const response = await axiosInstance.patch(
        `/users/update-account`,
        newData
      );
      dispatch(login(response.data.data));
      toast.success(response.data.message);
    } catch (error) {
      if (error.status === 409) {
        toast.error("Username already exists");
      } else {
        toast.error("Couldn't update account details. Try again!");
      }
      console.log("Error while updating account details", error);
    }
  };

  return (
    <div className="">
      <div className="w-full my-3 lg:my-6 pl-3">
        <p className="text-gray-300 font-semibold text-xl md:text-3xl">
          Update your channel details
        </p>
      </div>

      <div className="lg:w-[70%]">
        <form onSubmit={handleSubmit(handleSaveChange)}>
          {/* username input */}
          <div className="w-full px-4 py-2">
            <label
              htmlFor="username"
              className="inline-block mb-1 pl-1 text-[#00bfff]"
            >
              Username
            </label>

            <div className="flex rounded-lg">
              <p className="flex shrink-0 rounded-l-lg items-center bg-[#2a2a2a] pl-3 text-white/70">
                vidron.com/
              </p>

              <input
                type="text"
                id="username"
                className="py-2 px-2 bg-[#2a2a2a] text-white outline-none duration-200 rounded-r-lg focus:bg-[#3a3a3a] w-full"
                placeholder="Enter your username"
                required
                defaultValue={userData.username}
                {...register("username", {
                  required: true,
                  maxLength: {
                    value: 25,
                    message: "Username cannot exceed 25 characters",
                  },
                })}
                onChange={(e) =>
                  setData((prevData) => ({
                    ...prevData,
                    username: e.target.value,
                  }))
                }
              />
            </div>

            {errors.username && (
              <p className="text-red-600 px-2 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* description */}
          <div className="w-full px-4 py-2">
            <label
              htmlFor="desc"
              className="mb-1 pl-1 inline-block text-[#00bfff]"
            >
              Description
            </label>

            <div className="relative">
              <textarea
                placeholder="Enter your channel description"
                name="desc"
                type="text"
                className="px-2 rounded-lg w-full py-1 bg-[#2a2a2a] text-white outline-none duration-200 focus:bg-[#3a3a3a] overflow-y-auto scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-black resize-none"
                rows="4"
                defaultValue={userData.description}
                {...register("description", {
                  maxLength: {
                    value: 200,
                    message: "Description cannot exceed 200 characters",
                  },
                })}
                onChange={(e) =>
                  setData((prevData) => ({
                    ...prevData,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            {errors.description && (
              <p className="text-red-600 px-2 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* save and cancel buttons */}
          <div className="flex justify-start items-center gap-4 p-4 mt-4">
            <button
              type="submit"
              disabled={JSON.stringify(data) === JSON.stringify(defaultValues)}
              className="inline-block rounded-lg px-10 py-1.5 bg-[#00bfff] hover:bg-[#00bfff96] active:bg-[#00bfff63] active:scale-95 disabled:cursor-not-allowed"
            >
              Save
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

export default EditChannelInfo;
