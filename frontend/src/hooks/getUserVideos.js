import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { addUserVideo } from "../store/userSlice.js";

const getUserVideos = async (
  dispatch,
  userId,
  sortType,
  page = 1,
  limit = 10
) => {
  try {
    const response = await axiosInstance.get(`/videos/user/${userId}`, {
      params: {
        sortType: sortType,
        page: page,
        limit: limit,
      },
    });

    if (response?.data?.data) {
      dispatch(addUserVideo(response.data.data));
      return response.data;
    }
  } catch (error) {
    toast.error("Error fetching user videos");
    console.log(error);
  }
};

export default getUserVideos;
