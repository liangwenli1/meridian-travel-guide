import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CityGuide } from "@/types/guide";
import { Card } from "@/components/ui/Card";

function parseAmount(value: string) {
  const nums = value.replaceAll(",", "").match(/\d+/g);
  if (!nums?.length) return 0;
  if (nums.length === 1) return Number(nums[0]);
  return Math.round((Number(nums[0]) + Number(nums[1])) / 2);
}

export function BudgetChart({ budget }: { budget: CityGuide["budget"] }) {
  const data = budget.breakdown.map((row) => ({
    item: row.item,
    Budget: parseAmount(row.budget),
    Mid: parseAmount(row.mid),
    Luxury: parseAmount(row.luxury),
  }));

  return (
    <Card>
      <p className="kicker text-muted">Daily spend shape</p>
      <p className="mt-1 text-sm text-muted">
        Midpoints from the ranges below, in {budget.currency}.
      </p>
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(232,232,200,0.12)" vertical={false} />
            <XAxis dataKey="item" tick={{ fill: "#8a8a76", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#8a8a76", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "#12120c",
                border: "1px solid rgba(232,232,200,0.18)",
                borderRadius: 12,
                color: "#f3f3e8",
              }}
            />
            <Legend wrapperStyle={{ color: "#8a8a76", fontSize: 12 }} />
            <Bar dataKey="Budget" fill="#6a6a58" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Mid" fill="#d4f03c" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Luxury" fill="#e8e8d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
