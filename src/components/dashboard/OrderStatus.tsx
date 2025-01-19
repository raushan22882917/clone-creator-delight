import { cn } from "@/lib/utils";

const orders = [
  {
    id: "11234",
    customer: "Sarah Wilson",
    item: "Brand New Phone",
    price: "$599",
    status: "Completed"
  },
  {
    id: "11235",
    customer: "Michael Chen",
    item: "Wireless Earbuds",
    price: "$129",
    status: "Pending"
  },
  {
    id: "11236",
    customer: "Emily Parker",
    item: "Smart Watch",
    price: "$299",
    status: "Failed"
  },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function OrderStatus() {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Order Status</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">ORDER#</th>
              <th className="text-left py-3 px-4">CUSTOMER</th>
              <th className="text-left py-3 px-4">ITEM</th>
              <th className="text-left py-3 px-4">PRICE</th>
              <th className="text-left py-3 px-4">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-3 px-4">{order.id}</td>
                <td className="py-3 px-4">{order.customer}</td>
                <td className="py-3 px-4">{order.item}</td>
                <td className="py-3 px-4">{order.price}</td>
                <td className="py-3 px-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getStatusColor(order.status)
                  )}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}