import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axiosInstance from "../../utils/axios.helper.js";
import { toast } from "react-toastify";
import { login } from "../../store/authSlice.js";
import Input from "../Input.jsx";
import { HiOutlineUpload } from "react-icons/hi";
import { icons } from "../Icons.jsx";

function EditPersonalInfo() {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const [loadingCoverImage, setLoadingCoverImage] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const viewify_coverImage = "/viewify_coverImage.jpg";
  const viewify_avatar = "/viewify_avatar";

  const defaultValues = {
    fullname: userData?.fullname,
    email: userData?.email,
  };

  const [data, setData] = useState(defaultValues);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm();

  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
  } = useForm();

  const handleSaveChange = async (data) => {
    try {
      const response = await axiosInstance.patch(`/users/update-account`, data);
      dispatch(login(response.data.data));
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Couldn't update account details. Try again!");
      console.log("Error while updating account details", error);
    }
  };

  const uploadCoverImage = async (data) => {
    setLoadingCoverImage(true);
    const formData = new FormData();
    formData.append("coverImage", data.coverImage[0]);

    try {
      const response = await axiosInstance.patch(
        `/users/cover-image`,
        formData
      );

      if (response.data?.data?.coverImage) {
        dispatch(
          login({
            ...userData,
            coverImage: response.data.data.coverImage,
          })
        );

        toast.success("Cover image updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
      console.log("Error while updating cover image", error);
    } finally {
      setLoadingCoverImage(false);
    }
  };

  const uploadAvatar = async (data) => {
    setLoadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", data.avatar[0]);

    try {
      const response = await axiosInstance.patch(`/users/avatar`, formData);

      if (response.data?.data?.avatar) {
        dispatch(
          login({
            ...userData,
            avatar: response.data.data.avatar,
          })
        );

        toast.success("Profile image updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
      console.log("Error while updating profile image", error);
    } finally {
      setLoadingAvatar(false);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full my-3 lg:my-6 pl-3">
        <p className="text-gray-300 font-semibold text-xl lg:text-3xl">
          Update your personal details
        </p>
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit(handleSaveChange)}>
          {/* full name input */}
          <div className="lg:w-[70%] px-2 py-2">
            <Input
              label="Full Name"
              type="text"
              id="fullname"
              className="px-2 py-2 rounded-lg"
              placeholder="Enter your full name"
              required
              defaultValue={userData?.fullname}
              {...register("fullname", {
                required: true,
                maxLength: {
                  value: 25,
                  message: "Fullname cannot exceed 25 characters",
                },
              })}
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  fullname: e.target.value,
                }))
              }
            />

            {errors.fullname && (
              <p className="text-red-600 px-2 mt-1">
                {errors.fullname.message}
              </p>
            )}
          </div>

          {/* email address input */}
          <div className="lg:w-[70%] px-2 py-2">
            <Input
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              id="email"
              className="px-2 py-2 rounded-lg"
              required
              defaultValue={userData?.email}
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  email: e.target.value,
                }))
              }
            />

            {errors.email && (
              <p className="text-red-600 px-2 mt-1 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* save and cancel buttons */}
          <div className="flex justify-start items-center gap-4 p-4 my-4">
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
              className="bg-red-400  px-8 py-1.5 inline-block rounded-lg hover:bg-red-400/70 active:bg-red-400/60 active:scale-95 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="md:w-full flex flex-col md:mx-4 gap-4 md:flex-row">
          {/* avatar */}
          <div className="relative inline-block w-[80%] md:w-auto md:h-60 lg:w-auto overflow-hidden rounded-lg">
            <p className="pl-3 md:pl-0 text-[#00bfff]">Avatar</p>
            <img
              src={
                userData && userData.avatar ? userData.avatar : viewify_avatar
              }
              alt="image"
              className="h-full w-full object-cover"
            />

            <form
              onChange={handleSubmit3(uploadAvatar)}
              className="absolute inset-0 flex items-center justify-center"
            >
              <input
                id="profile-image"
                type="file"
                className="hidden"
                required
                {...register3("avatar", {
                  required: true,
                  validate: (file) => {
                    if (!file[0]) return true;
                    const allowedExtensions = [
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                    ];
                    const fileType = file[0]?.type;
                    return allowedExtensions.includes(fileType)
                      ? true
                      : "Invalid file type! Only .png .jpg and .jpeg files are accepted";
                  },
                })}
              />

              {errors3.avatar && toast.error(errors3.avatar.message)}

              <label htmlFor="profile-image" className="inline-block">
                {loadingAvatar ? (
                  <span className="flex justify-center mt-20">
                    {icons.loading}
                  </span>
                ) : (
                  <HiOutlineUpload className="text-white w-8 h-8 rounded-lg bg-white/50 p-1 hover:bg-[#4a4a4a] active:scale-95 cursor-pointer" />
                )}
              </label>
            </form>
          </div>

          {/* cover image */}
          <div className="relative h-60 w-screen md:w-[25rem] mt-8 md:mt-0 mb-20 md:pb-0">
            <p className="pl-3 md:pl-0 text-[#00bfff]">Cover Image</p>
            <div className="absolute top-7 inset-0 overflow-hidden">
              <img
                src={userData?.coverImage || viewify_coverImage}
                alt="cover-image"
                className="object-cover"
              />
            </div>

            <form
              onChange={handleSubmit2(uploadCoverImage)}
              className="absolute top-10 inset-0 flex items-center justify-center"
            >
              <input
                id="cover-image"
                type="file"
                className="hidden"
                required
                {...register2("coverImage", {
                  required: true,
                  validate: (file) => {
                    if (!file[0]) return true;

                    const allowedExtensions = [
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                    ];

                    const fileType = file[0]?.type;
                    return allowedExtensions.includes(fileType)
                      ? true
                      : "Invalid file type! Only .png .jpg and .jpeg files are accepted";
                  },
                })}
              />

              {errors2.coverImage && toast.error(errors2.coverImage.message)}

              <label htmlFor="cover-image" className="inline-block h-10 w-10 ">
                {loadingCoverImage ? (
                  <span className="flex justify-center items-center">
                    {icons.loading}
                  </span>
                ) : (
                  <HiOutlineUpload className="text-white w-8 h-8 rounded-lg bg-white/50 p-1 hover:bg-[#4a4a4a] active:scale-95 cursor-pointer" />
                )}
              </label>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPersonalInfo;
