import React, { useEffect, useState } from "react";
import { icons } from "../Icons.jsx";
import axiosInstance from "../../utils/axios.helper";
import SnapCard from "./SnapCard.jsx";

function SnapContainer() {
  const [snaps, setSnaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axiosInstance.get(
        `/snaps?limit=4&sortBy=createdAt&sortType=-1`
      );
      setSnaps(response.data.data.snaps);
    } catch (error) {
      console.error("Error fetching snaps", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // if (loading) {
  //   return (
  //     <span className="flex justify-center mt-20">{icons.bigLoading}</span>
  //   );
  // }

  return (
    <div className="flex flex-wrap justify-evenly md:flex-nowrap lg:px-2 gap-1 md:gap-2 w-full">
      {snaps.map((snap, index) => (
        <div
          key={snap._id}
          className="w-[48%] md:w-[24%] lg:w-[24.5%] shrink-0"
        >
          <SnapCard snap={snap} />
        </div>
      ))}
    </div>
  );
}

export default SnapContainer;
