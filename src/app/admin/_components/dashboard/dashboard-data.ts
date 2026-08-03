export type DashboardStat = {
  title: string;
  value: string;
  change: string;
  comparison: string;
  trend: "up" | "down";
  icon: string;
  iconClassName: string;
};

export const dashboardStats: DashboardStat[] = [
  {
    title: "فروش امروز",
    value: "۲۹۵ میلیون تومان",
    change: "۸.۴٪+",
    comparison: "نسبت به خرداد",
    trend: "up",
    icon: "/icon/adminDashboard/chart.svg",
    iconClassName: "bg-primary-50 text-primary-500",
  },
  {
    title: "سفارشات امروز",
    value: "۶۳ سفارش فعال",
    change: "۵-",
    comparison: "نسبت به هفته گذشته",
    trend: "down",
    icon: "/icon/adminDashboard/cart.svg",
    iconClassName: "bg-secondary-50 text-secondary-700",
  },
  {
    title: "کالاهای کم‌موجود",
    value: "۸ نیاز به بازآوری",
    change: "",
    comparison: "این ماه",
    trend: "up",
    icon: "/icon/adminDashboard/product.svg",
    iconClassName: "bg-red-50 text-red-500",
  },
  {
    title: "مشتریان فعال",
    value: "۴.۶ هزار این ماه",
    change: "۱۲٪+",
    comparison: "نسبت به ماه قبل",
    trend: "up",
    icon: "/icon/adminDashboard/users.svg",
    iconClassName: "bg-violet-50 text-violet-600",
  },
];

export const revenueData = [
  { month: "بهمن", revenue: 28 },
  { month: "اسفند", revenue: 36 },
  { month: "فروردین", revenue: 30 },
  { month: "اردیبهشت", revenue: 41 },
  { month: "خرداد", revenue: 48 },
  { month: "تیر", revenue: 45 },
];

export const orderCountData = [
  { day: "شنبه", orders: 18 },
  { day: "دوشنبه", orders: 21 },
  { day: "چهارشنبه", orders: 29 },
  { day: "جمعه", orders: 53 },
];

export type RecentOrder = {
  customer: string;
  date: string;
  amount: string;
  status: "ارسال شده" | "تکمیل شده" | "در حال پردازش" | "لغو شده";
};

export const recentOrders: RecentOrder[] = [
  { customer: "فاطمه رضایی", date: "۱۴۰۴/۰۴/۲۴ · ۴۵ دقیقه پیش", amount: "۲,۵۰۰,۰۰۰ ت", status: "ارسال شده" },
  { customer: "مریم احمدی", date: "۱۴۰۴/۰۴/۲۳ · ۱ ساعت پیش", amount: "۵۸۰,۰۰۰ ت", status: "تکمیل شده" },
  { customer: "سارا محمدی", date: "۱۴۰۴/۰۴/۲۳ · ۲ دقیقه پیش", amount: "۳,۳۰۰,۰۰۰ ت", status: "در حال پردازش" },
  { customer: "نیلوفر حسینی", date: "۱۴۰۴/۰۴/۲۱ · ۳ ساعت پیش", amount: "۷۸۰,۰۰۰ ت", status: "لغو شده" },
];

export type TopProduct = {
  name: string;
  sales: string;
  revenue: string;
};

export const topProducts: TopProduct[] = [
  { name: "ماسک مو کراتین فارگو", sales: "۹۸ فروش", revenue: "۱,۹۰۰,۰۰۰ تومان" },
  { name: "رژلب مات شماره ۱۲", sales: "۸۷ فروش", revenue: "۱,۷۵۰,۰۰۰ تومان" },
  { name: "سرم ویتامین C اولهنریکسن", sales: "۷۶ فروش", revenue: "۱,۵۰۰,۰۰۰ تومان" },
  { name: "پنکیک مایع لورئال پاریس", sales: "۶۸ فروش", revenue: "۱,۲۰۰,۰۰۰ تومان" },
  { name: "پنکیک مایع لورئال پاریس", sales: "۵۶ فروش", revenue: "۹۸۰,۰۰۰ تومان" },
];
