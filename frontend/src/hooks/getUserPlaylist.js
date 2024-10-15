import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { addUserPlaylist } from "../store/userSlice.js";

const getUserPlaylist = async (dispatch, userId) => {
  try {
    const response = await axiosInstance.get(`/playlists/user/${userId}`);

    if (response?.data?.data) {
      dispatch(addUserPlaylist(response.data.data));
      return response.data;
    }
  } catch (error) {
    toast.error("Error fetching user playlist");
    console.log(error);
  }
};

export default getUserPlaylist;
