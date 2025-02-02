import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Slide, ToastContainer } from "react-toastify";
import { icons } from "./components/Icons.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import healthCheck from "./hooks/healthCheck.js";
import getCurrentUser from "./hooks/getCurrentUser.js";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isWatchPage = location.pathname.includes("/video-watchpage");

  useEffect(() => {
    healthCheck().then(() => {
      getCurrentUser(dispatch).then(() => {
        setLoading(false);
      });
    });

    setInterval(() => {
      healthCheck();
    }, 5 * 60 * 1000);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full overflow-y-auto bg-[#121212] text-white">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span>{icons.words}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col bg-opacity-95">
      <Navbar />

      <div className="w-full h-full flex overflow-auto">
        <div>{!isWatchPage && <Sidebar />}</div>

        <main
          className="overflow-y-auto h-full w-full scrollbar-hide"
          id="scrollableDiv"
        >
          <Outlet />
        </main>
      </div>

      <div id="popup-models" className="bg-[#00bfff] relative"></div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </div>
  );
}

export default App;
