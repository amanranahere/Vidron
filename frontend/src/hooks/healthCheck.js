import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";

const healthCheck = async () => {
  try {
    const response = await axiosInstance.get("/health/");
    return response.data.data;
  } catch (error) {
    toast.error("Error getting health checked");
    console.log(error);
  }
};

export default healthCheck;
