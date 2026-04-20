function Loading({ forceVisible = false }) {
  if (!forceVisible) {
    return null;
  }

  return (
    <div className="loading-overlay">
      <div className="loading-logo-wrapper">
        <h1>BOUGDIM.</h1>
        <div className="loading-bar-container">
          <div className="loading-bar-progress" />
        </div>
        <p
          style={{
            marginTop: "15px",
            fontSize: "10px",
            fontWeight: "800",
            color: "#aaa",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          Preparing your library
        </p>
      </div>
    </div>
  );
}

export default Loading;
