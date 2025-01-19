import { Sidebar } from "@/components/dashboard/Sidebar";
import { Stats } from "@/components/dashboard/Stats";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TrafficDonut } from "@/components/dashboard/TrafficDonut";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { OrderStatus } from "@/components/dashboard/OrderStatus";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        setIsAdmin(!!adminData?.is_verified);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back to your dashboard</p>
          </div>
          
          <Stats />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <RevenueChart />
            <TrafficDonut />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <RecentActivity />
            <OrderStatus />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;