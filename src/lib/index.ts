export interface Subscription {
  id: string;
  name: string;
  category: SubscriptionCategory;
  cost: number;
  billingCycle: BillingCycle;
  nextBillingDate: Date;
  status: SubscriptionStatus;
  description?: string;
  logo?: string;
  color?: string;
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  monthlyCost: number;
  upcomingRenewals: number;
  totalSavings: number;
}

export type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'quarterly';

export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trial';

export type SubscriptionCategory = 
  | 'streaming'
  | 'productivity'
  | 'fitness'
  | 'education'
  | 'gaming'
  | 'cloud-storage'
  | 'music'
  | 'news'
  | 'other';

export const ROUTE_PATHS = {
  HOME: '/',
  DASHBOARD: '/',
  SUBSCRIPTIONS: '/subscriptions',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;

export const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: 'weekly', label: 'รายสัปดาห์' },
  { value: 'monthly', label: 'รายเดือน' },
  { value: 'quarterly', label: 'รายไตรมาส' },
  { value: 'yearly', label: 'รายปี' },
];

export const SUBSCRIPTION_CATEGORIES: { value: SubscriptionCategory; label: string; color: string }[] = [
  { value: 'streaming', label: 'สตรีมมิ่ง', color: 'oklch(0.58 0.22 10)' },
  { value: 'productivity', label: 'เครื่องมือทำงาน', color: 'oklch(0.55 0.2 260)' },
  { value: 'fitness', label: 'ฟิตเนส', color: 'oklch(0.6 0.18 180)' },
  { value: 'education', label: 'การศึกษา', color: 'oklch(0.65 0.2 30)' },
  { value: 'gaming', label: 'เกม', color: 'oklch(0.58 0.22 340)' },
  { value: 'cloud-storage', label: 'คลาวด์สตอเรจ', color: 'oklch(0.52 0.16 200)' },
  { value: 'music', label: 'เพลง', color: 'oklch(0.62 0.25 10)' },
  { value: 'news', label: 'ข่าวสาร', color: 'oklch(0.48 0.015 220)' },
  { value: 'other', label: 'อื่นๆ', color: 'oklch(0.65 0.02 220)' },
];
