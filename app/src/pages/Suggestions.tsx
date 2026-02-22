import { useEffect, useState } from 'react';
import { suggestionsApi } from '@/services/api';
import type { Suggestions } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingDown,
  TrendingUp,
  Target,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  PiggyBank,
  ArrowRight,
  Sparkles,
  Lightbulb
} from 'lucide-react';

const SuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await suggestionsApi.getAll();
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
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
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900/50 border border-white/5 p-12">
          <div className="relative z-10">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-primary/20 rounded-2xl border border-primary/30">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-5xl font-bold tracking-tight text-white mb-2">
                  Intelligence <span className="text-primary">Nexus</span>
                </h1>
                <p className="text-lg text-neutral-400">Cognitive insights for strategic financial evolution</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Tip */}
        {suggestions?.dailyTip && (
          <Card className="border-0 bg-neutral-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="h-32 w-32 text-primary" />
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="p-5 bg-primary/10 rounded-3xl border border-primary/20">
                  <Lightbulb className="h-12 w-12 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                    <Badge className="bg-primary/20 text-primary border-0 px-4 py-1 rounded-full uppercase text-[10px] font-black tracking-widest">
                      Daily Enlightenment
                    </Badge>
                    <span className="text-neutral-600 font-bold">•</span>
                    <span className="text-neutral-400 text-xs font-bold uppercase tracking-widest">{suggestions.dailyTip.category}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">{suggestions.dailyTip.title}</h3>
                  <p className="text-neutral-300 text-xl font-medium leading-relaxed italic opacity-90">“{suggestions.dailyTip.content}”</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="spending" className="space-y-8">
          <div className="flex justify-start">
            <TabsList className="bg-white/5 p-1 rounded-xl border border-white/5">
              {['Spending', 'Investment', 'Goals', 'Budget'].map(tab => (
                <TabsTrigger key={tab.toLowerCase()} value={tab.toLowerCase()} className="rounded-lg px-8 py-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold text-xs text-neutral-400">{tab}</TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Spending Suggestions */}
          <TabsContent value="spending" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {suggestions?.spendingSuggestions && suggestions.spendingSuggestions.length > 0 ? (
                suggestions.spendingSuggestions.map((suggestion, index) => (
                  <Card key={index} className={`group border-0 bg-neutral-900/40 border border-white/5 hover:bg-neutral-900/60 transition-all rounded-[2.5rem] overflow-hidden ${suggestion.priority === 'HIGH' ? 'ring-2 ring-rose-500/30' : ''}`}>
                    <CardHeader className="pb-4 pt-8 px-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${suggestion.priority === 'HIGH' ? 'bg-rose-500/10' : 'bg-primary/10'}`}>
                            <TrendingDown className={`h-6 w-6 ${suggestion.priority === 'HIGH' ? 'text-rose-500' : 'text-primary'}`} />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-white tracking-tight">{suggestion.title}</CardTitle>
                            <CardDescription className="text-neutral-400 font-medium mt-1">{suggestion.description}</CardDescription>
                          </div>
                        </div>
                        <Badge className={`rounded-full px-3 py-1 border-0 text-[10px] font-black uppercase tracking-widest ${suggestion.priority === 'HIGH' ? 'bg-rose-500 text-white' : 'bg-primary text-white'}`}>
                          {suggestion.priority} Priority
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 px-8 pb-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-neutral-800/50 rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Observed</p>
                          <p className="text-2xl font-bold text-white tracking-tighter tabular-nums">{formatCurrency(suggestion.currentSpending)}</p>
                        </div>
                        <div className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                          <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-1">Target</p>
                          <p className="text-2xl font-bold text-emerald-500 tracking-tighter tabular-nums">{formatCurrency(suggestion.suggestedLimit)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 bg-primary/10 p-5 rounded-3xl border border-primary/20">
                        <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/20">
                          <PiggyBank className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">Potential Retrieval</p>
                          <p className="text-xl font-bold text-white tracking-tighter tabular-nums">
                            {formatCurrency(suggestion.potentialSavings)} <span className="text-sm font-medium opacity-60 text-neutral-400 italic">saved per month</span>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full border-0 bg-neutral-900/40 border border-white/5 rounded-[3rem] p-20 text-center">
                  <div className="bg-emerald-500/20 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Peak Efficiency Achieved</h3>
                  <p className="text-neutral-400 max-w-sm mx-auto font-medium">Your spending patterns are perfectly aligned with optimal financial performance.</p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Investment Suggestions */}
          <TabsContent value="investment" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {suggestions?.investmentSuggestions && suggestions.investmentSuggestions.length > 0 ? (
                suggestions.investmentSuggestions.map((suggestion, index) => (
                  <Card key={index} className="group border-0 bg-neutral-900/40 border border-white/5 hover:bg-neutral-900/60 transition-all rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="pb-4 pt-8 px-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                          <TrendingUp className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-white tracking-tight">{suggestion.title}</CardTitle>
                          <Badge variant="outline" className="mt-2 border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full">
                            {suggestion.type.replace('_', ' ')} Strategy
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 space-y-6">
                      <div className="bg-neutral-800/30 p-6 rounded-[2rem] border border-white/5">
                        <p className="text-neutral-300 font-medium leading-relaxed">{suggestion.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-neutral-800/50 rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Allocation</p>
                          <p className="text-2xl font-bold text-white tracking-tighter tabular-nums">{formatCurrency(suggestion.suggestedAmount)}</p>
                        </div>
                        <div className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                          <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-1">Yield Potential</p>
                          <p className="text-2xl font-bold text-emerald-500 tracking-tighter tabular-nums">{suggestion.expectedReturn}% <span className="text-[10px] font-bold opacity-60">APY</span></p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Badge className={`rounded-full px-4 py-1 border-0 shadow-lg ${suggestion.riskLevel === 'HIGH' ? 'bg-rose-500 shadow-rose-500/20' : suggestion.riskLevel === 'MEDIUM' ? 'bg-primary shadow-primary/20' : 'bg-emerald-500 shadow-emerald-500/20'} text-white font-black text-[10px] uppercase tracking-widest`}>
                          {suggestion.riskLevel} Risk
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-4 py-1 border-white/10 text-neutral-400 font-black text-[10px] uppercase tracking-widest">
                          {suggestion.timeHorizon} Term Horizon
                        </Badge>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                          <ArrowRight className="h-3 w-3 text-primary" /> Preferred Instruments
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {suggestion.options.map((option, i) => (
                            <Badge key={i} className="bg-neutral-800 text-neutral-200 border border-white/10 px-4 py-1.5 rounded-2xl font-bold text-xs">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full border-0 bg-neutral-900/40 border border-white/5 rounded-[3rem] p-20 text-center">
                  <div className="bg-neutral-800 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                    <Wallet className="h-12 w-12 text-neutral-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Capital Reserve Insufficient</h3>
                  <p className="text-neutral-400 max-w-sm mx-auto font-medium">Automated investment strategies will unlock once your tactical reserves exceed threshold requirements.</p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Goal Suggestions */}
          <TabsContent value="goals" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {suggestions?.goalSuggestions && suggestions.goalSuggestions.length > 0 ? (
                suggestions.goalSuggestions.map((suggestion, index) => (
                  <Card key={index} className={`group border-0 bg-neutral-900/40 border border-white/5 hover:bg-neutral-900/60 transition-all rounded-[2.5rem] overflow-hidden ${!suggestion.achievable ? 'ring-2 ring-amber-500/30' : ''}`}>
                    <CardHeader className="pb-4 pt-8 px-8">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${suggestion.achievable ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                          <Target className={`h-6 w-6 ${suggestion.achievable ? 'text-emerald-500' : 'text-amber-500'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-white tracking-tight">{suggestion.title}</CardTitle>
                          <CardDescription className="text-neutral-400 font-medium mt-1">{suggestion.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 px-8 pb-8">
                      {/* Time & Monthly overview */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-neutral-800/50 rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Monthly Contribution</p>
                          <p className="text-2xl font-bold text-white tracking-tighter tabular-nums">{formatCurrency(suggestion.suggestedMonthlySaving)}</p>
                          <p className="text-[10px] text-neutral-500 mt-1">/ month</p>
                        </div>
                        <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20">
                          <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1">Time to Target</p>
                          <p className="text-2xl font-bold text-white tracking-tighter tabular-nums">{suggestion.monthsToAchieve} <span className="text-sm font-bold opacity-60 text-neutral-400">Months</span></p>
                          <p className="text-[10px] text-neutral-500 mt-1">{Math.round(suggestion.monthsToAchieve * 30.44)} days total</p>
                        </div>
                      </div>

                      {/* Amount split breakdown */}
                      <div className="p-5 bg-neutral-800/30 rounded-3xl border border-white/5 space-y-3">
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Payment Breakdown</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 bg-neutral-900/60 rounded-2xl border border-white/5 text-center">
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Per Day</p>
                            <p className="text-lg font-bold text-primary tabular-nums">
                              {formatCurrency(Math.ceil(suggestion.suggestedMonthlySaving / 30.44))}
                            </p>
                            <p className="text-[10px] text-neutral-600 mt-0.5">daily save</p>
                          </div>
                          <div className="p-4 bg-neutral-900/60 rounded-2xl border border-white/5 text-center">
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Per Month</p>
                            <p className="text-lg font-bold text-primary tabular-nums">
                              {formatCurrency(suggestion.suggestedMonthlySaving)}
                            </p>
                            <p className="text-[10px] text-neutral-600 mt-0.5">monthly save</p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-6 rounded-3xl border-0 flex items-center gap-5 shadow-lg ${suggestion.achievable ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-amber-500 text-white shadow-amber-500/20'}`}>
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                          {suggestion.achievable ? <CheckCircle2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                        </div>
                        <div>
                          <p className="font-black tracking-tight text-sm uppercase">
                            {suggestion.achievable ? 'Parameters Verified' : 'Recalibration Recommended'}
                          </p>
                          <p className="text-sm font-medium opacity-90 leading-tight">
                            {suggestion.achievable ? 'High probability of target accomplishment.' : 'Projected velocity insufficient for deadline.'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full border-0 bg-neutral-900/40 border border-white/5 rounded-[3rem] p-20 text-center">
                  <div className="bg-neutral-800 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                    <Target className="h-12 w-12 text-neutral-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No Ambitions Detected</h3>
                  <p className="text-neutral-400 max-w-sm mx-auto font-medium">Synchronize your financial goals to enable advanced predictive analysis.</p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Budget Optimizations */}
          <TabsContent value="budget" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {suggestions?.budgetOptimizations && suggestions.budgetOptimizations.length > 0 ? (
                suggestions.budgetOptimizations.map((opt, index) => (
                  <Card key={index} className="group border-0 bg-neutral-900/40 border border-white/5 hover:bg-neutral-900/60 transition-all rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="pb-4 pt-8 px-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                          <Wallet className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-white tracking-tight">{opt.category}</CardTitle>
                          <CardDescription className="text-neutral-400 font-medium mt-1">{opt.reason}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 px-8 pb-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-neutral-800/30 rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-1">Current Limit</p>
                          <p className="text-2xl font-bold text-neutral-500 tracking-tighter tabular-nums line-through opacity-30">{formatCurrency(opt.currentBudget)}</p>
                        </div>
                        <div className={`p-6 rounded-3xl border-0 ${opt.recommendation === 'INCREASE' ? 'bg-rose-500/10' : 'bg-emerald-500/10'}`}>
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${opt.recommendation === 'INCREASE' ? 'text-rose-500/60' : 'text-emerald-500/60'}`}>New Target</p>
                          <p className={`text-2xl font-bold tracking-tighter tabular-nums ${opt.recommendation === 'INCREASE' ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {formatCurrency(opt.suggestedBudget)}
                          </p>
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-6 rounded-[2rem] border-2 border-dashed ${opt.recommendation === 'INCREASE' ? 'border-rose-500/20 bg-rose-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                        <div className="flex items-center gap-4">
                          <Badge className={`rounded-full px-4 py-1 border-0 shadow-lg font-black text-[10px] uppercase tracking-widest ${opt.recommendation === 'INCREASE' ? 'bg-rose-500' : 'bg-emerald-500'} text-white`}>
                            Action: {opt.recommendation}
                          </Badge>
                          <p className="text-sm font-bold text-neutral-300">
                            {opt.recommendation === 'INCREASE' ? 'Elasticity required' : 'Optimization opportunity'}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-neutral-600" />
                      </div>

                      {/* Compliance Status */}
                      <div className="pt-2">
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3">Payment Compliance</p>
                        {opt.suggestedBudget <= opt.currentBudget ? (
                          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <div>
                              <p className="text-sm font-bold text-emerald-400">On Track</p>
                              <p className="text-[10px] text-neutral-500">Spending within optimal parameters</p>
                            </div>
                            <Badge className="ml-auto bg-emerald-500 text-white border-0 rounded-full px-3 py-0.5 text-[10px] font-black uppercase">Compliant</Badge>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                            <AlertTriangle className="h-5 w-5 text-rose-500" />
                            <div>
                              <p className="text-sm font-bold text-rose-400">Overspending Detected</p>
                              <p className="text-[10px] text-neutral-500">Budget needs upward revision</p>
                            </div>
                            <Badge className="ml-auto bg-rose-500 text-white border-0 rounded-full px-3 py-0.5 text-[10px] font-black uppercase">Review</Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full border-0 bg-neutral-900/40 border border-white/5 rounded-[3rem] p-20 text-center">
                  <div className="bg-emerald-500/20 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Equilibrium Reached</h3>
                  <p className="text-neutral-400 max-w-sm mx-auto font-medium">Your budget framework is perfectly optimized for current expenditure velocities.</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuggestionsPage;
