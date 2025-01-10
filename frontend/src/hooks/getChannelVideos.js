import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { setVideos } from "../store/metricsSlice.js";

const getChannelVideos = async (dispatch) => {
  try {
    const response = await axiosInstance.get("/metrics/videos");

    if (response?.data?.success) {
      dispatch(setVideos(response.data.data));
    }
  } catch (error) {
    toast.error("Error getting channel videos");
    console.log(error);
  }
};

export default getChannelVideos;
