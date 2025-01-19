import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "Task Updated",
    description: "Monthly sales report generated",
    time: "3 hrs ago",
    color: "bg-blue-500"
  },
  {
    id: 2,
    type: "Deal Added",
    description: "New client onboarded",
    time: "5 hrs ago",
    color: "bg-pink-500"
  },
  {
    id: 3,
    type: "Published Article",
    description: "Blog post published on Medium",
    time: "8 hrs ago",
    color: "bg-purple-500"
  },
  {
    id: 4,
    type: "Task Updated",
    description: "Project timeline updated",
    time: "1 day ago",
    color: "bg-yellow-500"
  },
];

export function RecentActivity() {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={cn("w-2 h-2 rounded-full mt-2", activity.color)} />
            <div>
              <p className="font-medium">{activity.type}</p>
              <p className="text-sm text-gray-500">{activity.description}</p>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}