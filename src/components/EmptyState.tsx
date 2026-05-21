import { type ReactNode } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  hints?: string[];
}

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  hints = [],
}: EmptyStateProps) {
    return (
        <div className="relative flex flex-col items-center justify-center py-24 px-6 text-center overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-linear-to-br from-card/10 via-transparent to-card/5" />
            <div className="absolute w-72 h-72 bg-background/20 rounded-full blur-3xl top-10 left-1/2 -translate-x-1/2 opacity-40" />

            {/* Card */}
            <div className="relative z-10 max-w-lg w-full rounded-2xl border border-border/50 bg-background/60 backdrop-blur-2xl shadow-xl p-8">
        
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="relative group">
                        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-70 group-hover:opacity-100 transition" />
                        <div className="relative flex items-center justify-center w-20 h-20 rounded-full border border-border bg-background/80 backdrop-blur-xl">
                            {icon}
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                    {title}
                </h2>

                {/* Description */}
                {description && (
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                )}

                {/* Hint chips (this is the magic) */}
                {hints.length > 0 && (
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                        {hints.map((hint, i) => (
                            <span
                                key={i}
                                className="text-sm px-3 py-1 rounded-full bg-muted/50 border border-border/50 backdrop-blur-sm hover:bg-muted transition"
                            >
                                {hint}
                            </span>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    {actionLabel && (
                        <Button onClick={onAction} className="gap-2">
                            {actionLabel}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    )}

                    {secondaryActionLabel && (
                        <Button variant="ghost" onClick={onSecondaryAction}>
                            {secondaryActionLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}