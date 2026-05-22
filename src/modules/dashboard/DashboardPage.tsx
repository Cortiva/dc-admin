import AppLayout from "../../components/layouts/AppLayout";
import {
  Users,
  Briefcase,
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
} from "./mock-data";
import KPICard from "../../components/KpiCard";
import { Card } from "../../components/ui/card";
import PageHeader from "../../components/PageHeader";
import { AlertsSkeleton } from "../../components/skeletons/AlertsSkeleton";
import { KpiSkeleton } from "./components/KpiSkeleton";
import { ChartSkeleton } from "./components/ChartSkeleton";
import { formatNumber } from "../../utils/functions";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Notifications } from "./components/Notifications";

export default function DashboardPage() {

  const navigate = useNavigate();

  const isLoading = false; // Simulate loading state

  return (
    <AppLayout>
      <div className="space-y-6">

        <PageHeader icon={<LayoutDashboard />} title="Dashboard" subtitle="Overview of key metrics and system status" />

        <div className="grid grid-cols-4 gap-5">
          <div className="col-span-4 lg:col-span-3">
            {/* Alert Bar */}
            {isLoading ? <AlertsSkeleton /> : <>
              <div className="mb-6 bg-teal-500/10 border-l-4 border-teal-500/40 p-4 rounded-r-lg">
                <div className="flex justify-between items-center gap-3">
                  <div className="flex-1">
                    <p className="text-2xl font-medium text-teal-700">
                      {formatNumber(2402)} VIPs
                    </p>
                    <p className="text-sm text-teal-500 mt-1">
                      We have a total of {formatNumber(2402)} new members in the last 7 days, with a total of {formatNumber(820)} second timers.
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/visitors")}
                  >View All</Button>
                </div>
              </div>
            </>}

            {/* KPI Cards Row */}
            {isLoading ? <KpiSkeleton /> : <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard
                  title="Total Members"
                  subtitle="Total church members"
                  value={formatNumber(284240)}
                  change={+16.12}
                  icon={<Users className="w-7 h-7" />}
                  color="green"
                />
                <KPICard
                  title="First Timers"
                  subtitle="Very Important Persons"
                  value={formatNumber(1020)}
                  change={+8.5}
                  icon={<Users className="w-7 h-7" />}
                  color="blue"
                />
                <KPICard
                  title="Second Timers"
                  subtitle="Returning Members"
                  value={formatNumber(430)}
                  change={-2.3}
                  icon={<Users className="w-7 h-7" />}
                  color="purple"
                />
                <KPICard
                  title="Admins"
                  subtitle="Church Staff"
                  value={formatNumber(50)}
                  change={+17.6}
                  icon={<Briefcase className="w-7 h-7" />}
                  color="orange"
                />
              </div></>}

            {/* Charts Row */}
            {isLoading ? <ChartSkeleton /> : <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue Trend Chart */}
                <Card className="lg:col-span-2 bg-card rounded-xl shadow-sm border border-muted-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Growth Trend</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={revenueTrend}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00A86B" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00A86B" stopOpacity={0} />
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

                {/* Dominion City Academy Chart Pie Chart */}
                <Card className="bg-card rounded-xl shadow-sm border border-muted-card p-6">
                  <h3 className="text-lg font-semibold mb-6">Dominion City Academy Chart</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={dashboardStats.charts.training}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="count"
                      >
                        {dashboardStats.charts.training.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={["#00A86B", "#FF6B35", "#17A2B8", "#FFC107"][index % 4]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div></>}
          </div>
          <div className="col-span-4 lg:col-span-1">
            <Notifications />
          </div>
        </div>
        
      </div>
    </AppLayout>
  );
}