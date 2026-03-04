import { TrendingUp, CreditCard, Calendar, PiggyBank } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptionStore } from '@/hooks/useSubscriptionStore';
import { useSubscriptionDue } from '@/hooks/useSubscriptionDue';

export function StatsCards() {
  const { stats, subscriptions } = useSubscriptionStore();
  const { dueCount } = useSubscriptionDue(subscriptions);

  const statCards = [
    {
      title: 'การสมัครสมาชิกทั้งหมด',
      value: stats.totalSubscriptions,
      icon: TrendingUp,
      color: 'oklch(0.55 0.2 260)',
      suffix: 'รายการ',
    },
    {
      title: 'ค่าใช้จ่ายรายเดือน',
      value: stats.monthlyCost,
      icon: CreditCard,
      color: 'oklch(0.58 0.22 10)',
      prefix: '฿',
      suffix: '/เดือน',
    },
    {
      title: 'ต่ออายุที่กำลังจะมาถึง',
      value: dueCount,
      icon: Calendar,
      color: 'oklch(0.65 0.2 30)',
      suffix: 'รายการ',
      highlight: dueCount > 0,
    },
    {
      title: 'เงินที่ประหยัดได้',
      value: stats.totalSavings,
      icon: PiggyBank,
      color: 'oklch(0.6 0.18 180)',
      prefix: '฿',
      suffix: '/ปี',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="relative overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
            style={{
              boxShadow: `0 8px 30px -6px color-mix(in srgb, ${stat.color} 15%, transparent)`,
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className="rounded-lg p-2"
                style={{
                  backgroundColor: `color-mix(in srgb, ${stat.color} 10%, transparent)`,
                }}
              >
                <Icon
                  className="h-4 w-4"
                  style={{ color: stat.color }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                {stat.prefix && (
                  <span className="text-2xl font-bold">{stat.prefix}</span>
                )}
                <span
                  className="text-3xl font-bold"
                  style={{
                    color: stat.highlight ? stat.color : 'inherit',
                  }}
                >
                  {stat.value.toLocaleString('th-TH')}
                </span>
                {stat.suffix && (
                  <span className="text-sm text-muted-foreground">
                    {stat.suffix}
                  </span>
                )}
              </div>
              {stat.highlight && dueCount > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  ต้องต่ออายุภายใน 3 วัน
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
