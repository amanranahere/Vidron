import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { addUserSubscribed } from "../store/userSlice.js";

const getUserSubscribed = async (dispatch, subscriberId) => {
  try {
    const response = await axiosInstance.get(
      `/subscriptions/user/${subscriberId}`
    );

    if (response?.data?.data) {
      dispatch(addUserSubscribed(response.data.data));
      return response.data;
    }
  } catch (error) {
    toast.warn("No data found for subscriptions");
  }
};

export default getUserSubscribed;
