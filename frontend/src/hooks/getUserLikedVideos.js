import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { addUserLikedVideos } from "../store/userSlice.js";

const getUserLikedVideos = async (dispatch, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `/likes/videos?page=${page}&limit=${limit}`
    );

    if (response?.data?.data) {
      dispatch(addUserLikedVideos(response.data.data));
      return response.data;
    }
  } catch (error) {
    toast.error("Error fetching user liked videos");
    console.log(error);
  }
};

export default getUserLikedVideos;
