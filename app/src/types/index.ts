export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  currency: string;
  riskProfile: 'LOW' | 'MEDIUM' | 'HIGH';
  categories: string[];
  notificationPreferences: {
    budgetAlerts: boolean;
    goalMilestones: boolean;
    weeklyReports: boolean;
    billReminders: boolean;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: string;
  description?: string;
  transactionDate: string;
  isRecurring: boolean;
  recurringDetails?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    endDate?: string;
    dayOfMonth?: string;
  };
  struggleMarker: boolean;
  paymentMethod?: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limitAmount: number;
  spentAmount: number;
  alertThreshold: number;
  budgetMonth: string;
  alertSent: boolean;
  notes?: string;
  remainingAmount: number;
  usagePercentage: number;
  overBudget: boolean;
  thresholdExceeded: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  category?: string;
  icon?: string;
  color?: string;
  autoAllocate: boolean;
  monthlyAllocation?: number;
  remainingAmount: number;
  progressPercentage: number;
  daysRemaining: number;
  suggestedMonthlySaving: number;
  onTrack: boolean;
}

export interface Analytics {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrends: MonthlyTrend[];
  weeklyTrends: WeeklyTrend[];
  budgetStatus: BudgetStatus[];
  strugglePoints: StrugglePoint[];
  insights: SpendingInsight[];
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  type: string;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  savings: number;
}

export interface WeeklyTrend {
  week: string;
  income: number;
  expense: number;
  savings: number;
}

export interface BudgetStatus {
  category: string;
  budgetLimit: number;
  spent: number;
  remaining: number;
  usagePercentage: number;
  overBudget: boolean;
  thresholdExceeded: boolean;
}

export interface StrugglePoint {
  category: string;
  count: number;
  totalAmount: number;
  suggestion: string;
}

export interface SpendingInsight {
  type: string;
  title: string;
  description: string;
  potentialSavings?: number;
}

export interface Suggestions {
  spendingSuggestions: SpendingSuggestion[];
  investmentSuggestions: InvestmentSuggestion[];
  goalSuggestions: GoalSuggestion[];
  budgetOptimizations: BudgetOptimization[];
  dailyTip: FinancialTip;
}

export interface SpendingSuggestion {
  category: string;
  title: string;
  description: string;
  currentSpending: number;
  suggestedLimit: number;
  potentialSavings: number;
  priority: string;
}

export interface InvestmentSuggestion {
  type: string;
  title: string;
  description: string;
  suggestedAmount: number;
  expectedReturn: number;
  riskLevel: string;
  timeHorizon: string;
  options: string[];
}

export interface GoalSuggestion {
  goalId: string;
  title: string;
  description: string;
  suggestedMonthlySaving: number;
  monthsToAchieve: number;
  achievable: boolean;
}

export interface BudgetOptimization {
  category: string;
  recommendation: string;
  currentBudget: number;
  suggestedBudget: number;
  reason: string;
}

export interface FinancialTip {
  title: string;
  content: string;
  category: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  token?: string;
  type?: string;
  id: string;
  username: string;
  email: string;
  fullName?: string;
  message: string;
}
