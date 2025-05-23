import { Card, CardContent } from "@/components/ui/card";
import { stats } from "../api/dashboard";

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{stat.value}</p>
                <span
                  className={`text-xs font-medium ${
                    stat.changeType === "increase"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
