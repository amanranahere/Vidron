import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { addUser } from "../store/userSlice.js";

const getUserProfile = async (dispatch, username) => {
  try {
    const response = await axiosInstance.get(`/users/channel/${username}`);

    if (response?.data?.data) {
      dispatch(addUser(response.data.data));
      return response.data;
    }
  } catch (error) {
    toast.error("Error fetching user profile");
  }
};

export default getUserProfile;
