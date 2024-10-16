import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { addUserSnaps } from "../store/userSlice.js";

const getUserSnaps = async (
  dispatch,
  userId,
  sortType,
  page = 1,
  limit = 10
) => {
  try {
    const response = await axiosInstance.get(`/snaps/user/${userId}`, {
      params: {
        sortType: sortType,
        page: page,
        limit: limit,
      },
    });

    if (response?.data?.data) {
      dispatch(addUserSnaps(response.data.data));
      return response.data;
    }
  } catch (error) {
    toast.error("Error fetching user snaps");
    console.log(error);
  }
};

export default getUserSnaps;
