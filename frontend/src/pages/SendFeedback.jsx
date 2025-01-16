import React from "react";

function SendFeedback() {
  return (
    <section className="w-full">
      <div className="w-full ">
        <div className="w-full text-2xl md:text-3xl font-bold py-2 lg:w-[70%] px-4">
          Your Feedback Matters!
        </div>

        <p className="w-full text-lg text-[#7a7a7a] font-bold py-2 pb-3 lg:w-[70%] px-4">
          I value your input! Share your thoughts, report issues, or suggest
          improvements to help me enhance your experience.{" "}
        </p>

        <div className="w-full h-[250vh] md:h-[150vh] lg:h-[200vh]">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSd5fw3MP9f6aym8goyq88PYwWjk9QkDVyO889Jr3aavSzyKeQ/viewform?embedded=true"
            width="100%"
            height="100%"
            frameborder="0"
            marginheight="0"
            marginwidth="0"
            className="rounded-lg pb-16 lg:pb-0"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </section>
  );
}

export default SendFeedback;
