import { useEffect, useState } from 'react';
import { budgetApi, transactionApi } from '@/services/api';
import type { Budget } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Wallet,
  Calendar,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';

const categories = [
  'Food', 'Transportation', 'Housing', 'Utilities',
  'Entertainment', 'Healthcare', 'Shopping', 'Education', 'Other'
];

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [summary, setSummary] = useState({ totalBudget: 0, totalSpent: 0, overallUsage: 0 });
  const [payingBudget, setPayingBudget] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    limitAmount: '',
    alertThreshold: '80',
    notes: '',
  });

  useEffect(() => {
    fetchBudgets();
    fetchSummary();
  }, [selectedMonth]);

  const fetchBudgets = async () => {
    try {
      const response = await budgetApi.getAll(selectedMonth);
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await budgetApi.getSummary(selectedMonth);
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
        limitAmount: parseFloat(formData.limitAmount),
        alertThreshold: parseFloat(formData.alertThreshold),
        budgetMonth: selectedMonth,
      };

      if (editingBudget) {
        await budgetApi.update(editingBudget.id, data);
      } else {
        await budgetApi.create(data);
      }

      setIsDialogOpen(false);
      setEditingBudget(null);
      resetForm();
      fetchBudgets();
      fetchSummary();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving budget');
    }
  };

  /**
   * "Paid" button handler: creates an EXPENSE transaction for the full budget limit
   * and refreshes budgets so the spending is reflected.
   */
  const handlePaid = async (budget: Budget) => {
    setPayingBudget(budget.id);
    try {
      await transactionApi.create({
        type: 'EXPENSE',
        amount: budget.limitAmount,
        category: budget.category,
        description: `Budget payment: ${budget.category} (${selectedMonth})`,
        transactionDate: new Date().toISOString().split('T')[0],
        isRecurring: false,
        struggleMarker: false,
      });
      fetchBudgets();
      fetchSummary();
    } catch (error) {
      console.error('Error recording budget payment:', error);
    } finally {
      setPayingBudget(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgetApi.delete(id);
        fetchBudgets();
        fetchSummary();
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      limitAmount: budget.limitAmount.toString(),
      alertThreshold: budget.alertThreshold.toString(),
      notes: budget.notes || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      category: '',
      limitAmount: '',
      alertThreshold: '80',
      notes: '',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /** Determine if a budget is "fully paid" (spent >= limit) */
  const isPaid = (budget: Budget) => budget.spentAmount >= budget.limitAmount;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary"></div>
          <Wallet className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900/50 border border-white/5 p-12">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold tracking-tight text-white mb-2">
                  Budget <span className="text-primary">Management</span>
                </h1>
                <p className="text-lg text-neutral-400">Strategic Capital Allocation & Surveillance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 bg-neutral-900/50 p-3 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-xl border border-white/5">
            <Calendar className="h-4 w-4 text-primary" />
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-32 border-0 bg-transparent focus-visible:ring-0 font-medium text-xs text-white p-0 h-auto"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 font-medium transition-all"
                onClick={() => { resetForm(); setEditingBudget(null); }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md border border-white/5 shadow-2xl rounded-[2rem] bg-neutral-900">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                  {editingBudget ? 'Update' : 'New'} <span className="text-primary">Budget</span>
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-neutral-400">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    disabled={!!editingBudget}
                  >
                    <SelectTrigger className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-white/5 bg-neutral-800">
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat} className="font-medium">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-neutral-400">Budget Limit (₹)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-neutral-500">₹</span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.limitAmount}
                      onChange={(e) => setFormData({ ...formData, limitAmount: e.target.value })}
                      required
                      className="h-12 pl-8 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 text-lg font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-neutral-400">Warning Threshold ({formData.alertThreshold}%)</Label>
                  <Input
                    type="range"
                    min="1"
                    max="100"
                    value={formData.alertThreshold}
                    onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
                    className="h-6 accent-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-neutral-400">Notes (Optional)</Label>
                  <Input
                    placeholder="Capital allocation purpose..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium"
                  />
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-bold transition-all">
                  {editingBudget ? 'Update Budget' : 'Create Budget'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Allocation', value: summary.totalBudget || 0, icon: Wallet, color: 'text-primary', bg: 'bg-primary/10', label: 'Total Planned' },
            { title: 'Utilization', value: summary.totalSpent || 0, icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'Total Spent' },
            { title: 'Efficiency', value: `${(summary.overallUsage || 0).toFixed(1)}%`, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Usage Velocity' }
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

        {/* Breach Alerts */}
        {budgets.some(b => b.overBudget) && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4">
            <div className="p-2 bg-rose-500 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-rose-500 uppercase tracking-wider">Breach Alert</p>
              <p className="text-white font-medium">
                Target thresholds exceeded in {budgets.filter(b => b.overBudget).length} sector(s).
              </p>
            </div>
          </div>
        )}

        {/* Budget Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {budgets.length === 0 ? (
            <Card className="col-span-full border-0 bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden">
              <CardContent className="p-20 text-center">
                <div className="bg-neutral-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Wallet className="h-8 w-8 text-neutral-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Budgets Defined</h3>
                <p className="text-neutral-400 max-w-sm mx-auto mb-8 font-medium">
                  Initialize your capital allocation for {format(new Date(selectedMonth), 'MMMM')}.
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl transition-all" onClick={() => setIsDialogOpen(true)}>
                  Initiate Allocation
                </Button>
              </CardContent>
            </Card>
          ) : (
            budgets.map((budget) => {
              const paid = isPaid(budget);
              return (
                <Card
                  key={budget.id}
                  className={`group border-0 bg-neutral-900/40 border border-white/5 hover:bg-neutral-900/60 transition-all rounded-3xl overflow-hidden ${paid ? 'ring-2 ring-emerald-500/30' : budget.overBudget ? 'ring-2 ring-rose-500/30' : ''}`}
                >
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${paid ? 'bg-emerald-500/10' : budget.overBudget ? 'bg-rose-500/10' : 'bg-primary/10'}`}>
                          {paid
                            ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            : <Wallet className={`h-4 w-4 ${budget.overBudget ? 'text-rose-500' : 'text-primary'}`} />
                          }
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-white tracking-tight">{budget.category}</CardTitle>
                          {paid ? (
                            <Badge className="mt-1 bg-emerald-500 text-white border-0 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">
                              Paid
                            </Badge>
                          ) : budget.overBudget ? (
                            <Badge className="mt-1 bg-rose-500 text-white border-0 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">
                              Over Budget
                            </Badge>
                          ) : budget.thresholdExceeded ? (
                            <Badge className="mt-1 bg-amber-500 text-white border-0 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">
                              Near Limit
                            </Badge>
                          ) : (
                            <Badge className="mt-1 bg-primary/20 text-primary border-0 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5" onClick={() => handleEdit(budget)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/5" onClick={() => handleDelete(budget.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 pt-4 space-y-5">
                    {/* Budget Limit Value — clean, prominent */}
                    <div className="p-5 bg-neutral-800/50 rounded-2xl border border-white/5 text-center">
                      <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-1">Budget Limit</p>
                      <p className="text-3xl font-bold text-white tracking-tight tabular-nums">
                        {formatCurrency(budget.limitAmount)}
                      </p>
                    </div>

                    {/* Notes */}
                    {budget.notes && (
                      <div className="p-3 bg-neutral-800/50 rounded-xl border border-white/5">
                        <p className="text-xs text-neutral-400 italic line-clamp-1">"{budget.notes}"</p>
                      </div>
                    )}

                    {/* Paid button or already paid indicator */}
                    {paid ? (
                      <div className="w-full h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <span className="text-emerald-500 font-bold text-sm">Payment Recorded</span>
                      </div>
                    ) : (
                      <Button
                        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all"
                        onClick={() => handlePaid(budget)}
                        disabled={payingBudget === budget.id}
                      >
                        {payingBudget === budget.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2" />
                            Recording...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Mark as Paid
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Budgets;
