import React from 'react';
import { useAuth } from '../components/Auth';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  Star, 
  Zap, 
  Shield, 
  ArrowRight,
  TrendingUp,
  Target,
  FileText,
  ImageIcon,
  Code,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { TOOLS } from '../data/tools';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, DocumentData } from 'firebase/firestore';

interface HistoryItem {
  id: string;
  toolId: string;
  timestamp: any;
  metadata?: any;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [recentHistory, setRecentHistory] = React.useState<HistoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState([
    { label: 'Tools Used', value: '0', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Saved Keywords', value: '0', icon: Target, color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: 'Files Processed', value: '0', icon: FileText, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Account Status', value: 'Active', icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ]);

  React.useEffect(() => {
    if (!user) return;

    const historyRef = collection(db, 'users', user.uid, 'history');
    const q = query(historyRef, orderBy('timestamp', 'desc'), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HistoryItem[];
      
      setRecentHistory(historyData);
      
      // Calculate unique tools used
      const uniqueTools = new Set(historyData.map(h => h.toolId)).size;
      
      setStats(prev => [
        { ...prev[0], value: uniqueTools.toString() },
        { ...prev[1], value: '45' }, // Mock for now
        { ...prev[2], value: historyData.length.toString() },
        { ...prev[3], value: 'Active' },
      ]);
      
      setLoading(false);
    }, (error) => {
      console.error("Error fetching history:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const recentTools = recentHistory.map(h => {
    const tool = TOOLS.find(t => t.id === h.toolId);
    return tool ? { ...tool, usedAt: h.timestamp } : null;
  }).filter(Boolean);

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'recently';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user?.displayName?.split(' ')[0]}!</h1>
        <p className="text-slate-500">Manage your tools, history, and account settings from your dashboard.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Recently Used Tools</h2>
              <Link to="/all-tools" className="text-sky-500 font-bold text-sm hover:underline">View All</Link>
            </div>
            {recentTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentTools.map((tool: any, idx) => (
                  <Link 
                    key={idx}
                    to={`/tool/${tool.slug}`}
                    className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-sky-400 hover:shadow-lg transition-all group flex items-center"
                  >
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mr-4 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-slate-900 group-hover:text-sky-500 transition-colors">{tool.name}</h3>
                      <p className="text-xs text-slate-400">
                        Used {formatTimestamp(tool.usedAt)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                <Zap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">You haven't used any tools yet.</p>
                <Link to="/all-tools" className="mt-4 inline-block text-sky-500 font-bold hover:underline">Explore Tools</Link>
              </div>
            )}
          </section>

          <section className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-sky-500 rounded-full blur-3xl opacity-20"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <Star className="w-3 h-3 mr-2 fill-current" /> Premium Feature
              </div>
              <h3 className="text-2xl font-bold mb-4">Upgrade to Pro for Unlimited Access</h3>
              <p className="text-slate-400 mb-8 max-w-md">
                Unlock advanced SEO tools, batch processing for images, and unlimited PDF conversions with our Pro plan.
              </p>
              <button className="px-8 py-3 bg-sky-500 text-white font-bold rounded-xl hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20">
                Upgrade Now
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-sky-500" /> SEO Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trending Topic</p>
                <p className="text-sm font-bold text-slate-900 mb-1">AI Content Strategy</p>
                <p className="text-xs text-slate-500">Search volume up 45% this week</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Top Keyword</p>
                <p className="text-sm font-bold text-slate-900 mb-1">Free PDF Tools</p>
                <p className="text-xs text-slate-500">Difficulty: Medium | Volume: 12k</p>
              </div>
              <Link to="/tool/long-tail-keyword-generator" className="block w-full py-3 bg-sky-50 text-sky-500 font-bold rounded-xl text-center hover:bg-sky-100 transition-colors">
                Research Keywords
              </Link>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">Account Settings</h3>
            <div className="space-y-2">
              <Link to="/dashboard/settings" className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                <Settings className="w-4 h-4 text-slate-400 group-hover:text-sky-500" />
                <span className="text-sm font-medium text-slate-600 group-hover:text-sky-500">Profile Settings</span>
              </Link>
              <Link to="/dashboard/history" className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                <History className="w-4 h-4 text-slate-400 group-hover:text-sky-500" />
                <span className="text-sm font-medium text-slate-600 group-hover:text-sky-500">Usage History</span>
              </Link>
              <Link to="/privacy-policy" className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                <Shield className="w-4 h-4 text-slate-400 group-hover:text-sky-500" />
                <span className="text-sm font-medium text-slate-600 group-hover:text-sky-500">Privacy & Security</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
