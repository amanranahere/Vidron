import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { login } from "../store/authSlice.js";

const getCurrentUser = async (dispatch) => {
  try {
    const response = await axiosInstance.get("/users/current-user");

    if (response?.data?.data) {
      dispatch(login(response.data.data));

      return response.data;
    }
  } catch (error) {
    toast.error("Error fetching current user");
    console.log(error);
  }
};

export default getCurrentUser;
