import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { setStats } from "../store/metricsSlice.js";

const getChannelStats = async (dispatch) => {
  try {
    const response = await axiosInstance.get("/metrics/stats");

    if (response?.data?.success) {
      dispatch(setStats(response.data.data));
    }
  } catch (error) {
    toast.error("Error getting channel stats");
    console.log(error);
  }
};

export default getChannelStats;
