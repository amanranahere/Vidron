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
          </div>
        </div>
      </div>

      {/* Home redirection */}
      <div className="h-screen w-full flex flex-col items-center justify-center overflow-y-auto bg-black/95">
        <h1 className="text-xl mt-5 p-2">
          <Button
            className="rounded-md hover:cursor-pointer hover:bg-pink-500"
            bgColor="bg-pink-600"
          >
            <Link to={"/"}>Home</Link>
          </Button>
        </h1>
      </div>
    </>
  );
}

export default PageNotFound;
