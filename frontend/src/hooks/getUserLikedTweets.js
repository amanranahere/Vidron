import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { addUserLikedTweets } from "../store/userSlice.js";

const getUserLikedTweets = async (dispatch, page = 1, limit = 20) => {
  try {
    const response = await axiosInstance.get(
      `/likes/tweets?page=${page}&limit=${limit}`
    );

    if (response?.data?.data) {
      dispatch(addUserLikedTweets(response.data.data));
      return response.data;
    }
  } catch (error) {
    toast.error("Error fetching user liked tweets");
    console.log(error);
  }
};

export default getUserLikedTweets;
