export default function InfoRow({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-background last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground">{value}</span>
        </div>
    );
}