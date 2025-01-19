import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  className?: string;
}

function StatCard({ label, value, change, className }: StatCardProps) {
  const isPositive = change > 0;
  
  return (
    <div className={cn("p-4 rounded-lg", className)}>
      <p className="text-sm text-gray-600">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        <h3 className="text-xl font-semibold">{value}</h3>
        <span className={cn(
          "flex items-center text-sm",
          isPositive ? "text-green-500" : "text-red-500"
        )}>
          {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          {Math.abs(change)}%
        </span>
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        label="Total Revenue"
        value="$4,567.53"
        change={2.4}
        className="bg-blue-50"
      />
      <StatCard
        label="Total Orders"
        value="$1,999.23"
        change={-1.5}
        className="bg-yellow-50"
      />
      <StatCard
        label="Total Sales"
        value="$2,911.53"
        change={3.2}
        className="bg-green-50"
      />
      <StatCard
        label="Revenue Rate"
        value="$82,567.53"
        change={-0.8}
        className="bg-purple-50"
      />
    </div>
  );
}