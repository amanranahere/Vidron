import axiosInstance from "../utils/axios.helper.js";
import { addUserVideoHistory } from "../store/userSlice.js";
import { toast } from "react-toastify";

const getUserVideoHistory = async (dispatch, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `/users/videos-history?page=${page}&limit=${limit}`
    );

    if (response?.data?.data) {
      dispatch(addUserVideoHistory(response.data.data));
      return response.data;
    }
  } catch (error) {
    toast.error("Error fetching user history");
    console.log(error);
  }
};

export default getUserVideoHistory;
