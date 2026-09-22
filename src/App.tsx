import { LayoutDashboard, Users, Settings as SettingsIcon, Search, Bell, Layers, LogOut, Video, Menu, X, BookOpen, Music, BookText, BookHeart, FolderTree, Globe, HelpCircle, Quote } from 'lucide-react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Login } from './pages/Login'
import { Settings } from './pages/Settings'
import { Motivations } from './pages/Motivations'
import { Worship } from './pages/Worship'
import { Library } from './pages/Library'
import { Proverbs } from './pages/Proverbs'
import { PrayerManagement } from './pages/PrayerManagement'
import { CategoryManagement } from './pages/CategoryManagement'
import { UserManagement } from './pages/UserManagement'
import { LanguageManagement } from './pages/LanguageManagement'
import { AdminFAQs } from './pages/AdminFAQs'
import { AdminCMS } from './pages/AdminCMS'
import { AdminQuotes } from './pages/AdminQuotes'
import { useLogout } from './hooks/auth/useLogout'
import { Dashboard } from './pages/Dashboard'
function DashboardLayout() {
  const logoutMutation = useLogout()
  const location = useLocation()
  const token = localStorage.getItem("accessToken")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

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
    <div className="flex h-screen overflow-hidden bg-bg-primary text-text-primary font-sans animate-fade-in relative">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-glass-strong backdrop-blur-xl border-r border-border-subtle flex flex-col p-6 transition-transform duration-300 shadow-2xl shadow-black/50 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="text-2xl font-bold text-white mb-8 flex items-center justify-between tracking-tight shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-accent to-purple-600 rounded-xl shadow-lg shadow-accent/20">
              <Layers className="text-white" size={24} />
            </div>
            <span>Altar Admin</span>
          </div>
          <button 
            className="lg:hidden p-2 text-text-secondary hover:text-white rounded-lg bg-white/5"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto overflow-x-hidden min-h-0 pr-2 pb-4" style={{ scrollbarWidth: 'thin' }}>
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
          <Link to="/prayers" className={navLinkClass('/prayers')}>
            {activeLinkBg('/prayers')}
            <BookHeart size={20} className={location.pathname === '/prayers' ? "text-accent" : "group-hover:text-accent transition-colors"} />
            Prayers
          </Link>
          <Link to="/quotes" className={navLinkClass('/quotes')}>
            {activeLinkBg('/quotes')}
            <Quote size={20} className={location.pathname === '/quotes' ? "text-accent" : "group-hover:text-accent transition-colors"} />
            Daily Quotes
          </Link>
          <Link to="/faith" className={navLinkClass('/faith')}>
            {activeLinkBg('/faith')}
            <BookHeart size={20} className={location.pathname === '/faith' ? "text-accent" : "group-hover:text-accent transition-colors"} />
            Faith
          </Link>
          <Link to="/categories" className={navLinkClass('/categories')}>
            {activeLinkBg('/categories')}
            <FolderTree size={20} className={location.pathname === '/categories' ? "text-accent" : "group-hover:text-accent transition-colors"} />
            Categories
          </Link>
          <Link to="/languages" className={navLinkClass('/languages')}>
            {activeLinkBg('/languages')}
            <Globe size={20} className={location.pathname === '/languages' ? "text-accent" : "group-hover:text-accent transition-colors"} />
            Languages
          </Link>
          <Link to="/faqs" className={navLinkClass('/faqs')}>
            {activeLinkBg('/faqs')}
            <HelpCircle size={20} className={location.pathname === '/faqs' ? "text-accent" : "group-hover:text-accent transition-colors"} />
            Help & Support
          </Link>
          <Link to="/cms/pages" className={navLinkClass('/cms/pages')}>
            {activeLinkBg('/cms/pages')}
            <BookText size={20} className={location.pathname === '/cms/pages' ? "text-accent" : "group-hover:text-accent transition-colors"} />
            Pages
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
        
        <div className="mt-auto pt-6 border-t border-border-subtle/50 shrink-0">
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
      <main className="flex-1 flex flex-col overflow-y-auto w-full lg:w-auto">
        {/* Topbar */}
        <header className="h-[76px] flex items-center justify-between px-4 lg:px-8 bg-glass backdrop-blur-xl border-b border-border-subtle sticky top-0 z-10 w-full shrink-0">
          <div className="flex items-center gap-3 lg:gap-4">
            <button 
              className="lg:hidden p-2 text-text-secondary hover:text-white bg-bg-secondary hover:bg-bg-tertiary rounded-xl transition-colors border border-border-subtle"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-3 bg-black/40 border border-border-subtle rounded-full px-5 py-2.5 w-[250px] lg:w-[350px] text-text-secondary focus-within:border-accent focus-within:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-300">
              <Search size={18} className="text-text-secondary focus-within:text-accent shrink-0" />
              <input 
                type="text" 
                placeholder="Search dashboard..." 
                className="bg-transparent border-none outline-none w-full text-white placeholder:text-text-secondary font-medium min-w-0"
              />
            </div>
            {/* Mobile search button (optional, can just hide search on mobile as done above) */}
            <button className="sm:hidden p-2 text-text-secondary hover:text-white bg-bg-secondary hover:bg-bg-tertiary rounded-xl transition-colors border border-border-subtle">
              <Search size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <button className="relative p-2 text-text-secondary hover:text-white bg-bg-secondary hover:bg-bg-tertiary rounded-full transition-colors border border-border-subtle group shrink-0">
              <Bell size={20} className="group-hover:animate-bounce" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-bg-secondary rounded-full animate-pulse-slow"></span>
            </button>
            <div className="flex items-center gap-3 lg:gap-4 cursor-pointer p-1.5 lg:pr-4 rounded-full bg-bg-secondary border border-border-subtle hover:border-border-focus transition-colors">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent via-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-accent/20 shrink-0">
                AD
              </div>
              <div className="hidden lg:flex flex-col items-start leading-tight">
                <span className="text-sm font-bold text-white">Admin User</span>
                <span className="text-xs text-text-secondary font-medium">admin@altar.com</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/motivations" element={<Motivations />} />
          <Route path="/worship" element={<Worship />} />
          <Route path="/proverbs" element={<Proverbs />} />
          <Route path="/prayers" element={<PrayerManagement module="Prayer" />} />
          <Route path="/faith" element={<PrayerManagement module="Faith" />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/languages" element={<LanguageManagement />} />
          <Route path="/faqs" element={<AdminFAQs />} />
          <Route path="/cms/pages" element={<AdminCMS />} />
          <Route path="/library" element={<Library />} />
          <Route path="/quotes" element={<AdminQuotes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<UserManagement />} />
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
