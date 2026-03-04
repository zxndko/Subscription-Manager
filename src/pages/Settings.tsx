import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Moon, Sun, Globe, CreditCard, Shield, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { springPresets, fadeInUp } from "@/lib/motion";

export default function Settings() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    renewalReminders: true,
    weeklyReport: false,
    priceChanges: true,
  });
  const [currency, setCurrency] = useState("THB");
  const [language, setLanguage] = useState("th");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springPresets.gentle}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">การตั้งค่า</h1>
          <p className="text-muted-foreground mt-2">จัดการการตั้งค่าบัญชีและความชอบของคุณ</p>
        </div>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                การแจ้งเตือน
              </CardTitle>
              <CardDescription>จัดการการแจ้งเตือนและการเตือนความจำ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">การแจ้งเตือนทางอีเมล</Label>
                  <p className="text-sm text-muted-foreground">รับการอัปเดตทางอีเมล</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">การแจ้งเตือนแบบพุช</Label>
                  <p className="text-sm text-muted-foreground">รับการแจ้งเตือนบนอุปกรณ์</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="renewal-reminders">การเตือนต่ออายุ</Label>
                  <p className="text-sm text-muted-foreground">แจ้งเตือน 3 วันก่อนต่ออายุ</p>
                </div>
                <Switch
                  id="renewal-reminders"
                  checked={notifications.renewalReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, renewalReminders: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-report">รายงานรายสัปดาห์</Label>
                  <p className="text-sm text-muted-foreground">สรุปการใช้จ่ายรายสัปดาห์</p>
                </div>
                <Switch
                  id="weekly-report"
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="price-changes">การเปลี่ยนแปลงราคา</Label>
                  <p className="text-sm text-muted-foreground">แจ้งเตือนเมื่อราคาเปลี่ยนแปลง</p>
                </div>
                <Switch
                  id="price-changes"
                  checked={notifications.priceChanges}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, priceChanges: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                รูปลักษณ์
              </CardTitle>
              <CardDescription>ปรับแต่งรูปลักษณ์ของแอปพลิเคชัน</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme-toggle">โหมดมืด</Label>
                  <p className="text-sm text-muted-foreground">สลับระหว่างโหมดสว่างและมืด</p>
                </div>
                <Switch id="theme-toggle" checked={theme === "dark"} onCheckedChange={toggleTheme} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                ภูมิภาคและภาษา
              </CardTitle>
              <CardDescription>ตั้งค่าภาษาและสกุลเงิน</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">ภาษา</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="th">ไทย</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">สกุลเงิน</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="THB">บาท (THB)</SelectItem>
                    <SelectItem value="USD">ดอลลาร์สหรัฐ (USD)</SelectItem>
                    <SelectItem value="EUR">ยูโร (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                การชำระเงิน
              </CardTitle>
              <CardDescription>จัดการวิธีการชำระเงินของคุณ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">หมายเลขบัตร</Label>
                <Input id="card-number" placeholder="**** **** **** 1234" disabled />
              </div>
              <Button variant="outline" className="w-full">
                เพิ่มวิธีการชำระเงิน
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                ความปลอดภัย
              </CardTitle>
              <CardDescription>จัดการการตั้งค่าความปลอดภัยของบัญชี</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <div className="flex gap-2">
                  <Input id="email" type="email" placeholder="your@email.com" className="flex-1" />
                  <Button variant="outline">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <div className="flex gap-2">
                  <Input id="phone" type="tel" placeholder="+66 XX XXX XXXX" className="flex-1" />
                  <Button variant="outline">
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Separator />
              <Button variant="outline" className="w-full">
                เปลี่ยนรหัสผ่าน
              </Button>
              <Button variant="outline" className="w-full">
                เปิดใช้งานการยืนยันตัวตนแบบสองขั้นตอน
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline">ยกเลิก</Button>
            <Button>บันทึกการเปลี่ยนแปลง</Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
