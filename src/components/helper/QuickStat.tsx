export default function QuickStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                {icon}
                <span className="text-xs">{label}</span>
            </div>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}
