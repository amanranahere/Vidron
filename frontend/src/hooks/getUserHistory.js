import axiosInstance from "../utils/axios.helper.js";
import { addUserHistory } from "../store/userSlice.js";
import { toast } from "react-toastify";

const getUserHistory = async (dispatch, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `/users/history?page=${page}&limit=${limit}`
    );

    if (response?.data?.data) {
      dispatch(addUserHistory(response.data.data));
      return response.data;
    }
  } catch (error) {
    toast.error("Error fetching user history");
    console.log(error);
  }
};

export default getUserHistory;
