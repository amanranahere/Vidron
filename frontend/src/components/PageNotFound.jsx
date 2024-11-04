import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <>
      {/* Not found TV */}
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div class="main_wrapper">
          <div class="main">
            <div class="antenna">
              <div class="antenna_shadow"></div>
              <div class="a1"></div>
              <div class="a1d"></div>
              <div class="a2"></div>
              <div class="a2d"></div>
              <div class="a_base"></div>
            </div>

            <div class="tv">
              <div class="display_div">
                <div class="screen_out">
                  <div class="screen_out1">
                    <div class="screen">
                      <span class="notfound_text">NOT FOUND</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="buttons_div">
                <div class="b1"></div>

                <div class="b2"></div>

                <div class="speakers">
                  <div class="g1">
                    <div class="g11"></div>
                    <div class="g12"></div>
                    <div class="g13"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bottom">
              <div class="base1"></div>
              <div class="base2"></div>
              <div class="base3"></div>
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
