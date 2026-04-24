import { useEffect, useState } from 'react';
import { transactionApi } from '@/services/api';
import type { Transaction } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Wallet
} from 'lucide-react';
import { format } from 'date-fns';

const categories = [
  'Food', 'Transportation', 'Housing', 'Utilities',
  'Entertainment', 'Healthcare', 'Shopping', 'Education',
  'Salary', 'Freelance', 'Investments', 'Other'
];

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    amount: '',
    category: '',
    description: '',
    transactionDate: format(new Date(), 'yyyy-MM-dd'),
    struggleMarker: false,
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionApi.getAll();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (editingTransaction) {
        await transactionApi.update(editingTransaction.id, data);
      } else {
        await transactionApi.create(data);
      }

      setIsDialogOpen(false);
      setEditingTransaction(null);
      resetForm();
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionApi.delete(id);
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description || '',
      transactionDate: transaction.transactionDate,
      struggleMarker: transaction.struggleMarker,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'EXPENSE',
      amount: '',
      category: '',
      description: '',
      transactionDate: format(new Date(), 'yyyy-MM-dd'),
      struggleMarker: false,
    });
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch =
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'ALL' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const incomeTotal = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const expenseTotal = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

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
          <Calendar className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900/50 border border-white/5 p-12">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-5xl font-bold tracking-tight text-white mb-2">
                  Ledger <span className="text-primary">Registry</span>
                </h1>
                <p className="text-lg text-neutral-400 font-medium">Systematic Capital Flow Tracking</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 font-bold transition-all shadow-lg shadow-primary/20" onClick={() => { resetForm(); setEditingTransaction(null); }}>
                    <Plus className="mr-2 h-5 w-5" />
                    Record Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md border border-white/5 shadow-2xl rounded-[2rem] bg-neutral-900">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                      {editingTransaction ? 'Modify' : 'New'} <span className="text-primary">Transaction</span>
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-neutral-400">Flow Type</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value) => setFormData({ ...formData, type: value })}
                        >
                          <SelectTrigger className="border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-white/5 bg-neutral-800">
                            <SelectItem value="INCOME">Income</SelectItem>
                            <SelectItem value="EXPENSE">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-neutral-400">Amount (₹)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-bold"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-neutral-400">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className="border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="border-white/5 bg-neutral-800 max-h-60">
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-neutral-400">Date</Label>
                      <Input
                        type="date"
                        value={formData.transactionDate}
                        onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                        className="border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-neutral-400">Description</Label>
                      <Input
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Contextual details..."
                        className="border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-3 bg-neutral-800/50 p-4 rounded-xl border border-white/5">
                      <input
                        type="checkbox"
                        id="struggleMarker"
                        checked={formData.struggleMarker}
                        onChange={(e) => setFormData({ ...formData, struggleMarker: e.target.checked })}
                        className="w-4 h-4 rounded border-white/10 bg-neutral-800 text-primary focus:ring-primary/20"
                      />
                      <Label htmlFor="struggleMarker" className="text-sm cursor-pointer font-medium text-white">
                        Anomaly Marker
                        <span className="block text-[10px] text-neutral-500">Tag as challenging expense node</span>
                      </Label>
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-bold transition-all">
                      {editingTransaction ? 'Execute Revision' : 'Confirm Entry'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Inflow', value: incomeTotal, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10', label: 'Total Revenue' },
            { title: 'Outflow', value: expenseTotal, icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'Operational Costs' },
            { title: 'Net Capital', value: incomeTotal - expenseTotal, icon: Wallet, color: (incomeTotal - expenseTotal >= 0) ? 'text-emerald-500' : 'text-rose-500', bg: (incomeTotal - expenseTotal >= 0) ? 'bg-emerald-500/10' : 'bg-rose-500/10', label: 'Available Liquidity' }
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
                  <p className={`text-2xl font-bold tracking-tight tabular-nums ${card.title === 'Net Capital' ? card.color : 'text-white'}`}>
                    {formatCurrency(card.value)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Global Surveillance & Search */}
        <div className="flex flex-wrap items-center gap-4 bg-neutral-900/50 p-3 rounded-2xl border border-white/5">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="System-wide ledger search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-11 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 text-neutral-200"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48 h-11 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium text-white">
              <SelectValue placeholder="Scope Type" />
            </SelectTrigger>
            <SelectContent className="border-white/5 bg-neutral-800 text-white">
              <SelectItem value="ALL">Full Spectrum</SelectItem>
              <SelectItem value="INCOME">Income Vector</SelectItem>
              <SelectItem value="EXPENSE">Expense Nodes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ledger Surveillance List */}
        <div className="bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {filteredTransactions.length === 0 ? (
              <div className="p-20 text-center">
                <div className="bg-neutral-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-neutral-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Records Detected</h3>
                <p className="text-neutral-400 max-w-sm mx-auto font-medium">Verify your search parameters or ledger type filters.</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="group p-6 flex flex-wrap items-center justify-between gap-4 hover:bg-white/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-2xl ${transaction.type === 'INCOME' ? 'bg-primary/10' : 'bg-rose-500/10'}`}>
                      {transaction.type === 'INCOME' ? (
                        <TrendingUp className="h-6 w-6 text-primary" />
                      ) : (
                        <TrendingDown className="h-6 w-6 text-rose-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-bold text-white tracking-tight">{transaction.category}</span>
                        {transaction.struggleMarker && (
                          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-bold uppercase tracking-wider h-5">
                            Anomaly
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-medium text-neutral-400">{transaction.description || 'System entry record'}</p>
                        <span className="h-1 w-1 rounded-full bg-neutral-700" />
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
                          {format(new Date(transaction.transactionDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className={`text-xl font-bold tabular-nums tracking-tight ${transaction.type === 'INCOME' ? 'text-primary' : 'text-rose-500'}`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5" onClick={() => handleEdit(transaction)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-500/5" onClick={() => handleDelete(transaction.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
