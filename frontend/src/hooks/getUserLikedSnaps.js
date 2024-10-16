import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { addUserLikedSnaps } from "../store/userSlice.js";

const getUserLikedSnaps = async (dispatch, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `/likes/snaps?page=${page}&limit=${limit}`
    );

    if (response?.data?.data) {
      dispatch(addUserLikedSnaps(response.data.data));
      return response.data;
    }
  } catch (error) {
    toast.error("Error fetching user liked snaps");
    console.log(error);
  }
};

export default getUserLikedSnaps;
