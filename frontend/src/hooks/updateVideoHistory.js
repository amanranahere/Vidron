import axiosInstance from "../utils/axios.helper.js";
import { addUserVideoHistory } from "../store/userSlice.js";

const updateVideoHistory = async (videoId) => {
  try {
    const response = await axiosInstance.post(
      `/users/watch-history/video/${videoId}`
    );
    console.log("response in updatevideohistory : ", response);
    if (response?.data?.data) {
      dispatch(addUserVideoHistory([videoId]));
      return response.data;
    }
  } catch (error) {
    console.log("Failed to update watch history", error);
  }
};

export default updateVideoHistory;
