import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Calendar, DollarSign, PieChart, BarChart3 } from "lucide-react";
import { SpendingChart, CategoryChart } from "@/components/Charts";
import { useSubscriptionStore } from "@/hooks/useSubscriptionStore";
import { SUBSCRIPTION_CATEGORIES } from "@/lib/index";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { IMAGES } from "@/assets/images";

export default function Analytics() {
  const { subscriptions, stats } = useSubscriptionStore();

  const activeSubscriptions = subscriptions.filter((sub) => sub.status === "active");
  const categoryBreakdown = SUBSCRIPTION_CATEGORIES.map((cat) => {
    const categorySubscriptions = activeSubscriptions.filter(
      (sub) => sub.category === cat.value
    );
    const monthlyCost = categorySubscriptions.reduce((total, sub) => {
      switch (sub.billingCycle) {
        case "weekly":
          return total + (sub.cost * 52) / 12;
        case "monthly":
          return total + sub.cost;
        case "quarterly":
          return total + sub.cost / 3;
        case "yearly":
          return total + sub.cost / 12;
        default:
          return total;
      }
    }, 0);

    return {
      category: cat.label,
      count: categorySubscriptions.length,
      monthlyCost: Math.round(monthlyCost),
      color: cat.color,
    };
  }).filter((item) => item.count > 0);

  const totalMonthlyByCategory = categoryBreakdown.reduce(
    (sum, item) => sum + item.monthlyCost,
    0
  );

  const avgCostPerSubscription = activeSubscriptions.length > 0
    ? Math.round(stats.monthlyCost / activeSubscriptions.length)
    : 0;

  const yearlyProjection = stats.monthlyCost * 12;
  const savingsRate = stats.totalSavings > 0
    ? Math.round((stats.totalSavings / (stats.totalSavings + yearlyProjection)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `url(${IMAGES.CALENDAR_BG_1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/70" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">การวิเคราะห์</h1>
            <p className="text-muted-foreground">
              ข้อมูลเชิงลึกเกี่ยวกับการใช้จ่ายและแนวโน้มการสมัครสมาชิก
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 35 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    ค่าใช้จ่ายรายเดือน
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">฿{stats.monthlyCost.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ฿{yearlyProjection.toLocaleString()} ต่อปี
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 35 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    ค่าเฉลี่ยต่อบริการ
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">฿{avgCostPerSubscription.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    จาก {activeSubscriptions.length} บริการที่ใช้งาน
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 35 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    เงินที่ประหยัดได้
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">฿{stats.totalSavings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    อัตราการประหยัด {savingsRate}%
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 35 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    การต่ออายุที่กำลังจะมาถึง
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-chart-3" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.upcomingRenewals}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ใน 3 วันข้างหน้า
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Tabs defaultValue="trends" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="trends">แนวโน้มการใช้จ่าย</TabsTrigger>
              <TabsTrigger value="categories">แบ่งตามหมวดหมู่</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 35 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      แนวโน้มการใช้จ่ายรายเดือน
                    </CardTitle>
                    <CardDescription>
                      ภาพรวมค่าใช้จ่ายในช่วง 6 เดือนที่ผ่านมา
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SpendingChart />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 35 }}
                >
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-primary" />
                        การกระจายตามหมวดหมู่
                      </CardTitle>
                      <CardDescription>
                        สัดส่วนการใช้จ่ายแต่ละหมวดหมู่
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CategoryChart />
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 35 }}
                >
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>รายละเอียดตามหมวดหมู่</CardTitle>
                      <CardDescription>
                        จำนวนและค่าใช้จ่ายรายเดือนแต่ละหมวดหมู่
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categoryBreakdown.map((item, index) => (
                          <motion.div
                            key={item.category}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.7 + index * 0.1,
                              type: "spring",
                              stiffness: 300,
                              damping: 35,
                            }}
                            className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <div>
                                <p className="font-medium">{item.category}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.count} บริการ
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">฿{item.monthlyCost.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">
                                {totalMonthlyByCategory > 0
                                  ? Math.round((item.monthlyCost / totalMonthlyByCategory) * 100)
                                  : 0}%
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 35 }}
            className="mt-8"
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>ข้อมูลเชิงลึก</CardTitle>
                <CardDescription>
                  คำแนะนำสำหรับการจัดการการสมัครสมาชิก
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.upcomingRenewals > 0 && (
                    <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/20">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-chart-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1">การต่ออายุที่กำลังจะมาถึง</h4>
                          <p className="text-sm text-muted-foreground">
                            คุณมี {stats.upcomingRenewals} บริการที่จะต่ออายุใน 3 วันข้างหน้า
                            ตรวจสอบให้แน่ใจว่ายังต้องการใช้งานต่อ
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {avgCostPerSubscription > 500 && (
                    <div className="p-4 rounded-lg bg-chart-1/10 border border-chart-1/20">
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-chart-1 mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1">ค่าใช้จ่ายเฉลี่ยสูง</h4>
                          <p className="text-sm text-muted-foreground">
                            ค่าเฉลี่ยต่อบริการของคุณคือ ฿{avgCostPerSubscription.toLocaleString()}
                            พิจารณาตรวจสอบบริการที่ไม่ได้ใช้งานบ่อย
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {stats.totalSavings > 0 && (
                    <div className="p-4 rounded-lg bg-chart-2/10 border border-chart-2/20">
                      <div className="flex items-start gap-3">
                        <TrendingDown className="h-5 w-5 text-chart-2 mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1">การประหยัดที่ดี</h4>
                          <p className="text-sm text-muted-foreground">
                            คุณประหยัดได้ ฿{stats.totalSavings.toLocaleString()} จากการยกเลิกบริการที่ไม่จำเป็น
                            ทำได้ดีมาก!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {categoryBreakdown.length > 5 && (
                    <div className="p-4 rounded-lg bg-chart-4/10 border border-chart-4/20">
                      <div className="flex items-start gap-3">
                        <PieChart className="h-5 w-5 text-chart-4 mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1">หลากหลายหมวดหมู่</h4>
                          <p className="text-sm text-muted-foreground">
                            คุณมีบริการใน {categoryBreakdown.length} หมวดหมู่
                            พิจารณารวมบริการที่คล้ายกันเพื่อประหยัดค่าใช้จ่าย
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
