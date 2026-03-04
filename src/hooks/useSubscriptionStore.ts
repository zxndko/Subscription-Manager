import { create } from 'zustand';
import { Subscription, SubscriptionCategory, SubscriptionStatus } from '@/lib/index';
import { mockSubscriptions, mockStats } from '@/data/index';

interface SubscriptionStore {
  subscriptions: Subscription[];
  filteredSubscriptions: Subscription[];
  stats: {
    totalSubscriptions: number;
    monthlyCost: number;
    upcomingRenewals: number;
    totalSavings: number;
  };
  filters: {
    category?: SubscriptionCategory;
    status?: SubscriptionStatus;
    searchQuery?: string;
  };
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  editSubscription: (id: string, subscription: Partial<Subscription>) => void;
  removeSubscription: (id: string) => void;
  setFilter: (filters: Partial<SubscriptionStore['filters']>) => void;
  clearFilters: () => void;
  calculateStats: () => void;
}

const calculateMonthlyCost = (subscriptions: Subscription[]): number => {
  return subscriptions.reduce((total, sub) => {
    if (sub.status !== 'active') return total;
    
    switch (sub.billingCycle) {
      case 'weekly':
        return total + (sub.cost * 52) / 12;
      case 'monthly':
        return total + sub.cost;
      case 'quarterly':
        return total + sub.cost / 3;
      case 'yearly':
        return total + sub.cost / 12;
      default:
        return total;
    }
  }, 0);
};

const applyFilters = (
  subscriptions: Subscription[],
  filters: SubscriptionStore['filters']
): Subscription[] => {
  return subscriptions.filter((sub) => {
    if (filters.category && sub.category !== filters.category) return false;
    if (filters.status && sub.status !== filters.status) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        sub.name.toLowerCase().includes(query) ||
        sub.description?.toLowerCase().includes(query)
      );
    }
    return true;
  });
};

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: mockSubscriptions,
  filteredSubscriptions: mockSubscriptions,
  stats: mockStats,
  filters: {},

  addSubscription: (subscription) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: Date.now().toString(),
    };
    
    set((state) => {
      const subscriptions = [...state.subscriptions, newSubscription];
      const filteredSubscriptions = applyFilters(subscriptions, state.filters);
      return { subscriptions, filteredSubscriptions };
    });
    
    get().calculateStats();
  },

  editSubscription: (id, updates) => {
    set((state) => {
      const subscriptions = state.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, ...updates } : sub
      );
      const filteredSubscriptions = applyFilters(subscriptions, state.filters);
      return { subscriptions, filteredSubscriptions };
    });
    
    get().calculateStats();
  },

  removeSubscription: (id) => {
    set((state) => {
      const subscriptions = state.subscriptions.filter((sub) => sub.id !== id);
      const filteredSubscriptions = applyFilters(subscriptions, state.filters);
      return { subscriptions, filteredSubscriptions };
    });
    
    get().calculateStats();
  },

  setFilter: (filters) => {
    set((state) => {
      const newFilters = { ...state.filters, ...filters };
      const filteredSubscriptions = applyFilters(state.subscriptions, newFilters);
      return { filters: newFilters, filteredSubscriptions };
    });
  },

  clearFilters: () => {
    set((state) => ({
      filters: {},
      filteredSubscriptions: state.subscriptions,
    }));
  },

  calculateStats: () => {
    const { subscriptions } = get();
    const activeSubscriptions = subscriptions.filter((sub) => sub.status === 'active');
    
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const upcomingRenewals = activeSubscriptions.filter(
      (sub) => sub.nextBillingDate <= threeDaysFromNow && sub.nextBillingDate >= now
    ).length;

    const monthlyCost = calculateMonthlyCost(activeSubscriptions);
    const yearlyCost = monthlyCost * 12;
    const totalSavings = subscriptions
      .filter((sub) => sub.status === 'canceled' || sub.status === 'expired')
      .reduce((total, sub) => {
        switch (sub.billingCycle) {
          case 'weekly':
            return total + (sub.cost * 52);
          case 'monthly':
            return total + (sub.cost * 12);
          case 'quarterly':
            return total + (sub.cost * 4);
          case 'yearly':
            return total + sub.cost;
          default:
            return total;
        }
      }, 0);

    set({
      stats: {
        totalSubscriptions: subscriptions.length,
        monthlyCost: Math.round(monthlyCost),
        upcomingRenewals,
        totalSavings: Math.round(totalSavings),
      },
    });
  },
}));
