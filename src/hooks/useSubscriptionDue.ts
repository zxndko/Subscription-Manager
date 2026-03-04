import { useMemo } from 'react';
import { differenceInDays, startOfDay } from 'date-fns';
import type { Subscription } from '@/lib';

export const useSubscriptionDue = (subscriptions: Subscription[]) => {
  const dueSubscriptions = useMemo(() => {
    const today = startOfDay(new Date());
    
    return subscriptions.filter((subscription) => {
      if (subscription.status !== 'active') return false;
      
      const nextBilling = startOfDay(new Date(subscription.nextBillingDate));
      const daysUntilDue = differenceInDays(nextBilling, today);
      
      return daysUntilDue >= 0 && daysUntilDue <= 3;
    });
  }, [subscriptions]);

  const isDueSoon = (subscription: Subscription): boolean => {
    if (subscription.status !== 'active') return false;
    
    const today = startOfDay(new Date());
    const nextBilling = startOfDay(new Date(subscription.nextBillingDate));
    const daysUntilDue = differenceInDays(nextBilling, today);
    
    return daysUntilDue >= 0 && daysUntilDue <= 3;
  };

  const getDaysUntilDue = (subscription: Subscription): number => {
    const today = startOfDay(new Date());
    const nextBilling = startOfDay(new Date(subscription.nextBillingDate));
    return differenceInDays(nextBilling, today);
  };

  return {
    dueSubscriptions,
    isDueSoon,
    getDaysUntilDue,
    dueCount: dueSubscriptions.length,
  };
};
