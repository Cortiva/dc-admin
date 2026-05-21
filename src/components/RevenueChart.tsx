import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { date: "Jan 1", revenue: 112000 },
    { date: "Jan 2", revenue: 145000 },
    { date: "Jan 3", revenue: 168000 },
];

export default function RevenueChart() {
    return (
        <div className="bg-card p-4 rounded-xl border">
            <h3 className="font-semibold mb-4">Revenue Trend</h3>

            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <XAxis dataKey="date" />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}