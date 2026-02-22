import { useEffect, useState } from 'react';
import { goalApi, transactionApi } from '@/services/api';
import type { Goal } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Edit2,
  Trash2,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PiggyBank
} from 'lucide-react';
import { format } from 'date-fns';

const priorities = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [summary, setSummary] = useState({
    totalTarget: 0,
    totalProgress: 0,
    completedCount: 0,
    activeCount: 0
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    targetDate: '',
    priority: 'MEDIUM',
    category: '',
    autoAllocate: false,
    monthlyAllocation: '',
  });

  useEffect(() => {
    fetchGoals();
    fetchSummary();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await goalApi.getAll();
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await goalApi.getSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        monthlyAllocation: formData.monthlyAllocation ? parseFloat(formData.monthlyAllocation) : undefined,
      };

      if (editingGoal) {
        await goalApi.update(editingGoal.id, data);
      } else {
        await goalApi.create(data);
      }

      setIsDialogOpen(false);
      setEditingGoal(null);
      resetForm();
      fetchGoals();
      fetchSummary();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving goal');
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;

    const amount = parseFloat(contributeAmount);
    try {
      // 1. Contribute to goal
      await goalApi.contribute(selectedGoal.id, amount);

      // 2. Also record as an expense transaction
      await transactionApi.create({
        type: 'EXPENSE',
        amount: amount,
        category: 'Goal',
        description: selectedGoal.name,
        transactionDate: new Date().toISOString().split('T')[0],
        isRecurring: false,
        struggleMarker: false,
      });

      setIsContributeDialogOpen(false);
      setContributeAmount('');
      setSelectedGoal(null);
      fetchGoals();
      fetchSummary();
    } catch (error) {
      console.error('Error contributing to goal:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalApi.delete(id);
        fetchGoals();
        fetchSummary();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description || '',
      targetAmount: goal.targetAmount.toString(),
      targetDate: goal.targetDate,
      priority: goal.priority,
      category: goal.category || '',
      autoAllocate: goal.autoAllocate,
      monthlyAllocation: goal.monthlyAllocation?.toString() || '',
    });
    setIsDialogOpen(true);
  };

  const openContributeDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setContributeAmount('');
    setIsContributeDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      targetAmount: '',
      targetDate: '',
      priority: 'MEDIUM',
      category: '',
      autoAllocate: false,
      monthlyAllocation: '',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-rose-500 text-white shadow-lg shadow-rose-500/30';
      case 'MEDIUM': return 'bg-amber-500 text-white shadow-lg shadow-amber-500/30';
      case 'LOW': return 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30';
      default: return 'bg-neutral-500 text-white';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary"></div>
          <Target className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900/50 border border-white/5 p-12">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold tracking-tight text-white mb-2">
                  Financial <span className="text-primary">Goals</span>
                </h1>
                <p className="text-lg text-neutral-400">Strategic Wealth Objectives & Milestones</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 font-semibold transition-all shadow-lg shadow-primary/20"
                    onClick={() => { resetForm(); setEditingGoal(null); }}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    New Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md border border-white/5 shadow-2xl rounded-[2rem] bg-neutral-900">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                      {editingGoal ? 'Update' : 'New'} <span className="text-primary">Goal</span>
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-neutral-400">Goal Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., New Laptop"
                        className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-neutral-400">Description</Label>
                      <Input
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Why does this matter to you?"
                        className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-neutral-400">Target (₹)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.targetAmount}
                          onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                          required
                          className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-neutral-400">Deadline</Label>
                        <Input
                          type="date"
                          value={formData.targetDate}
                          onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                          required
                          className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-neutral-400">Priority Level</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-white/5 bg-neutral-800">
                          {priorities.map(p => (
                            <SelectItem key={p.value} value={p.value} className="font-medium">{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-bold transition-all">
                      {editingGoal ? 'Update Goal' : 'Create Goal'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Total Target', value: summary.totalTarget || 0, icon: Target, color: 'text-primary', bg: 'bg-primary/10', label: 'Cumulative targets' },
            { title: 'Accumulated', value: summary.totalProgress || 0, icon: PiggyBank, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Net corpus saved' },
            { title: 'In Progress', value: summary.activeCount, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Active goals', isCount: true },
            { title: 'Completed', value: summary.completedCount, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Missions accomplished', isCount: true },
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
                    {(card as any).isCount ? card.value : formatCurrency(card.value as number)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {goals.length === 0 ? (
            <Card className="col-span-full border-0 bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden">
              <CardContent className="p-20 text-center">
                <div className="bg-neutral-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-neutral-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Goals Set Yet</h3>
                <p className="text-neutral-400 max-w-sm mx-auto mb-8 font-medium">Define your financial ambitions and track your progress toward them.</p>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl transition-all" onClick={() => setIsDialogOpen(true)}>
                  Define Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            goals.map((goal) => (
              <Card key={goal.id} className={`group border-0 bg-neutral-900/40 border border-white/5 hover:bg-neutral-900/60 transition-all rounded-3xl overflow-hidden ${goal.status === 'COMPLETED' ? 'ring-2 ring-emerald-500/30' : ''}`}>
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${goal.status === 'COMPLETED' ? 'bg-emerald-500/10' : 'bg-primary/10'} rounded-xl`}>
                        <Target className={`h-4 w-4 ${goal.status === 'COMPLETED' ? 'text-emerald-500' : 'text-primary'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-white tracking-tight">{goal.name}</CardTitle>
                        <Badge className={`mt-1 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border-0 ${getPriorityColor(goal.priority)}`}>
                          {goal.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5" onClick={() => handleEdit(goal)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/5" onClick={() => handleDelete(goal.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-2 space-y-6">
                  {/* Amount info */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">Progress</p>
                      <CardDescription className="text-sm font-bold text-white tabular-nums">
                        <span className="text-white">{formatCurrency(goal.currentAmount)}</span>
                        <span className="text-neutral-600 mx-1">/</span>
                        <span className="text-neutral-400">{formatCurrency(goal.targetAmount)}</span>
                      </CardDescription>
                    </div>
                    <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ease-out ${goal.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-primary'}`}
                        style={{ width: `${Math.min(goal.progressPercentage || 0, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${goal.status === 'COMPLETED' ? 'text-emerald-500' : 'text-primary'}`}>
                        {(goal.progressPercentage || 0).toFixed(1)}% Complete
                      </span>
                      <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
                        {formatCurrency(goal.remainingAmount)} Left
                      </span>
                    </div>
                  </div>

                  {/* Time info */}
                  <div className="flex items-center justify-between py-3 border-y border-white/5">
                    <div className="flex items-center gap-2 text-neutral-400 font-medium text-sm">
                      <div className="p-1.5 bg-neutral-800 rounded-lg">
                        <Clock className="h-4 w-4 text-neutral-400" />
                      </div>
                      {goal.daysRemaining > 0 ? (
                        <span>{goal.daysRemaining} days remaining</span>
                      ) : goal.status === 'COMPLETED' ? (
                        <span className="text-emerald-500">Goal achieved!</span>
                      ) : (
                        <span className="text-rose-500">Timeline exceeded</span>
                      )}
                    </div>
                    <div className="text-[10px] font-black uppercase text-neutral-500 text-right leading-tight">
                      Target Date<br />
                      <span className="text-sm text-neutral-300">{format(new Date(goal.targetDate), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>

                  {!goal.onTrack && goal.status !== 'COMPLETED' && (
                    <div className="flex items-center gap-2 bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 text-amber-500 text-sm font-bold">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Behind schedule — boost your savings!</span>
                    </div>
                  )}

                  {goal.status === 'COMPLETED' ? (
                    <div className="bg-emerald-500 text-white p-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="h-6 w-6" />
                      <span className="text-lg font-black tracking-tight">MISSION COMPLETE</span>
                    </div>
                  ) : (
                    <Button
                      className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all"
                      onClick={() => openContributeDialog(goal)}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Contribute & Record Expense
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Contribute Dialog */}
      <Dialog open={isContributeDialogOpen} onOpenChange={setIsContributeDialogOpen}>
        <DialogContent className="max-w-sm border border-white/5 shadow-2xl rounded-[2rem] bg-neutral-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white tracking-tight text-center">
              Contribute to <span className="text-primary">Goal</span>
            </DialogTitle>
          </DialogHeader>
          {selectedGoal && (
            <form onSubmit={handleContribute} className="space-y-6 pt-2">
              <div className="text-center p-6 bg-neutral-800/50 rounded-3xl border border-white/5">
                <p className="text-xl font-black text-white mb-1 tracking-tight">{selectedGoal.name}</p>
                <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-neutral-400">
                  <span>{formatCurrency(selectedGoal.currentAmount)}</span>
                  <span className="text-neutral-600">/</span>
                  <span>{formatCurrency(selectedGoal.targetAmount)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-neutral-400 ml-1">Deposit Amount (₹)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  placeholder="Enter amount..."
                  className="h-14 border-white/5 bg-neutral-800 rounded-2xl text-xl font-bold text-center focus:ring-primary/20"
                  required
                />
              </div>
              <p className="text-xs text-neutral-500 text-center">
                This amount will also be recorded as an expense in your transactions.
              </p>
              <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20">
                Confirm & Record Expense
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Goals;
