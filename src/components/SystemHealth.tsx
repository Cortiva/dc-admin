export default function SystemHealthCard() {
    return (
        <div className="bg-card p-4 rounded-xl border">
            <h3 className="font-semibold mb-3">System Health</h3>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Database</span>
                    <span className="text-green-500">Healthy</span>
                </div>

                <div className="flex justify-between">
                    <span>Redis</span>
                    <span className="text-green-500">Healthy</span>
                </div>

                <div className="flex justify-between">
                    <span>Payments</span>
                    <span className="text-yellow-500">Degraded</span>
                </div>
            </div>
        </div>
    );
}