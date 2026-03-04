import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { SubscriptionForm } from '@/components/SubscriptionForm';
import { useSubscriptionStore } from '@/hooks/useSubscriptionStore';
import { Subscription, SUBSCRIPTION_CATEGORIES } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

export default function Subscriptions() {
  const {
    filteredSubscriptions,
    filters,
    setFilter,
    clearFilters,
    removeSubscription,
  } = useSubscriptionStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>();
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilter({ searchQuery: value });
  };

  const handleCategoryFilter = (category: string) => {
    if (category === 'all') {
      setFilter({ category: undefined });
    } else {
      setFilter({ category: category as any });
    }
  };

  const handleStatusFilter = (status: string) => {
    if (status === 'all') {
      setFilter({ status: undefined });
    } else {
      setFilter({ status: status as any });
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    removeSubscription(id);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSubscription(undefined);
  };

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name, 'th');
        break;
      case 'cost':
        comparison = a.cost - b.cost;
        break;
      case 'date':
        comparison = a.nextBillingDate.getTime() - b.nextBillingDate.getTime();
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const activeFiltersCount = [
    filters.category,
    filters.status,
    filters.searchQuery,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">การสมัครสมาชิก</h1>
                <p className="text-muted-foreground mt-2">
                  จัดการและติดตามการสมัครสมาชิกทั้งหมดของคุณ
                </p>
              </div>
              <Button
                onClick={() => setIsFormOpen(true)}
                size="lg"
                className="gap-2"
              >
                <Plus className="w-5 h-5" />
                เพิ่มการสมัครสมาชิก
              </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาการสมัครสมาชิก..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              <div className="flex gap-3">
                <Select
                  value={filters.category || 'all'}
                  onValueChange={handleCategoryFilter}
                >
                  <SelectTrigger className="w-[180px] h-12">
                    <SelectValue placeholder="หมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                    {SUBSCRIPTION_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.status || 'all'}
                  onValueChange={handleStatusFilter}
                >
                  <SelectTrigger className="w-[180px] h-12">
                    <SelectValue placeholder="สถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกสถานะ</SelectItem>
                    <SelectItem value="active">ใช้งานอยู่</SelectItem>
                    <SelectItem value="trial">ทดลองใช้</SelectItem>
                    <SelectItem value="canceled">ยกเลิกแล้ว</SelectItem>
                    <SelectItem value="expired">หมดอายุ</SelectItem>
                  </SelectContent>
                </Select>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-12 w-12 relative">
                      <SlidersHorizontal className="w-5 h-5" />
                      {activeFiltersCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>ตัวกรองและการเรียงลำดับ</SheetTitle>
                      <SheetDescription>
                        ปรับแต่งการแสดงผลการสมัครสมาชิกของคุณ
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">เรียงตาม</label>
                        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">ชื่อ</SelectItem>
                            <SelectItem value="cost">ราคา</SelectItem>
                            <SelectItem value="date">วันต่ออายุ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium">ลำดับ</label>
                        <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asc">น้อยไปมาก</SelectItem>
                            <SelectItem value="desc">มากไปน้อย</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {activeFiltersCount > 0 && (
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className="w-full gap-2"
                        >
                          <X className="w-4 h-4" />
                          ล้างตัวกรองทั้งหมด
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">ตัวกรองที่ใช้งาน:</span>
                {filters.category && (
                  <Badge variant="secondary" className="gap-1">
                    {SUBSCRIPTION_CATEGORIES.find((c) => c.value === filters.category)?.label}
                    <button
                      onClick={() => setFilter({ category: undefined })}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.status && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.status === 'active' && 'ใช้งานอยู่'}
                    {filters.status === 'trial' && 'ทดลองใช้'}
                    {filters.status === 'canceled' && 'ยกเลิกแล้ว'}
                    {filters.status === 'expired' && 'หมดอายุ'}
                    <button
                      onClick={() => setFilter({ status: undefined })}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    ค้นหา: {filters.searchQuery}
                    <button
                      onClick={() => handleSearch('')}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              แสดง {sortedSubscriptions.length} รายการ
            </p>
          </div>

          {sortedSubscriptions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 px-4"
            >
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                <Filter className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ไม่พบการสมัครสมาชิก</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {activeFiltersCount > 0
                  ? 'ลองปรับเปลี่ยนตัวกรองหรือเพิ่มการสมัครสมาชิกใหม่'
                  : 'เริ่มต้นด้วยการเพิ่มการสมัครสมาชิกแรกของคุณ'}
              </p>
              {activeFiltersCount > 0 ? (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4 gap-2"
                >
                  <X className="w-4 h-4" />
                  ล้างตัวกรอง
                </Button>
              ) : (
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="mt-4 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  เพิ่มการสมัครสมาชิก
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              <AnimatePresence mode="popLayout">
                {sortedSubscriptions.map((subscription) => (
                  <motion.div
                    key={subscription.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SubscriptionCard
                      subscription={subscription}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <SubscriptionForm
            subscription={editingSubscription}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
