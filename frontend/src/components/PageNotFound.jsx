import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <>
      {/* Not found TV */}
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="main_wrapper">
          <div className="main">
            <div className="antenna">
              <div className="antenna_shadow"></div>
              <div className="a1"></div>
              <div className="a1d"></div>
              <div className="a2"></div>
              <div className="a2d"></div>
              <div className="a_base"></div>
            </div>

            <div className="tv">
              <div className="display_div">
                <div className="screen_out">
                  <div className="screen_out1">
                    <div className="screen">
                      <span className="notfound_text">NOT FOUND</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="buttons_div">
                <div className="b1"></div>

                <div className="b2"></div>

                <div className="speakers">
                  <div className="g1">
                    <div className="g11"></div>
                    <div className="g12"></div>
                    <div className="g13"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bottom">
              <div className="base1"></div>
              <div className="base2"></div>
              <div className="base3"></div>
            </div>

            {/* Home redirection */}
            <div className="w-full mt-8 flex justify-center items-center">
              <button className="text-white text-lg rounded-full px-12 py-1 border-2 hover:bg-white hover:text-black active:scale-95 border-white bg-transparent">
                <Link to={"/"}>Home</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PageNotFound;
