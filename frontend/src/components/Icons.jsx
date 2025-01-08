export const icons = {
  loading: (
    <div class="loader">
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
      <div class="bar4"></div>
      <div class="bar5"></div>
      <div class="bar6"></div>
      <div class="bar7"></div>
      <div class="bar8"></div>
      <div class="bar9"></div>
      <div class="bar10"></div>
      <div class="bar11"></div>
      <div class="bar12"></div>
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
