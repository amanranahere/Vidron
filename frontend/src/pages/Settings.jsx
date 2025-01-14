import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditPersonalInfo from "../components/Settings/EditPersonalInfo.jsx";
import EditChannelInfo from "../components/Settings/EditChannelInfo.jsx";
import ChangePassword from "../components/Settings/ChangePassword.jsx";
import { icons } from "../components/Icons.jsx";

function Settings() {
  const userData = useSelector((state) => state.auth.userData);
  const [currentTab, setCurrentTab] = useState(0);

  if (!userData) {
    return (
      <span className="flex justify-center mt-20">{icons.bigLoading}</span>
    );
  }

  return (
    <section className="w-full">
      <div className="relative flex flex-col lg:flex-row-reverse justify-between">
        <div className="w-full py-3 lg:w-[40%]">
          <ul className="w-full lg:pr-2 text-xl md:text-2xl lg:text-3xl font-semibold flex flex-col justify-center gap-1 lg:gap-0">
            <li key="personal-info" className="lg:w-full">
              <button
                onClick={() => setCurrentTab(0)}
                className={`w-full transition-all duration-100 text-center lg:text-end ${
                  currentTab === 0
                    ? "w-full text-white"
                    : "w-full text-[#6a6a6a] hover:text-[#9a9a9a]"
                }`}
              >
                Personal Information
              </button>
            </li>

            <li key="channel-info" className="lg:py-2 lg:px-0 lg:w-full">
              <button
                onClick={() => setCurrentTab(1)}
                className={`w-full transition-all duration-100  text-center lg:text-end ${
                  currentTab === 1
                    ? "w-full text-white "
                    : "w-full text-[#6a6a6a] hover:text-[#9a9a9a]"
                }`}
              >
                Channel Information
              </button>
            </li>

            <li key="change-pwd" className="lg:w-full">
              <button
                onClick={() => setCurrentTab(2)}
                className={`w-full  transition-all duration-100  text-center lg:text-end ${
                  currentTab === 2
                    ? "w-full text-white "
                    : "w-full text-[#6a6a6a] hover:text-[#9a9a9a]"
                }`}
              >
                Change Password
              </button>
            </li>
          </ul>
        </div>

        <div className="w-full">
          {currentTab === 0 && <EditPersonalInfo />}
          {currentTab === 1 && <EditChannelInfo />}
          {currentTab === 2 && <ChangePassword />}
        </div>
      </div>
    </section>
  );
}

export default Settings;
