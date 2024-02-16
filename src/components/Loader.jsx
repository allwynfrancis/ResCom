import React from "react";

const Loader = () => (
  <div className="loader-wrapper">
    <div className="loader"></div>
    <svg viewBox="0 0 960 300">
      <symbol id="s-text">
        <text textAnchor="middle" x="50%" y="80%">Scanning...</text>
      </symbol>

      <g className="g-ants">
        <use xlinkHref="#s-text" className="text-copy"></use>
        <use xlinkHref="#s-text" className="text-copy"></use>
        <use xlinkHref="#s-text" className="text-copy"></use>
      </g>
    </svg>
  </div>
);

export default Loader;
