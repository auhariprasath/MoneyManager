import { useEffect, useState } from 'react';
import { analyticsApi, suggestionsApi } from '@/services/api';
import type { Analytics, Suggestions } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  Lightbulb,
  PiggyBank,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Dashboard = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);

    // Set a safety timeout to stop spinning after 15 seconds
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 15000);

    try {
      console.log('Fetching dashboard data...');
      const [analyticsRes, suggestionsRes] = await Promise.all([
        analyticsApi.getDashboard().catch(err => {
          console.error('Analytics failed:', err);
          return { data: null };
        }),
        suggestionsApi.getAll().catch(err => {
          console.error('Suggestions failed:', err);
          return { data: null };
        }),
      ]);

      if (analyticsRes.data) setAnalytics(analyticsRes.data);
      if (suggestionsRes.data) setSuggestions(suggestionsRes.data);
    } catch (error) {
      console.error('General error fetching dashboard data:', error);
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Hero Section - Removed duplicate header */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900/50 border border-white/5 p-12">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold tracking-tight text-white mb-2">
                  Executive <span className="text-primary">Overview</span>
                </h1>
                <p className="text-lg text-neutral-400">Advanced Analytics & Financial Intelligence</p>
              </div>

              {suggestions?.dailyTip && (
                <div className="hidden lg:block max-w-sm">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/20 rounded-xl">
                        <Lightbulb className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">AI Insight</span>
                    </div>
                    <p className="text-white font-medium leading-tight mb-1">{suggestions.dailyTip.title}</p>
                    <p className="text-neutral-400 text-sm italic">"{suggestions.dailyTip.content}"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tactical Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Inflow', value: analytics?.totalIncome || 0, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10', label: 'Total Revenue' },
            { title: 'Outflow', value: analytics?.totalExpense || 0, icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'Operating Costs' },
            { title: 'Reserve', value: analytics?.netSavings || 0, icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Net Capital' },
            { title: 'Efficiency', value: `${(analytics?.savingsRate || 0).toFixed(1)}%`, icon: PiggyBank, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Save Ratio' }
          ].map((card, i) => (
            <Card key={i} className="border-0 bg-neutral-900/40 border border-white/5 hover:bg-neutral-900/60 transition-all rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 ${card.bg} rounded-xl`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-white tracking-tight tabular-nums">
                    {typeof card.value === 'string' ? card.value : formatCurrency(card.value)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Intelligence Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex justify-start">
            <TabsList className="bg-white/5 p-1 rounded-xl border border-white/5">
              {['Overview', 'Categories', 'Trends', 'Budgets'].map(tab => (
                <TabsTrigger key={tab.toLowerCase()} value={tab.toLowerCase()} className="rounded-lg px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-medium text-xs text-neutral-400">{tab}</TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 bg-neutral-900/40 border border-white/5 rounded-3xl p-6">
                <CardHeader className="px-0 pt-0">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <CardTitle className="text-lg font-bold text-white">Cash Flow</CardTitle>
                  </div>
                  <CardDescription className="text-neutral-400">Monthly tracking of income vs expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={analytics?.monthlyTrends || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontWeight: 700, fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontWeight: 700, fontSize: 10 }} />
                      <Tooltip
                        cursor={{ fill: '#4b5563' }}
                        contentStyle={{ borderRadius: '20px', border: '1px solid #374151', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', padding: '16px', backgroundColor: '#1f2937', color: '#f3f4f6' }}
                        formatter={(value: number) => [formatCurrency(value), '']}
                      />
                      <Bar dataKey="income" fill="url(#colorIncome)" radius={[10, 10, 0, 0]} name="Inflow" barSize={25} />
                      <Bar dataKey="expense" fill="url(#colorExpense)" radius={[10, 10, 0, 0]} name="Outflow" barSize={25} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl rounded-[3rem] p-4 border border-white/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-xl">
                      <PiggyBank className="h-5 w-5 text-pink-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black text-white tracking-tight">Retention Progress</CardTitle>
                      <CardDescription className="font-bold text-slate-300">Strategic Reserve Growth</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={analytics?.monthlyTrends || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontWeight: 700, fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontWeight: 700, fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '20px', border: '1px solid #374151', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', padding: '16px', backgroundColor: '#1f2937', color: '#f3f4f6' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="savings"
                        stroke="#a855f7"
                        strokeWidth={6}
                        dot={{ r: 6, fill: '#a855f7', strokeWidth: 4, stroke: '#fff' }}
                        activeDot={{ r: 10, strokeWidth: 0 }}
                        name="Net Reserve"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl rounded-[3rem] p-8 border border-white/20">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl font-black text-white tracking-tight">Resource Allocation</CardTitle>
                <CardDescription className="font-bold text-slate-300">Sector-specific expenditure breakdown</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate</span>
                      <span className="text-2xl font-black text-white">{formatCurrency(analytics?.totalExpense || 0)}</span>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={analytics?.categoryBreakdown || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={110}
                          outerRadius={150}
                          paddingAngle={8}
                          dataKey="amount"
                          nameKey="category"
                          stroke="none"
                          cornerRadius={10}
                        >
                          {(analytics?.categoryBreakdown || []).map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4 pr-6">
                    {(analytics?.categoryBreakdown || []).map((category, index) => (
                      <div key={category.category} className="group flex items-center justify-between p-6 bg-white/10 hover:bg-white/20 rounded-[2rem] border border-white/20 transition-all duration-300 shadow-sm hover:shadow-xl">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-4 h-4 rounded-full shadow-lg"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-black text-slate-200 tracking-tight uppercase text-xs tracking-widest">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-white tracking-tighter tabular-nums">{formatCurrency(category.amount)}</p>
                          <Badge variant="secondary" className="bg-white/10 text-slate-300 border border-white/20 rounded-full text-[10px] font-black">{category.percentage.toFixed(1)}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl rounded-[3rem] p-4 border border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-black text-white tracking-tight">Micro-Temporal Analysis</CardTitle>
                <CardDescription className="font-bold text-slate-300">Weekly operational performance indices</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics?.weeklyTrends || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontWeight: 700, fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontWeight: 700, fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '20px', border: '1px solid #374151', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', padding: '16px', backgroundColor: '#1f2937', color: '#f3f4f6' }}
                    />
                    <Legend iconType="circle" />
                    <Bar dataKey="income" fill="#a855f7" radius={[8, 8, 8, 8]} name="Inflow" barSize={20} />
                    <Bar dataKey="expense" fill="#ec4899" radius={[8, 8, 8, 8]} name="Outflow" barSize={20} />
                    <Bar dataKey="savings" fill="#6366f1" radius={[8, 8, 8, 8]} name="Reserve Growth" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budgets" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl rounded-[3rem] p-8 border border-white/20">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl font-black text-white tracking-tight">Compliance Metrics</CardTitle>
                <CardDescription className="font-bold text-slate-300">Real-time budget adherence tracking</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(analytics?.budgetStatus || []).map((budget) => (
                    <div key={budget.category} className="p-8 rounded-[2.5rem] bg-white/10 border border-white/20 space-y-6 group hover:bg-white/20 hover:shadow-2xl transition-all duration-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{budget.category}</p>
                          <h4 className="text-2xl font-black text-white tracking-tighter">
                            {formatCurrency(budget.spent)} <span className="text-sm font-bold opacity-30 text-slate-400">/ {formatCurrency(budget.budgetLimit)}</span>
                          </h4>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {budget.overBudget ? (
                            <Badge className="bg-rose-500 text-white border-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/30">
                              Breached
                            </Badge>
                          ) : budget.thresholdExceeded ? (
                            <Badge className="bg-amber-500 text-white border-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/30">
                              Critical
                            </Badge>
                          ) : (
                            <Badge className="bg-purple-500 text-white border-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/30">
                              Optimal
                            </Badge>
                          )}
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(budget.usagePercentage || 0).toFixed(1)}% Usage</span>
                        </div>
                      </div>

                      <div className="relative h-4 w-full bg-white/20 rounded-full overflow-hidden border border-white/10">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${budget.overBudget ? 'bg-rose-500' : budget.thresholdExceeded ? 'bg-amber-500' : 'bg-purple-500'
                            }`}
                          style={{ width: `${Math.min(budget.usagePercentage, 100)}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Strategic Delta</span>
                        <span className={budget.overBudget ? 'text-rose-400' : 'text-purple-400'}>
                          {budget.overBudget ? `Excess: ${formatCurrency(Math.abs(budget.remaining))}` : `Available: ${formatCurrency(budget.remaining)}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Neural Insights */}
        {analytics?.insights && analytics.insights.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Neural <span className="text-purple-400">Insights</span></h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {analytics.insights.map((insight, index) => (
                <Card
                  key={index}
                  className={`group border-0 shadow-xl rounded-[2.5rem] overflow-hidden bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-500 border border-white/20 ${insight.type === 'WARNING' ? 'ring-2 ring-rose-500/30' : 'ring-2 ring-purple-500/30'
                    }`}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3 rounded-2xl ${insight.type === 'WARNING' ? 'bg-rose-500/20 shadow-lg shadow-rose-500/30' : 'bg-purple-500/20 shadow-lg shadow-purple-500/30'
                        } group-hover:scale-110 transition-transform`}>
                        {insight.type === 'WARNING' ? (
                          <AlertTriangle className="h-6 w-6 text-rose-400" />
                        ) : (
                          <TrendingUp className="h-6 w-6 text-purple-400" />
                        )}
                      </div>
                      <Badge className={`rounded-full px-3 py-1 border-0 text-[10px] font-black uppercase tracking-widest ${insight.type === 'WARNING' ? 'bg-rose-500 text-white' : 'bg-purple-500 text-white'
                        }`}>
                        {insight.type}
                      </Badge>
                    </div>
                    <h4 className="text-xl font-black text-white tracking-tight mb-2">{insight.title}</h4>
                    <p className="text-sm font-bold text-slate-300 leading-relaxed mb-6">{insight.description}</p>
                    {insight.potentialSavings && (
                      <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center justify-between">
                        <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Retrieval Projection</span>
                        <span className="text-sm font-black text-purple-400 tracking-tighter">{formatCurrency(insight.potentialSavings)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
