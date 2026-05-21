import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "../../lib/utils";

/** ---------------- THEME ---------------- */
const THEMES = { light: "", dark: ".dark" } as const;

/** ---------------- CONFIG ---------------- */
export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

/** ---------------- CONTEXT ---------------- */
type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within ChartContainer");
  return ctx;
}

/** ---------------- CONTAINER ---------------- */
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ReactNode;
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uid = React.useId();
  const chartId = `chart-${id || uid.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        data-chart={chartId}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

/** ---------------- STYLE ---------------- */
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const entries = Object.entries(config).filter(
    ([, c]) => c.theme || c.color
  );

  if (!entries.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => {
            return `
${prefix} [data-chart=${id}] {
${entries
  .map(([key, item]) => {
    const color =
      item.theme?.[theme as keyof typeof item.theme] ?? item.color;
    return color ? `  --color-${key}: ${color};` : "";
  })
  .join("\n")}
}
`;
          })
          .join("\n"),
      }}
    />
  );
};

/** ---------------- TOOLTIP TYPES (FIXED) ---------------- */
type TooltipPayloadItem = {
  dataKey?: string;
  name?: string;
  value?: number | string;
  color?: string;
  payload?: Record<string, unknown>;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  formatter?: (
    value: number | string,
    name: string,
    item: TooltipPayloadItem,
    index: number
  ) => React.ReactNode;
  indicator?: "dot" | "line" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
};

/** ---------------- TOOLTIP ---------------- */
const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel,
      hideIndicator,
      label,
      formatter,
    },
    ref
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) return null;

    const labelNode = !hideLabel ? (
      <div className="font-medium text-xs mb-1">{label}</div>
    ) : null;

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-background px-3 py-2 text-xs shadow-md",
          className
        )}
      >
        {labelNode}

        <div className="flex flex-col gap-1">
          {payload.map((item, index) => {
            const key = item.dataKey || item.name || "";
            const cfg = config[key];

            return (
              <div key={index} className="flex items-center gap-2">
                {!hideIndicator && (
                  <span
                    className={cn(
                      "h-2 w-2 rounded-sm",
                      indicator === "dot" && "rounded-full"
                    )}
                    style={{ backgroundColor: item.color }}
                  />
                )}

                <span className="text-muted-foreground">
                  {cfg?.label ?? item.name}
                </span>

                <span className="ml-auto font-mono">
                  {formatter
                    ? formatter(item.value ?? "", item.name ?? "", item, index)
                    : item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

ChartTooltipContent.displayName = "ChartTooltip";

/** ---------------- LEGEND ---------------- */
type LegendPayloadItem = {
  value?: string;
  color?: string;
  dataKey?: string;
};

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  {
    payload?: LegendPayloadItem[];
    className?: string;
  }
>(({ payload, className }, ref) => {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div ref={ref} className={cn("flex gap-4", className)}>
      {payload.map((item, i) => {
        const cfg = item.dataKey ? config[item.dataKey] : undefined;

        return (
          <div key={i} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span>{cfg?.label ?? item.value}</span>
          </div>
        );
      })}
    </div>
  );
});

ChartLegendContent.displayName = "ChartLegend";

/** ---------------- EXPORTS ---------------- */
export {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartStyle,
};