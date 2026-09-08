import { LayoutDashboard, Users, Settings as SettingsIcon, Search, Bell, TrendingUp, TrendingDown, Layers, LogOut, Video } from 'lucide-react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { Login } from './pages/Login'
import { Settings } from './pages/Settings'
import { Motivations } from './pages/Motivations'
import { Worship } from './pages/Worship'
import { Library } from './pages/Library'
import { Proverbs } from './pages/Proverbs'
import { useLogout } from './hooks/auth/useLogout'
import { BookOpen, Music, BookText } from 'lucide-react'

function DashboardLayout() {
  const logoutMutation = useLogout()
  const location = useLocation()
  const token = localStorage.getItem("accessToken")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  const navLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
      isActive 
        ? 'text-white' 
        : 'text-text-secondary hover:text-white hover:translate-x-1'
    }`;
  };

  const activeLinkBg = (path: string) => location.pathname === path && (
    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent border-l-2 border-accent -z-10" />
  );

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary text-text-primary font-sans animate-fade-in">
      {/* Sidebar */}
      <aside className="w-[280px] bg-glass-strong backdrop-blur-xl border-r border-border-subtle flex flex-col p-6 transition-all duration-300 z-20 shadow-2xl shadow-black/50">
        <div className="text-2xl font-bold text-white mb-8 flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-gradient-to-br from-accent to-purple-600 rounded-xl shadow-lg shadow-accent/20">
            <Layers className="text-white" size={24} />
          </div>
          <span>Altar Admin</span>
        </div>
        <nav className="flex flex-col gap-2">
          <Link to="/" className={navLinkClass('/')}>
            {activeLinkBg('/')}
            <LayoutDashboard size={20} className={location.pathname === '/' ? "text-accent" : "group-hover:text-accent transition-colors"} />
            Dashboard
          </Link>
          <Link to="/motivations" className={navLinkClass('/motivations')}>
            {activeLinkBg('/motivations')}
            <Video size={20} className={location.pathname === '/motivations' ? "text-accent" : "group-hover:text-accent transition-colors"} />
            Motivations
          </Link>
          <Link to="/worship" className={navLinkClass('/worship')}>
            {activeLinkBg('/worship')}
            <Music size={20} className={location.pathname === '/worship' ? "text-accent" : "group-hover:text-accent transition-colors"} />
            Worship
          </Link>
          <Link to="/proverbs" className={navLinkClass('/proverbs')}>
            {activeLinkBg('/proverbs')}
            <BookText size={20} className={location.pathname === '/proverbs' ? "text-accent" : "group-hover:text-accent transition-colors"} />
            Proverbs
          </Link>
          <Link to="/library" className={navLinkClass('/library')}>
            {activeLinkBg('/library')}
            <BookOpen size={20} className={location.pathname === '/library' ? "text-accent" : "group-hover:text-accent transition-colors"} />
            Library
          </Link>
          <Link to="/users" className={navLinkClass('/users')}>
            {activeLinkBg('/users')}
            <Users size={20} className={location.pathname === '/users' ? "text-accent" : "group-hover:text-accent transition-colors"} />
            Users
          </Link>
          <Link to="/settings" className={navLinkClass('/settings')}>
            {activeLinkBg('/settings')}
            <SettingsIcon size={20} className={location.pathname === '/settings' ? "text-accent" : "group-hover:text-accent transition-colors"} />
            Settings
          </Link>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-border-subtle/50">
          <button 
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 font-semibold rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20"
          >
            <LogOut size={18} />
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Topbar */}
        <header className="h-[76px] flex items-center justify-between px-8 bg-glass backdrop-blur-xl border-b border-border-subtle sticky top-0 z-10">
          <div className="flex items-center gap-3 bg-black/40 border border-border-subtle rounded-full px-5 py-2.5 w-[350px] text-text-secondary focus-within:border-accent focus-within:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-300">
            <Search size={18} className="text-text-secondary focus-within:text-accent" />
            <input 
              type="text" 
              placeholder="Search dashboard..." 
              className="bg-transparent border-none outline-none w-full text-white placeholder:text-text-secondary font-medium"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-text-secondary hover:text-white bg-bg-secondary hover:bg-bg-tertiary rounded-full transition-colors border border-border-subtle group">
              <Bell size={20} className="group-hover:animate-bounce" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-bg-secondary rounded-full animate-pulse-slow"></span>
            </button>
            <div className="flex items-center gap-4 cursor-pointer p-1.5 pr-4 rounded-full bg-bg-secondary border border-border-subtle hover:border-border-focus transition-colors">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent via-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-accent/20">
                AD
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-sm font-bold text-white">Admin User</span>
                <span className="text-xs text-text-secondary font-medium">admin@altar.com</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <Routes>
          <Route path="/" element={
            <div className="p-8 max-w-7xl mx-auto w-full animate-slide-up">
              <div className="mb-10 flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
                  <p className="text-text-secondary mt-2 text-lg">Welcome back. Here's what's happening today.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                <div className="group relative bg-bg-secondary/50 backdrop-blur-lg border border-border-subtle rounded-3xl p-6 flex flex-col gap-4 overflow-hidden hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-accent/20 hover:border-accent/50 transition-all duration-500 cursor-pointer">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent/20"></div>
                  <div className="flex items-center justify-between text-text-secondary font-medium relative z-10">
                    <span className="text-sm uppercase tracking-wider font-semibold">Total Users</span>
                    <div className="p-2 bg-white/5 rounded-lg text-white group-hover:scale-110 group-hover:text-accent transition-all duration-300">
                      <Users size={20} />
                    </div>
                  </div>
                  <div className="text-5xl font-extrabold text-white relative z-10">12,485</div>
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 relative z-10 bg-emerald-400/10 w-fit px-3 py-1 rounded-full">
                    <TrendingUp size={16} />
                    <span>+12.5% this week</span>
                  </div>
                </div>
                
                <div className="group relative bg-bg-secondary/50 backdrop-blur-lg border border-border-subtle rounded-3xl p-6 flex flex-col gap-4 overflow-hidden hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all duration-500 cursor-pointer">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-purple-500/20"></div>
                  <div className="flex items-center justify-between text-text-secondary font-medium relative z-10">
                    <span className="text-sm uppercase tracking-wider font-semibold">Active Sessions</span>
                    <div className="p-2 bg-white/5 rounded-lg text-white group-hover:scale-110 group-hover:text-purple-400 transition-all duration-300">
                      <LayoutDashboard size={20} />
                    </div>
                  </div>
                  <div className="text-5xl font-extrabold text-white relative z-10">1,245</div>
                  <div className="flex items-center gap-2 text-sm font-bold text-red-400 relative z-10 bg-red-400/10 w-fit px-3 py-1 rounded-full">
                    <TrendingDown size={16} />
                    <span>-3.2% vs last week</span>
                  </div>
                </div>
              </div>
            </div>
          } />
          
          <Route path="/motivations" element={<Motivations />} />
          <Route path="/worship" element={<Worship />} />
          <Route path="/proverbs" element={<Proverbs />} />
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
