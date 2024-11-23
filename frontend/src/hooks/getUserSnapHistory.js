import axiosInstance from "../utils/axios.helper.js";
import { addUserSnapHistory } from "../store/userSlice.js";
import { toast } from "react-toastify";

const getUserVideoHistory = async (dispatch, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `/users/snaps-history?page=${page}&limit=${limit}`
    );

    if (response?.data?.data) {
      dispatch(addUserSnapHistory(response.data.data));
      return response.data;
    }
  } catch (error) {
    toast.error("Error fetching user history");
    console.log(error);
  }
};

export default getUserVideoHistory;
