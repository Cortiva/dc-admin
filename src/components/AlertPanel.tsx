export default function AlertsPanel() {
    return (
        <div className="bg-card border rounded-xl p-4">
            <h3 className="font-semibold mb-3">Critical Alerts</h3>

            <div className="space-y-3">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="font-medium">Payment Gateway Issue</p>
                    <p className="text-sm text-muted-foreground">
                        Response time increased by 300%
                    </p>
                </div>

                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <p className="font-medium">Failed Payouts</p>
                    <p className="text-sm text-muted-foreground">
                        23 payouts failed
                    </p>
                </div>
            </div>
        </div>
    );
}