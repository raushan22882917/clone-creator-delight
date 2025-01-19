import { Home, BarChart2, Users, Box, Settings, Mail, FileText, Image, ShoppingCart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: BarChart2, label: "Analytics", path: "/analytics" },
  { icon: Users, label: "Customers", path: "/customers" },
  { icon: Box, label: "Elements", path: "/elements" },
  { icon: Settings, label: "Charts", path: "/charts" },
  { icon: Mail, label: "Email", path: "/email" },
  { icon: FileText, label: "Form Pages", path: "/forms" },
  { icon: Image, label: "Gallery", path: "/gallery" },
  { icon: ShoppingCart, label: "E-commerce", path: "/ecommerce" },
  { icon: MessageSquare, label: "Documentation", path: "/docs" },
];

export function Sidebar() {
  return (
    <div className="hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 bottom-0 bg-[#1A1F2C] text-white p-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <span className="text-2xl font-bold">Lector.</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white hover:text-white hover:bg-white/10",
                  "focus:bg-white/10"
                )}
                asChild
              >
                <Link to={item.path} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}