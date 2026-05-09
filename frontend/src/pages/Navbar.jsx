function Navbar({ auth, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">O</span>
        <div>
          <p className="eyebrow">{auth.role}</p>
          <h1>Task Management</h1>
        </div>
      </div>

      <div className="navbar-user">
        <span>{auth.email}</span>
        <button type="button" className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
