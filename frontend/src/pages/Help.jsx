import React from "react";
import { IoIosLink } from "react-icons/io";

function Help() {
  return (
    <section className="w-full flex flex-col justify-center px-4">
      <div className="w-full text-2xl md:text-3xl font-bold py-2 ">
        Facing any problem or need help?
      </div>

      <p className="w-full text-lg text-[#7a7a7a] font-bold py-2 pb-3">
        If you need assistance, feel free to reach out via the channels below.
      </p>

      <div className="w-full mt-8 pl-4">
        <ul className="flex flex-col gap-2">
          <li className="flex  items-center space-x-4">
            <span className="w-9 h-9 rounded-full flex items-center justify-center ">
              <IoIosLink className="w-6 h-6 text-white" />
            </span>

            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold my-0">GitHub</h2>
              <a
                href="https://github.com/amanranahere"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm hover:text-blue-400"
              >
                /amanranahere
              </a>
            </div>
          </li>

          <li className="flex items-center space-x-4">
            <span className="w-9 h-9 rounded-full flex items-center justify-center">
              <IoIosLink className="w-6 h-6 text-white" />
            </span>

            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold my-0">LinkedIn</h2>
              <a
                // href="https://www.linkedin.com/in/aman-rana-709a0a330/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm hover:text-blue-400"
              >
                /amanrana
              </a>
            </div>
          </li>

          <li className="flex items-center space-x-4">
            <span className="w-9 h-9 rounded-full flex items-center justify-center">
              <IoIosLink className="w-6 h-6 text-white" />
            </span>

            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold my-0">Discord</h2>
              <p className="text-blue-500 text-sm hover:text-blue-400">
                @amanrana
              </p>
            </div>
          </li>
        </ul>
      </div>

      <p className="w-full lg:w-[70%] text-lg text-[#7a7a7a] font-bold mt-10">
        If you're experiencing issues or have any suggestions, please visit{" "}
        <a href="/send-feedback" className="text-blue-500 hover:text-blue-400">
          Send Feedback
        </a>{" "}
        page, and I'll get back to you as soon as possible!
      </p>
    </section>
  );
}

export default Help;
