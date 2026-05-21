import AppLayout from "../../components/layouts/AppLayout";
import {
  Users,
  Briefcase,
  Star,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  MoreVertical,
  Filter,
  ChevronLeft,
  Eye,
  UserCheck,
  UserX,
  LayoutDashboard
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
// Mock data (matching our API response)
import {
  dashboardStats,
  revenueTrend,
  topArtisans,
  recentActivity,
  verificationQueue,
  activeJobs,
  disputeList,
  alerts
} from "./mock-data";
import KPICard from "../../components/KpiCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Card } from "../../components/ui/card";
import { SelectIcon, SelectItemText, SelectPortal, SelectViewport } from "@radix-ui/react-select";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import StatusBadge from "../../components/StatusBadge";

import * as Tooltip from "@radix-ui/react-tooltip";
import { Badge } from "../../components/ui/badge";
import PageHeader from "../../components/PageHeader";
import { AlertsSkeleton } from "../../components/skeletons/AlertsSkeleton";
import { KpiSkeleton } from "./components/KpiSkeleton";
import { ChartSkeleton } from "./components/ChartSkeleton";
import { TableSkeleton } from "../../components/skeletons/TableSkeleton";

export default function DashboardPage() {
  const isLoading = false; // Simulate loading state

  return (
    <AppLayout>
      <div className="space-y-6">

        <PageHeader icon={<LayoutDashboard />} title="Dashboard" subtitle="Overview of key metrics and system status" />
        
        {/* Alert Bar */}
        {isLoading ? <AlertsSkeleton /> : <>
        {alerts.critical.length > 0 && (
          <div className="mb-6 bg-red-500/10 border-l-4 border-red-500/40 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-700">
                  {alerts.critical.length} Critical Alerts
                </p>
                <p className="text-sm text-red-500 mt-1">
                  {alerts.critical[0].message}
                </p>
              </div>
              <button className="text-red-500 hover:text-red-600 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
        )}</>}

        {/* KPI Cards Row */}
        {isLoading ? <KpiSkeleton /> : <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Revenue"
            value={`₦${(dashboardStats.overview.totalRevenue / 1000000).toFixed(1)}M`}
            change={+16.12}
            icon={<DollarSign className="w-5 h-5" />}
            color="green"
          />
          <KPICard
            title="Active Jobs"
            value={dashboardStats.overview.activeJobs.toString()}
            change={+8.5}
            icon={<Briefcase className="w-5 h-5" />}
            color="blue"
          />
          <KPICard
            title="Active Customers"
            value={dashboardStats.overview.totalCustomers.toLocaleString()}
            change={+12.3}
            icon={<Users className="w-5 h-5" />}
            color="purple"
          />
          <KPICard
            title="Avg Response Time"
            value="4.2 min"
            change={-17.6}
            icon={<Clock className="w-5 h-5" />}
            color="orange"
          />
        </div></>}

        {/* Charts Row */}
        {isLoading ? <ChartSkeleton /> : <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <Card className="lg:col-span-2 bg-card rounded-xl shadow-sm border border-muted-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Revenue Trend</h3>
              <Select defaultValue="30days">
                <SelectTrigger className="inline-flex items-center justify-between rounded-lg border border-muted-card px-3 py-1.5 text-sm w-32">
                  <SelectValue />
                  <SelectIcon className="ml-2">
                    <ChevronLeft className="w-4 h-4 rotate-270" />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent className="bg-card rounded-lg shadow-lg border border-muted-card overflow-hidden z-50">
                    <SelectViewport>
                      <SelectItem value="7days" className="px-3 py-2 text-sm hover:bg-background cursor-pointer outline-none">
                        <SelectItemText>Last 7 days</SelectItemText>
                      </SelectItem>
                      <SelectItem value="30days" className="px-3 py-2 text-sm hover:bg-background cursor-pointer outline-none">
                        <SelectItemText>Last 30 days</SelectItemText>
                      </SelectItem>
                      <SelectItem value="90days" className="px-3 py-2 text-sm hover:bg-background cursor-pointer outline-none">
                        <SelectItemText>Last 90 days</SelectItemText>
                      </SelectItem>
                    </SelectViewport>
                  </SelectContent>
                </SelectPortal>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A86B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00A86B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <RechartsTooltip />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00A86B" 
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Jobs by Category Pie Chart */}
          <Card className="bg-card rounded-xl shadow-sm border border-muted-card p-6">
            <h3 className="text-lg font-semibold mb-6">Jobs by Category</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={dashboardStats.charts.topCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="jobs"
                >
                  {dashboardStats.charts.topCategories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={["#00A86B", "#FF6B35", "#17A2B8", "#FFC107", "#DC3545"][index % 5]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div></>}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Verification Queue */}
            {isLoading ? <TableSkeleton /> : <>
            <Card className="bg-card rounded-xl shadow-sm border border-muted-card overflow-hidden">
              <div className="px-6 py-4 border-b border-muted-card flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Verification Queue</h3>
                  <p className="text-sm text-muted-foreground">
                    {verificationQueue.pending} artisans pending verification
                  </p>
                </div>
                <button className="text-primary-600 hover:text-primary text-sm font-medium cursor-pointer">
                  View All →
                </button>
              </div>
              <div className="divide-y divide-muted-card">
                {verificationQueue.priority.map((artisan) => (
                  <div key={artisan.id} className="px-6 py-4 flex items-center justify-between hover:bg-background transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 rounded-full bg-background flex items-center justify-center overflow-hidden">
                        <AvatarFallback className="text-muted-foreground font-medium">
                          {artisan.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{artisan.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="px-2 py-0.5 bg-background text-muted-foreground text-xs rounded-full">
                            {artisan.trade}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Waiting {artisan.waitingHours}h
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition-colors">
                              <UserCheck className="w-4 h-4" />
                            </button>
                          </Tooltip.Trigger>
                          <TooltipContent className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                            Verify
                          </TooltipContent>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                      <TooltipProvider>
                        <Tooltip.Root>
                          <TooltipTrigger asChild>
                            <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                              <UserX className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                            Reject
                          </TooltipContent>
                        </Tooltip.Root>
                      </TooltipProvider>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card></>}

            {/* Active Jobs Table */}
            <Card className="bg-card rounded-xl shadow-sm border border-muted-card overflow-hidden">
              <div className="px-6 py-4 border-b border-muted-card flex items-center justify-between">
                <h3 className="text-lg font-semibold">Active Jobs</h3>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-background rounded-lg cursor-pointer">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="text-primary-600 hover:text-primary text-sm font-medium cursor-pointer">
                    View All →
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background border-b border-muted-card">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Job</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Customer</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Artisan</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Amount</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted-card">
                    {activeJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-background transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{job.jobCode}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
                              <AvatarFallback className="text-xs text-muted-foreground">
                                {job.customer.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{job.customer}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{job.artisan || "—"}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={job.status} />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">₦{job.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <button className="p-1 hover:bg-card rounded-lg cursor-pointer">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Right Column - 1 col */}
          <div className="space-y-6">
            {/* Top Artisans */}
            <Card className="bg-card rounded-xl shadow-sm border border-muted-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Artisans</h3>
                <button className="text-primary-600 hover:text-primary cursor-pointer text-sm">View All →</button>
              </div>
              <div className="space-y-4">
                {topArtisans.map((artisan, idx) => (
                  <div key={artisan.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium">{artisan.name}</p>
                        <p className="text-xs text-muted-foreground">{artisan.trade} • {artisan.jobsCompleted} jobs</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₦{(artisan.revenue / 1000).toFixed(0)}K</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-muted-foreground">{artisan.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-card rounded-xl shadow-sm border border-muted-card p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      activity.importance === "high" ? "bg-red-100" : "bg-gray-100"
                    }`}>
                      {activity.type === "job_completed" && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {activity.type === "dispute_raised" && <AlertCircle className="w-4 h-4 text-red-600" />}
                      {activity.type === "artisan_verified" && <UserCheck className="w-4 h-4 text-teal-600" />}
                      {activity.type === "payment_failed" && <XCircle className="w-4 h-4 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm ">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Open Disputes */}
            <Card className="bg-card rounded-xl shadow-sm border border-muted-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Open Disputes</h3>
                <Badge className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {disputeList.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {disputeList.map((dispute) => (
                  <div key={dispute.id} className="p-3 bg-red-100 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-red-800">
                        {dispute.jobCode}
                      </span>
                      <Badge className={`px-2 py-0.5 rounded-full text-xs ${
                        dispute.priority === "high" ? "bg-red-200 text-red-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {dispute.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-red-700 mb-2">{dispute.reason}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-red-600">
                        {dispute.raisedBy} • {dispute.daysOpen}d ago
                      </span>
                      <button className="text-xs font-medium text-red-700 hover:text-red-800">
                        Resolve →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
        
      </div>
    </AppLayout>
  );
}