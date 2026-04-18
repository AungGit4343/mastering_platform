function Navbar() {
  return (
    <div className="navbar">
      <h2 style={{ margin: 0 }}>AudioMarket</h2>

      <div>
        <a href="/jobs">Jobs</a>
        <a href="/post">Post Job</a>
      </div>
    </div>
  );
}

export default Navbar;