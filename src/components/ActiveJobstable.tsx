export default function ActiveJobsTable() {
    return (
        <div className="bg-card p-4 rounded-xl border">
            <h3 className="font-semibold mb-4">Active Jobs</h3>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span>Leaking Pipe</span>
                    <span className="text-yellow-500">In Progress</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>No Power Issue</span>
                    <span className="text-blue-500">En Route</span>
                </div>
            </div>
        </div>
    );
}