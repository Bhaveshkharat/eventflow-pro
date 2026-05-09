import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { revenueSeries, registrationsSeries, ticketBreakdown } from "@/data/mock";

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--popover-foreground)",
  boxShadow: "var(--shadow-elegant)",
};

export function RevenueAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={revenueSeries} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
        <Area type="monotone" dataKey="revenue" stroke="var(--brand)" strokeWidth={2.5} fill="url(#rev)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RegistrationsBarChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={registrationsSeries} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "color-mix(in oklab, var(--foreground) 5%, transparent)" }} />
        <Bar dataKey="visitors" fill="var(--brand)" radius={[6,6,0,0]} />
        <Bar dataKey="exhibitors" fill="var(--brand-2)" radius={[6,6,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TicketDonut() {
  const colors = ["var(--brand)", "var(--brand-2)", "var(--chart-3)"];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={ticketBreakdown} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={4}>
          {ticketBreakdown.map((_, i) => <Cell key={i} fill={colors[i]} stroke="var(--background)" strokeWidth={3} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
