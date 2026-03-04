import { motion } from 'framer-motion';
import { Edit2, Trash2, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Subscription } from '@/lib';
import { SUBSCRIPTION_CATEGORIES } from '@/lib';
import { useSubscriptionDue } from '@/hooks/useSubscriptionDue';
import { springPresets, hoverLift } from '@/lib/motion';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export function SubscriptionCard({ subscription, onEdit, onDelete }: SubscriptionCardProps) {
  const { isDueSoon, getDaysUntilDue } = useSubscriptionDue([subscription]);
  const dueSoon = isDueSoon(subscription);
  const daysUntilDue = getDaysUntilDue(subscription);

  const categoryInfo = SUBSCRIPTION_CATEGORIES.find(
    (cat) => cat.value === subscription.category
  );

  const statusColors = {
    active: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
    trial: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
    canceled: 'bg-muted text-muted-foreground border-border',
    expired: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const statusLabels = {
    active: 'ใช้งานอยู่',
    trial: 'ทดลองใช้',
    canceled: 'ยกเลิกแล้ว',
    expired: 'หมดอายุ',
  };

  const billingCycleLabels = {
    weekly: 'รายสัปดาห์',
    monthly: 'รายเดือน',
    quarterly: 'รายไตรมาส',
    yearly: 'รายปี',
  };

  return (
    <motion.div
      variants={hoverLift}
      initial="rest"
      whileHover="hover"
      transition={springPresets.snappy}
    >
      <Card className="relative overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <div
          className="absolute top-0 left-0 w-1 h-full"
          style={{ backgroundColor: categoryInfo?.color || 'var(--primary)' }}
        />
        
        {dueSoon && subscription.status === 'active' && (
          <div className="absolute top-3 right-3">
            <Badge
              variant="outline"
              className="bg-destructive/10 text-destructive border-destructive/20 gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              ครบกำหนดใน {daysUntilDue} วัน
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              {subscription.logo ? (
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg"
                  style={{ backgroundColor: categoryInfo?.color || 'var(--primary)' }}
                >
                  {subscription.name.charAt(0)}
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg"
                  style={{ backgroundColor: categoryInfo?.color || 'var(--primary)' }}
                >
                  {subscription.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-foreground truncate">
                  {subscription.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {categoryInfo?.label || 'อื่นๆ'}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={statusColors[subscription.status]}
            >
              {statusLabels[subscription.status]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {subscription.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {subscription.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">ค่าใช้จ่าย</p>
                <p className="font-semibold text-foreground">
                  ฿{subscription.cost.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">รอบบิล</p>
                <p className="font-semibold text-foreground">
                  {billingCycleLabels[subscription.billingCycle]}
                </p>
              </div>
            </div>
          </div>

          {subscription.status === 'active' && (
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">วันต่ออายุถัดไป</span>
                <span className="font-medium text-foreground">
                  {format(new Date(subscription.nextBillingDate), 'd MMM yyyy', {
                    locale: th,
                  })}
                </span>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t border-border/50 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => onEdit(subscription)}
          >
            <Edit2 className="w-4 h-4" />
            แก้ไข
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(subscription.id)}
          >
            <Trash2 className="w-4 h-4" />
            ลบ
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
