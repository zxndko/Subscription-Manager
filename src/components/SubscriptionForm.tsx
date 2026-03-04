import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Subscription, BILLING_CYCLES, SUBSCRIPTION_CATEGORIES } from '@/lib/index';
import { useSubscriptionStore } from '@/hooks/useSubscriptionStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อบริการ'),
  category: z.enum([
    'streaming',
    'productivity',
    'fitness',
    'education',
    'gaming',
    'cloud-storage',
    'music',
    'news',
    'other',
  ]),
  cost: z.coerce.number().min(0, 'ราคาต้องมากกว่าหรือเท่ากับ 0'),
  billingCycle: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  nextBillingDate: z.date({
    required_error: 'กรุณาเลือกวันที่เรียกเก็บเงินครั้งถัดไป',
  }),
  status: z.enum(['active', 'canceled', 'expired', 'trial']),
  description: z.string().optional(),
  logo: z.string().optional(),
  color: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SubscriptionFormProps {
  subscription?: Subscription;
  onClose: () => void;
}

export function SubscriptionForm({ subscription, onClose }: SubscriptionFormProps) {
  const { addSubscription, editSubscription } = useSubscriptionStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: subscription
      ? {
          name: subscription.name,
          category: subscription.category,
          cost: subscription.cost,
          billingCycle: subscription.billingCycle,
          nextBillingDate: new Date(subscription.nextBillingDate),
          status: subscription.status,
          description: subscription.description || '',
          logo: subscription.logo || '',
          color: subscription.color || '',
        }
      : {
          name: '',
          category: 'other',
          cost: 0,
          billingCycle: 'monthly',
          nextBillingDate: new Date(),
          status: 'active',
          description: '',
          logo: '',
          color: '',
        },
  });

  const onSubmit = (values: FormValues) => {
    if (subscription) {
      editSubscription(subscription.id, values);
    } else {
      const subscriptionData: Omit<Subscription, 'id'> = {
        name: values.name,
        category: values.category,
        cost: values.cost,
        billingCycle: values.billingCycle,
        nextBillingDate: values.nextBillingDate,
        status: values.status,
        description: values.description,
        logo: values.logo,
        color: values.color,
      };
      addSubscription(subscriptionData);
    }
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {subscription ? 'แก้ไขการสมัครสมาชิก' : 'เพิ่มการสมัครสมาชิกใหม่'}
          </DialogTitle>
          <DialogDescription>
            {subscription
              ? 'แก้ไขข้อมูลการสมัครสมาชิกของคุณ'
              : 'เพิ่มการสมัครสมาชิกใหม่เพื่อติดตามค่าใช้จ่าย'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อบริการ</FormLabel>
                    <FormControl>
                      <Input placeholder="Netflix, Spotify, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>หมวดหมู่</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกหมวดหมู่" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SUBSCRIPTION_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ราคา (บาท)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billingCycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รอบการเรียกเก็บเงิน</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกรอบการเรียกเก็บเงิน" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BILLING_CYCLES.map((cycle) => (
                          <SelectItem key={cycle.value} value={cycle.value}>
                            {cycle.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nextBillingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>วันที่เรียกเก็บเงินครั้งถัดไป</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: th })
                            ) : (
                              <span>เลือกวันที่</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>สถานะ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกสถานะ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">ใช้งานอยู่</SelectItem>
                        <SelectItem value="trial">ทดลองใช้</SelectItem>
                        <SelectItem value="canceled">ยกเลิกแล้ว</SelectItem>
                        <SelectItem value="expired">หมดอายุ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รายละเอียด (ไม่บังคับ)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="เพิ่มรายละเอียดเกี่ยวกับการสมัครสมาชิก"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL โลโก้ (ไม่บังคับ)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/logo.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>สีประจำบริการ (ไม่บังคับ)</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                ยกเลิก
              </Button>
              <Button type="submit">
                {subscription ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มการสมัครสมาชิก'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
