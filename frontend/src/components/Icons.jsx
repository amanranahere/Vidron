export const icons = {
  loading: (
    <div className="w-full flex items-center justify-center">
      <div className="loader">
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>
        <div className="bar4"></div>
        <div className="bar5"></div>
        <div className="bar6"></div>
        <div className="bar7"></div>
        <div className="bar8"></div>
        <div className="bar9"></div>
        <div className="bar10"></div>
        <div className="bar11"></div>
        <div className="bar12"></div>
      </div>
    </div>
  ),

  bigLoading: (
    <svg
      width="60"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="pink"
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="pink"
        strokeWidth="5"
        fill="none"
        strokeDasharray="283"
        strokeDashoffset="75"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  ),

  words: (
    <div className="w-card">
      <div className="w-loader">
        <p>loading</p>
        <div className="words">
          <span className="word">videos</span>
          <span className="word">snaps</span>
          <span className="word">channels</span>
          <span className="word">comments</span>
          <span className="word">likes</span>
        </div>
      </div>
    </div>
  ),
};
