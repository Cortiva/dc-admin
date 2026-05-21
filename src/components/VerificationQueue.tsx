export default function VerificationQueueCard() {
    return (
        <div className="bg-card p-4 rounded-xl border">
            <h3 className="font-semibold mb-3">Verification Queue</h3>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span>Pending</span>
                    <span className="font-bold">45</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>In Review</span>
                    <span className="font-bold">12</span>
                </div>

                <div className="pt-2">
                    <button className="w-full bg-primary text-white py-2 rounded-md text-sm">
                        Review Next Artisan
                    </button>
                </div>
            </div>
        </div>
    );
}