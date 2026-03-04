import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Calendar, DollarSign, Package } from 'lucide-react';
import { StatsCards } from '@/components/StatsCards';
import { SpendingChart, CategoryChart } from '@/components/Charts';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { useSubscriptionStore } from '@/hooks/useSubscriptionStore';
import { useSubscriptionDue } from '@/hooks/useSubscriptionDue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IMAGES } from '@/assets/images';
import type { Subscription } from '@/lib';
export default function Dashboard() {
  const {
    subscriptions,
    filteredSubscriptions
  } = useSubscriptionStore();
  const {
    dueSubscriptions
  } = useSubscriptionDue(subscriptions);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const recentSubscriptions = filteredSubscriptions.sort((a, b) => new Date(b.nextBillingDate).getTime() - new Date(a.nextBillingDate).getTime()).slice(0, 5);
  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
  };
  const handleDelete = (id: string) => {
    useSubscriptionStore.getState().removeSubscription(id);
  };
  return <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={IMAGES.DASHBOARD_BG_6} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <motion.div initial={{
          opacity: 0,
          y: 24
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          type: 'spring',
          stiffness: 300,
          damping: 35
        }} className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">แดชบอร์ด</h1>
                <p className="text-muted-foreground mt-2">
                  ภาพรวมการสมัครสมาชิกและค่าใช้จ่ายของคุณ
                </p>
              </div>
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                เพิ่มการสมัครสมาชิก
              </Button>
            </div>
          </motion.div>

          <StatsCards />

          {dueSubscriptions.length > 0 && <motion.div initial={{
          opacity: 0,
          y: 24
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          type: 'spring',
          stiffness: 300,
          damping: 35,
          delay: 0.1
        }} className="mb-8">
              <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-destructive" />
                    <CardTitle className="text-destructive">การต่ออายุที่กำลังจะมาถึง</CardTitle>
                  </div>
                  <CardDescription>
                    คุณมีการสมัครสมาชิก {dueSubscriptions.length} รายการที่จะต่ออายุภายใน 3 วัน
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {dueSubscriptions.map(subscription => <div key={subscription.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{subscription.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ฿{subscription.cost.toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="destructive">
                          {new Date(subscription.nextBillingDate).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'short'
                    })}
                        </Badge>
                      </div>)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>}

          <div className="grid gap-8 lg:grid-cols-2 mt-2.5 mb-2.5">
            <motion.div initial={{
            opacity: 0,
            y: 24
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            type: 'spring',
            stiffness: 300,
            damping: 35,
            delay: 0.2
          }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <CardTitle>แนวโน้มค่าใช้จ่าย</CardTitle>
                  </div>
                  <CardDescription>
                    ค่าใช้จ่ายรายเดือนในช่วง 6 เดือนที่ผ่านมา
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SpendingChart />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 24
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            type: 'spring',
            stiffness: 300,
            damping: 35,
            delay: 0.3
          }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    <CardTitle>การแบ่งตามหมวดหมู่</CardTitle>
                  </div>
                  <CardDescription>
                    การกระจายค่าใช้จ่ายตามประเภทบริการ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryChart />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div initial={{
          opacity: 0,
          y: 24
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          type: 'spring',
          stiffness: 300,
          damping: 35,
          delay: 0.4
        }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <CardTitle>การสมัครสมาชิกล่าสุด</CardTitle>
                    </div>
                    <CardDescription className="mt-1">
                      รายการสมัครสมาชิกที่เพิ่งอัปเดตล่าสุด
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    ดูทั้งหมด
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentSubscriptions.length === 0 ? <div className="text-center py-12">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">ยังไม่มีการสมัครสมาชิก</p>
                    <Button className="mt-4" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      เพิ่มการสมัครสมาชิกแรก
                    </Button>
                  </div> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recentSubscriptions.map(subscription => <SubscriptionCard key={subscription.id} subscription={subscription} onEdit={handleEdit} onDelete={handleDelete} />)}
                  </div>}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>;
}