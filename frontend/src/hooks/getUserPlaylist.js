import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { addUserPlaylist } from "../store/userSlice.js";

const getUserPlaylist = async (dispatch, userId, username) => {
  try {
    // if userId is not provided, fetch it using username
    if (!userId && username) {
      const userResponse = await axiosInstance.get(
        `/users/profile/${username}`
      );
      userId = userResponse?.data?.data?._id;
    }

    if (!userId) {
      return;
    }

    // fetch the playlists using userId
    const response = await axiosInstance.get(`/playlists/user/${userId}`);

    if (response?.data?.data) {
      dispatch(addUserPlaylist(response.data.data));
      return response.data;
    }
  } catch (error) {
    console.log("Error fetching user playlists:", error);
  }
};

export default getUserPlaylist;
