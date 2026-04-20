import logo from "../assets/logo/library.png";

function Loading({ forceVisible = false }) {
  if (!forceVisible) {
    return null;
  }

  return (
    <div className="loading-overlay" role="status" aria-live="polite" aria-label="Loading">
      <div className="loading-card">
        <div className="loading-mark">
          <img src={logo} alt="Library BOUGDIM" />
        </div>
        <p className="loading-kicker">Library BOUGDIM</p>
        <h1>Preparing your library</h1>
        <div className="loading-bar-container">
          <div className="loading-bar-progress" />
        </div>
        <p className="loading-caption">Books, stationery, and school essentials are getting ready.</p>
      </div>
    </div>
  );
}

export default Loading;
