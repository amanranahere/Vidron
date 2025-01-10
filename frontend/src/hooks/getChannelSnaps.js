import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { setSnaps } from "../store/metricsSlice.js";

const getChannelSnaps = async (dispatch) => {
  try {
    const response = await axiosInstance.get("/metrics/snaps");

    if (response?.data?.success) {
      dispatch(setSnaps(response.data.data));
    }
  } catch (error) {
    toast.error("Error getting channel snaps");
    console.log(error);
  }
};

export default getChannelSnaps;
