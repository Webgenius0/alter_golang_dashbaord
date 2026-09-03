import { LayoutDashboard, Users, Settings, Search, Bell, TrendingUp, TrendingDown, Layers } from 'lucide-react'

function App() {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <Layers className="brand-icon" size={28} />
          <span>Altar Admin</span>
        </div>
        <nav className="nav-links">
          <a href="#" className="nav-link active">
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a href="#" className="nav-link">
            <Users size={20} />
            Users
          </a>
          <a href="#" className="nav-link">
            <Settings size={20} />
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search..." />
          </div>
          <div className="profile-section">
            <Bell size={20} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
            <div className="avatar">RS</div>
          </div>
        </header>

        {/* Dashboard Area */}
        <div className="content-area">
          <div className="dashboard-header animate-fade-in">
            <h1>Overview</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card animate-fade-in delay-1">
              <div className="stat-header">
                Total Users
                <Users size={20} />
              </div>
              <div className="stat-value">12,345</div>
              <div className="stat-trend trend-up">
                <TrendingUp size={16} />
                <span>12.5% from last month</span>
              </div>
            </div>

            <div className="stat-card animate-fade-in delay-2">
              <div className="stat-header">
                Active Sessions
                <LayoutDashboard size={20} />
              </div>
              <div className="stat-value">892</div>
              <div className="stat-trend trend-up">
                <TrendingUp size={16} />
                <span>5.2% from last week</span>
              </div>
            </div>

            <div className="stat-card animate-fade-in delay-3">
              <div className="stat-header">
                Bounce Rate
                <Settings size={20} />
              </div>
              <div className="stat-value">24.1%</div>
              <div className="stat-trend trend-down">
                <TrendingDown size={16} />
                <span>1.4% from yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
