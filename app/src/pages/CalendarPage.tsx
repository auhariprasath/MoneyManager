import { useEffect, useState } from 'react';
import { transactionApi } from '@/services/api';
import type { Transaction } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameYear, getMonth, getYear } from 'date-fns';

type ViewMode = 'monthly' | 'yearly';
type FilterType = 'ALL' | 'INCOME' | 'EXPENSE';

const categories = [
  'All', 'Food', 'Transportation', 'Housing', 'Utilities',
  'Entertainment', 'Healthcare', 'Shopping', 'Education',
  'Salary', 'Freelance', 'Investments', 'Other'
];

const CalendarPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

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

  const getFilteredTransactions = (): Transaction[] => {
    return transactions.filter(t => {
      const matchesType = filterType === 'ALL' || t.type === filterType;
      const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
      return matchesType && matchesCategory;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const getTransactionsForDate = (date: Date): Transaction[] => {
    return filteredTransactions.filter(t => {
      const transDate = new Date(t.transactionDate);
      return (
        transDate.getDate() === date.getDate() &&
        transDate.getMonth() === date.getMonth() &&
        transDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getTransactionsForMonth = (date: Date): Transaction[] => {
    return filteredTransactions.filter(t => {
      const transDate = new Date(t.transactionDate);
      return isSameMonth(transDate, date);
    });
  };

  const getTransactionsForYear = (date: Date): Transaction[] => {
    return filteredTransactions.filter(t => {
      const transDate = new Date(t.transactionDate);
      return isSameYear(transDate, date);
    });
  };

  const getCurrentTransactions = (): Transaction[] => {
    switch (viewMode) {
      case 'monthly':
        return getTransactionsForMonth(selectedDate);
      case 'yearly':
        return getTransactionsForYear(selectedDate);
    }
  };

  const getMonthTotal = (date: Date, type: 'INCOME' | 'EXPENSE'): number => {
    return getTransactionsForMonth(date)
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getYearTotal = (date: Date, type: 'INCOME' | 'EXPENSE'): number => {
    return getTransactionsForYear(date)
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMonthlySummary = () => {
    const income = getMonthTotal(selectedDate, 'INCOME');
    const expense = getMonthTotal(selectedDate, 'EXPENSE');
    return { income, expense, net: income - expense };
  };

  const getYearlySummary = () => {
    const income = getYearTotal(selectedDate, 'INCOME');
    const expense = getYearTotal(selectedDate, 'EXPENSE');
    return { income, expense, net: income - expense };
  };

  const getSummary = () => {
    switch (viewMode) {
      case 'monthly':
        return getMonthlySummary();
      case 'yearly':
        return getYearlySummary();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary"></div>
          <CalendarIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
        </div>
      </div>
    );
  }

  const currentTransactions = getCurrentTransactions();
  const summary = getSummary();

  return (
    <div className="min-h-screen">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900/50 border border-white/5 p-12">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-5xl font-bold tracking-tight text-white mb-2">
                  Temporal <span className="text-primary">Ledger</span>
                </h1>
                <p className="text-lg text-neutral-400 font-medium">Chronological Financial Visualization</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className={`rounded-xl font-bold ${showFilters ? 'bg-primary text-white' : 'border-white/10 text-neutral-300 hover:bg-white/5'}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {(filterType !== 'ALL' || filterCategory !== 'All') && (
                    <Badge className="ml-2 bg-white/20 text-white h-5 w-5 p-0 flex items-center justify-center">
                      {(filterType !== 'ALL' ? 1 : 0) + (filterCategory !== 'All' ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                  <TabsList className="bg-neutral-800 rounded-xl p-1">
                    <TabsTrigger value="monthly" className="rounded-lg font-bold">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly" className="rounded-lg font-bold">Yearly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            {showFilters && (
              <div className="flex flex-wrap items-center gap-4 p-4 bg-neutral-800/50 rounded-xl border border-white/5 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-400">Type:</span>
                  <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
                    <SelectTrigger className="w-36 h-10 border-white/5 bg-neutral-800 rounded-xl font-medium text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/5 bg-neutral-800">
                      <SelectItem value="ALL">All Types</SelectItem>
                      <SelectItem value="INCOME">Income</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-400">Category:</span>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40 h-10 border-white/5 bg-neutral-800 rounded-xl font-medium text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/5 bg-neutral-800">
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(filterType !== 'ALL' || filterCategory !== 'All') && (
                  <Button
                    variant="ghost"
                    className="text-neutral-400 hover:text-white"
                    onClick={() => {
                      setFilterType('ALL');
                      setFilterCategory('All');
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {viewMode === 'monthly' && 'Month View'}
                    {viewMode === 'yearly' && 'Year View'}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5"
                      onClick={() => {
                        if (viewMode === 'monthly') {
                          setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
                        } else {
                          setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth()));
                        }
                      }}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-lg font-bold text-white min-w-[140px] text-center">
                      {viewMode === 'monthly' && format(currentMonth, 'MMMM yyyy')}
                      {viewMode === 'yearly' && format(currentMonth, 'yyyy')}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5"
                      onClick={() => {
                        if (viewMode === 'monthly') {
                          setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
                        } else {
                          setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth()));
                        }
                      }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center">
                  {viewMode === 'monthly' && (
                    <div className="grid grid-cols-7 gap-2 w-full">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-bold text-neutral-500 py-2">{day}</div>
                      ))}
                      {eachDayOfInterval({
                        start: startOfMonth(currentMonth),
                        end: endOfMonth(currentMonth)
                      }).map((date) => {
                        const dayTransactions = getTransactionsForDate(date);
                        const income = dayTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
                        const expense = dayTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
                        const hasTx = dayTransactions.length > 0;
                        const isSelected = isSameMonth(date, selectedDate) && date.getDate() === selectedDate.getDate();
                        const isToday = new Date().toDateString() === date.toDateString();
                        
                        return (
                          <button
                            key={date.toISOString()}
                            onClick={() => {
                              setSelectedDate(date);
                              setCurrentMonth(date);
                            }}
                            className={`
                              p-2 rounded-xl text-center transition-all min-h-[80px] flex flex-col
                              ${isSelected ? 'bg-primary text-white' : isToday ? 'bg-neutral-700 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}
                            `}
                          >
                            <div className="text-sm font-bold mb-1">{format(date, 'd')}</div>
                            {hasTx && (
                              <div className="flex flex-col gap-0.5 mt-auto">
                                {income > 0 && (
                                  <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-primary'}`}>
                                    +{formatCurrency(income)}
                                  </div>
                                )}
                                {expense > 0 && (
                                  <div className={`text-xs font-bold ${isSelected ? 'text-white/80' : 'text-rose-500'}`}>
                                    -{formatCurrency(expense)}
                                  </div>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {viewMode === 'yearly' && (
                    <div className="grid grid-cols-4 gap-3 w-full">
                      {Array.from({ length: 12 }, (_, i) => {
                        const monthDate = new Date(getYear(currentMonth), i, 1);
                        const monthTransactions = getTransactionsForMonth(monthDate);
                        const income = monthTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
                        const expense = monthTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
                        const hasTx = monthTransactions.length > 0;
                        const isSelected = getMonth(selectedDate) === i && isSameYear(selectedDate, currentMonth);

                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedDate(monthDate);
                              setCurrentMonth(monthDate);
                              setViewMode('monthly');
                            }}
                            className={`
                              p-4 rounded-xl text-center transition-all min-h-[100px] flex flex-col
                              ${isSelected ? 'bg-primary text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}
                              ${hasTx ? 'ring-2 ring-primary/50' : ''}
                            `}
                          >
                            <div className="text-sm font-bold">{format(monthDate, 'MMM')}</div>
                            {hasTx ? (
                              <div className="flex flex-col gap-0.5 mt-auto">
                                <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-primary'}`}>
                                  +{formatCurrency(income)}
                                </div>
                                <div className={`text-xs font-bold ${isSelected ? 'text-white/80' : 'text-rose-500'}`}>
                                  -{formatCurrency(expense)}
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-neutral-600 mt-auto">No txns</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary & Transactions */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="border-0 bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white tracking-tight mb-4">
                  {viewMode === 'monthly' && `Summary: ${format(selectedDate, 'MMMM yyyy')}`}
                  {viewMode === 'yearly' && `Summary: ${format(selectedDate, 'yyyy')}`}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-neutral-300">Inflow</span>
                    </div>
                    <span className="text-lg font-bold text-primary">{formatCurrency(summary.income)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-rose-500/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-rose-500" />
                      <span className="text-sm font-medium text-neutral-300">Outflow</span>
                    </div>
                    <span className="text-lg font-bold text-rose-500">{formatCurrency(summary.expense)}</span>
                  </div>
                  <div className={`flex justify-between items-center p-3 rounded-xl ${summary.net >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className={`h-4 w-4 ${summary.net >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
                      <span className="text-sm font-medium text-neutral-300">Net</span>
                    </div>
                    <span className={`text-lg font-bold ${summary.net >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {summary.net >= 0 ? '+' : ''}{formatCurrency(summary.net)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transactions List */}
            <Card className="border-0 bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white tracking-tight mb-4">
                  Transactions ({currentTransactions.length})
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {currentTransactions.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-neutral-600 mx-auto mb-3" />
                      <p className="text-neutral-500 font-medium">No transactions found</p>
                    </div>
                  ) : (
                    currentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-4 bg-neutral-800/50 rounded-xl border border-white/5"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {transaction.type === 'INCOME' ? (
                              <TrendingUp className="h-4 w-4 text-primary" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-rose-500" />
                            )}
                            <span className="font-bold text-white">{transaction.category}</span>
                          </div>
                          <span className={`font-bold ${transaction.type === 'INCOME' ? 'text-primary' : 'text-rose-500'}`}>
                            {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-neutral-400">{transaction.description || 'No description'}</p>
                          <span className="text-xs text-neutral-500 uppercase tracking-widest">
                            {format(new Date(transaction.transactionDate), 'MMM dd')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;