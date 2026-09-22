import { 
  Users, TrendingUp, TrendingDown, LayoutDashboard, 
  Activity, BookOpen, Music, Loader2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useDashboardOverview } from '../hooks/dashboard/useDashboard';

export function Dashboard() {
  const { data, isLoading, isError } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 text-text-secondary">
          <Loader2 className="animate-spin text-accent" size={32} />
          <p>Loading dashboard overview...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex flex-col items-center gap-2">
          <p className="font-semibold text-lg">Failed to load dashboard</p>
          <p className="text-sm">Please try refreshing the page or check your connection.</p>
        </div>
      </div>
    );
  }

  const {
    totalUsers,
    activeSessions,
    engagement,
    totalContent,
    userGrowthData,
    contentDistribution,
    recentActivity,
  } = data;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full animate-slide-up">
      <div className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-text-secondary mt-2 text-base lg:text-lg">Welcome back. Here's what's happening across Altar today.</p>
        </div>
        <button className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5">
          Generate Report
        </button>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="group relative bg-bg-secondary/50 backdrop-blur-lg border border-border-subtle rounded-3xl p-6 flex flex-col gap-4 overflow-hidden hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-accent/20 hover:border-accent/50 transition-all duration-500 cursor-pointer">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent/20"></div>
          <div className="flex items-center justify-between text-text-secondary font-medium relative z-10">
            <span className="text-sm uppercase tracking-wider font-semibold">Total Users</span>
            <div className="p-2 bg-white/5 rounded-lg text-white group-hover:scale-110 group-hover:text-accent transition-all duration-300">
              <Users size={20} />
            </div>
          </div>
          <div className="text-4xl lg:text-5xl font-extrabold text-white relative z-10">{totalUsers.toLocaleString()}</div>
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
          <div className="text-4xl lg:text-5xl font-extrabold text-white relative z-10">{activeSessions.toLocaleString()}</div>
          <div className="flex items-center gap-2 text-sm font-bold text-red-400 relative z-10 bg-red-400/10 w-fit px-3 py-1 rounded-full">
            <TrendingDown size={16} />
            <span>-3.2% vs last week</span>
          </div>
        </div>

        <div className="group relative bg-bg-secondary/50 backdrop-blur-lg border border-border-subtle rounded-3xl p-6 flex flex-col gap-4 overflow-hidden hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-pink-500/20 hover:border-pink-500/50 transition-all duration-500 cursor-pointer">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-pink-500/20"></div>
          <div className="flex items-center justify-between text-text-secondary font-medium relative z-10">
            <span className="text-sm uppercase tracking-wider font-semibold">Engagement</span>
            <div className="p-2 bg-white/5 rounded-lg text-white group-hover:scale-110 group-hover:text-pink-400 transition-all duration-300">
              <Activity size={20} />
            </div>
          </div>
          <div className="text-4xl lg:text-5xl font-extrabold text-white relative z-10">{engagement}%</div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 relative z-10 bg-emerald-400/10 w-fit px-3 py-1 rounded-full">
            <TrendingUp size={16} />
            <span>+5.1% this week</span>
          </div>
        </div>

        <div className="group relative bg-bg-secondary/50 backdrop-blur-lg border border-border-subtle rounded-3xl p-6 flex flex-col gap-4 overflow-hidden hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-500 cursor-pointer">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-emerald-500/20"></div>
          <div className="flex items-center justify-between text-text-secondary font-medium relative z-10">
            <span className="text-sm uppercase tracking-wider font-semibold">Total Content</span>
            <div className="p-2 bg-white/5 rounded-lg text-white group-hover:scale-110 group-hover:text-emerald-400 transition-all duration-300">
              <BookOpen size={20} />
            </div>
          </div>
          <div className="text-4xl lg:text-5xl font-extrabold text-white relative z-10">{totalContent.toLocaleString()}</div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 relative z-10 bg-emerald-400/10 w-fit px-3 py-1 rounded-full">
            <TrendingUp size={16} />
            <span>+84 new items</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-bg-secondary/50 backdrop-blur-lg border border-border-subtle rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">User Growth & Engagement</h3>
              <p className="text-sm text-text-secondary mt-1">Daily active vs total users</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="active" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-secondary/50 backdrop-blur-lg border border-border-subtle rounded-3xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Content Distribution</h3>
            <p className="text-sm text-text-secondary mt-1">Platform assets by category</p>
          </div>
          <div className="h-[220px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {contentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '12px', border: 'none' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-2xl font-bold text-white">1.2k</span>
              <span className="text-xs text-text-secondary">Assets</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {contentDistribution.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-text-secondary">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-bg-secondary/50 backdrop-blur-lg border border-border-subtle rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          <button className="text-sm text-accent hover:text-accent/80 font-medium transition-colors">
            View All
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  activity.type === 'prayer' ? 'bg-indigo-500/20 text-indigo-400' :
                  activity.type === 'worship' ? 'bg-pink-500/20 text-pink-400' :
                  activity.type === 'user' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {activity.type === 'prayer' && <BookOpen size={20} />}
                  {activity.type === 'worship' && <Music size={20} />}
                  {activity.type === 'user' && <Users size={20} />}
                  {activity.type === 'proverb' && <BookOpen size={20} />}
                </div>
                <div>
                  <h4 className="text-white font-medium">{activity.action}</h4>
                  <p className="text-sm text-text-secondary">by <span className="text-text-primary">{activity.user}</span></p>
                </div>
              </div>
              <span className="text-sm text-text-secondary font-medium">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
