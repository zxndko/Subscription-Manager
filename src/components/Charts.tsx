import { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSubscriptionStore } from '@/hooks/useSubscriptionStore';
import { SUBSCRIPTION_CATEGORIES } from '@/lib/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SpendingChart() {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);

  const monthlyData = useMemo(() => {
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      const monthSubscriptions = subscriptions.filter((sub) => {
        if (sub.status !== 'active') return false;
        const billingMonth = new Date(sub.nextBillingDate).getMonth();
        return billingMonth === index;
      });

      const totalCost = monthSubscriptions.reduce((sum, sub) => {
        switch (sub.billingCycle) {
          case 'weekly':
            return sum + (sub.cost * 4);
          case 'monthly':
            return sum + sub.cost;
          case 'quarterly':
            return sum + (index % 3 === 0 ? sub.cost : 0);
          case 'yearly':
            return sum + (index === currentMonth ? sub.cost : 0);
          default:
            return sum;
        }
      }, 0);

      return {
        month,
        cost: Math.round(totalCost),
        subscriptions: monthSubscriptions.length,
      };
    });
  }, [subscriptions]);

  return (
    <Card className="shadow-[0_8px_30px_-6px_color-mix(in_srgb,var(--primary)_15%,transparent)]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">แนวโน้มค่าใช้จ่าย</CardTitle>
        <CardDescription>ค่าใช้จ่ายรายเดือนตลอดทั้งปี</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 220)" />
            <XAxis 
              dataKey="month" 
              stroke="oklch(0.48 0.015 220)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="oklch(0.48 0.015 220)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'oklch(1 0 0)',
                border: '1px solid oklch(0.92 0.01 220)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px color-mix(in srgb, var(--primary) 15%, transparent)',
              }}
              labelStyle={{ color: 'oklch(0.15 0.01 220)', fontWeight: 600 }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
            />
            <Line 
              type="monotone" 
              dataKey="cost" 
              stroke="oklch(0.52 0.18 220)" 
              strokeWidth={3}
              name="ค่าใช้จ่าย (฿)"
              dot={{ fill: 'oklch(0.52 0.18 220)', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CategoryChart() {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);

  const categoryData = useMemo(() => {
    const activeSubscriptions = subscriptions.filter((sub) => sub.status === 'active');
    
    const categoryMap = new Map<string, { count: number; cost: number; color: string }>();

    activeSubscriptions.forEach((sub) => {
      const existing = categoryMap.get(sub.category) || { count: 0, cost: 0, color: '' };
      const categoryInfo = SUBSCRIPTION_CATEGORIES.find((cat) => cat.value === sub.category);
      
      let monthlyCost = sub.cost;
      switch (sub.billingCycle) {
        case 'weekly':
          monthlyCost = (sub.cost * 52) / 12;
          break;
        case 'quarterly':
          monthlyCost = sub.cost / 3;
          break;
        case 'yearly':
          monthlyCost = sub.cost / 12;
          break;
      }

      categoryMap.set(sub.category, {
        count: existing.count + 1,
        cost: existing.cost + monthlyCost,
        color: categoryInfo?.color || 'oklch(0.65 0.02 220)',
      });
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => {
      const categoryInfo = SUBSCRIPTION_CATEGORIES.find((cat) => cat.value === category);
      return {
        name: categoryInfo?.label || category,
        value: Math.round(data.cost),
        count: data.count,
        color: data.color,
      };
    }).sort((a, b) => b.value - a.value);
  }, [subscriptions]);

  return (
    <Card className="shadow-[0_8px_30px_-6px_color-mix(in_srgb,var(--primary)_15%,transparent)]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">การแบ่งตามหมวดหมู่</CardTitle>
        <CardDescription>ค่าใช้จ่ายรายเดือนแยกตามประเภท</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="oklch(0.52 0.18 220)"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'oklch(1 0 0)',
                  border: '1px solid oklch(0.92 0.01 220)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px color-mix(in srgb, var(--primary) 15%, transparent)',
                }}
                formatter={(value: number) => `฿${value.toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 220)" />
              <XAxis 
                dataKey="name" 
                stroke="oklch(0.48 0.015 220)"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="oklch(0.48 0.015 220)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'oklch(1 0 0)',
                  border: '1px solid oklch(0.92 0.01 220)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px color-mix(in srgb, var(--primary) 15%, transparent)',
                }}
                formatter={(value: number) => `฿${value.toLocaleString()}`}
              />
              <Bar 
                dataKey="value" 
                name="ค่าใช้จ่ายรายเดือน"
                radius={[8, 8, 0, 0]}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {categoryData.map((category) => (
            <div 
              key={category.name}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-all duration-200 hover:scale-[1.02]"
            >
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{category.name}</p>
                <p className="text-xs text-muted-foreground">
                  {category.count} รายการ · ฿{category.value.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}