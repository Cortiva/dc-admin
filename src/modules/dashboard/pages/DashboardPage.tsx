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
} from "../mock-data";
import KPICard from "../../../components/KpiCard";
import { Card } from "../../../components/ui/card";
import PageHeader from "../../../components/PageHeader";
import { AlertsSkeleton } from "../../../components/skeletons/AlertsSkeleton";
import { KpiSkeleton } from "../components/KpiSkeleton";
import { ChartSkeleton } from "../components/ChartSkeleton";
import { formatNumber } from "../../../utils/functions";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Notifications } from "../components/Notifications";

export default function DashboardPage() {

  const navigate = useNavigate();

  const isLoading = false;

  return (
    <div className="space-y-6">

      <PageHeader icon={<LayoutDashboard />} title="Dashboard" subtitle="Overview of key metrics and system status" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="col-span-4 xl:col-span-3">
          {/* Alert Bar */}
          {isLoading ? <AlertsSkeleton /> : <>
            <div className="mb-6 bg-teal-500/10 border-l-4 border-teal-500/40 p-4 rounded-r-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex-1">
                  <p className="text-xl sm:text-2xl font-medium text-teal-700">
                    {formatNumber(2402)} VIPs
                  </p>
                  <p className="text-sm text-teal-500 mt-1">
                    We have a total of {formatNumber(2402)} new members in the last 7 days, with a total of {formatNumber(820)} second timers.
                  </p>
                </div>
                <Button
                  className="self-start sm:self-center"
                  onClick={() => navigate("/visitors")}
                >View All</Button>
              </div>
            </div>
          </>}

          {/* KPI Cards Row */}
          {isLoading ? <KpiSkeleton /> : <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <KPICard
                title="Total Members"
                subtitle="Total church members"
                value={formatNumber(284240)}
                change={+16.12}
                icon={<Users className="w-6 h-6 sm:w-7 sm:h-7" />}
                color="green"
              />
              <KPICard
                title="First Timers"
                subtitle="Very Important Persons"
                value={formatNumber(1020)}
                change={+8.5}
                icon={<Users className="w-6 h-6 sm:w-7 sm:h-7" />}
                color="blue"
              />
              <KPICard
                title="Second Timers"
                subtitle="Returning Members"
                value={formatNumber(430)}
                change={-2.3}
                icon={<Users className="w-6 h-6 sm:w-7 sm:h-7" />}
                color="purple"
              />
              <KPICard
                title="Admins"
                subtitle="Church Staff"
                value={formatNumber(50)}
                change={+17.6}
                icon={<Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />}
                color="orange"
              />
            </div></>}

          {/* Charts Row */}
          {isLoading ? <ChartSkeleton /> : <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Revenue Trend Chart */}
              <Card className="lg:col-span-2 bg-card rounded-xl shadow-sm border border-muted-card p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base sm:text-lg font-semibold">Growth Trend</h3>
                </div>
                <ResponsiveContainer width="100%" height={240} className="sm:h-70! lg:h-80!">
                  <AreaChart data={revenueTrend}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00A86B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00A86B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} />
                    <YAxis stroke="#9CA3AF" fontSize={11} width={36} />
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
              <Card className="bg-card rounded-xl shadow-sm border border-muted-card p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-6">Dominion City Academy Chart</h3>
                <ResponsiveContainer width="100%" height={240} className="sm:h-65! lg:h-70!">
                  <PieChart>
                    <Pie
                      data={dashboardStats.charts.training}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="count"
                    >
                      {dashboardStats.charts.training.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={["#00A86B", "#FF6B35", "#17A2B8", "#FFC107"][index % 4]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div></>}
        </div>
        <div className="col-span-4 xl:col-span-1">
          <Notifications />
        </div>
      </div>
        
    </div>
  );
}