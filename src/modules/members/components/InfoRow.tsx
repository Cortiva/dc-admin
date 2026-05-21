interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: string | React.ReactNode;
}

export function InfoRows({ icon, label, value }: InfoRowProps) {
    return (
        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="text-muted-foreground">{icon}</div>
            <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="text-base">{value}</p>
            </div>
        </div>
    );
}