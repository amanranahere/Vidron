import axiosInstance from "../utils/axios.helper.js";
import { addUserSnapHistory } from "../store/userSlice.js";

const updateSnapHistory = async (snapId) => {
  try {
    const response = await axiosInstance.post(
      `/users/watch-history/snap/${snapId}`
    );
    if (response?.data?.data) {
      dispatch(addUserSnapHistory([snapId]));
      return response.data;
    }
  } catch (error) {
    console.log("Failed to update watch history", error);
  }
};

export default updateSnapHistory;
