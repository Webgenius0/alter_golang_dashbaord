import { LayoutDashboard, Users, Settings as SettingsIcon, Search, Bell, TrendingUp, TrendingDown, Layers, LogOut, Video } from 'lucide-react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { Login } from './pages/Login'
import { Settings } from './pages/Settings'
import { Motivations } from './pages/Motivations'
import { Library } from './pages/Library'
import { useLogout } from './hooks/auth/useLogout'
import { BookOpen } from 'lucide-react'

function DashboardLayout() {
  const logoutMutation = useLogout()
  const location = useLocation()
  const token = localStorage.getItem("accessToken")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  const navLinkClass = (path: string) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
      location.pathname === path 
        ? 'bg-bg-tertiary text-text-primary translate-x-1' 
        : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary hover:translate-x-1'
    }`

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary text-text-primary">
      {/* Sidebar */}
      <aside className="w-[280px] bg-glass backdrop-blur-md border-r border-border-subtle flex flex-col p-6 transition-all duration-300">
        <div className="text-2xl font-bold text-text-primary mb-10 flex items-center gap-3">
          <Layers className="text-accent" size={28} />
          <span>Altar Admin</span>
        </div>
        <nav className="flex flex-col gap-2">
          <Link to="/" className={navLinkClass('/')}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/motivations" className={navLinkClass('/motivations')}>
            <Video size={20} />
            Motivations
          </Link>
          <Link to="/library" className={navLinkClass('/library')}>
            <BookOpen size={20} />
            Library
          </Link>
          <Link to="/users" className={navLinkClass('/users')}>
            <Users size={20} />
            Users
          </Link>
          <Link to="/settings" className={navLinkClass('/settings')}>
            <SettingsIcon size={20} />
            Settings
          </Link>
        </nav>
        
        <div className="mt-auto">
          <button 
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-bg-tertiary text-text-primary font-semibold rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-colors duration-200"
          >
            <LogOut size={18} />
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Topbar */}
        <header className="h-[72px] flex items-center justify-between px-8 bg-glass backdrop-blur-md border-b border-border-subtle sticky top-0 z-10">
          <div className="flex items-center gap-2 bg-bg-primary border border-border-subtle rounded-full px-4 py-2 w-[300px] text-text-secondary focus-within:border-accent focus-within:text-text-primary transition-colors">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none w-full text-text-primary placeholder:text-text-secondary"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-text-secondary hover:text-text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-text-primary">Admin</span>
                <span className="text-xs text-text-secondary">admin@altar.com</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center font-semibold shadow-lg">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <Routes>
          <Route path="/" element={
            <div className="p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-semibold">Dashboard Overview</h1>
                <p className="text-text-secondary mt-2">Welcome back to Altar Admin.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 flex flex-col gap-2 hover:-translate-y-1 hover:shadow-xl hover:border-white/20 transition-all duration-200">
                  <div className="flex items-center justify-between text-text-secondary font-medium">
                    <span>Total Users</span>
                    <Users size={18} />
                  </div>
                  <div className="text-3xl font-bold text-text-primary">12,485</div>
                  <div className="flex items-center gap-1 text-sm font-medium text-emerald-500">
                    <TrendingUp size={16} />
                    <span>+12.5%</span>
                  </div>
                </div>
                
                <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 flex flex-col gap-2 hover:-translate-y-1 hover:shadow-xl hover:border-white/20 transition-all duration-200">
                  <div className="flex items-center justify-between text-text-secondary font-medium">
                    <span>Active Sessions</span>
                    <LayoutDashboard size={18} />
                  </div>
                  <div className="text-3xl font-bold text-text-primary">1,245</div>
                  <div className="flex items-center gap-1 text-sm font-medium text-red-500">
                    <TrendingDown size={16} />
                    <span>-3.2%</span>
                  </div>
                </div>
              </div>
            </div>
          } />
          
          <Route path="/motivations" element={<Motivations />} />
          <Route path="/library" element={<Library />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<div className="p-8"><h1 className="text-3xl font-semibold">Users</h1></div>} />
        </Routes>
      </main>
    </div>
  )
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<DashboardLayout />} />
    </Routes>
  )
}

export default App
