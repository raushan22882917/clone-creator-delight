import { Sidebar } from "@/components/dashboard/Sidebar";
import { Stats } from "@/components/dashboard/Stats";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TrafficDonut } from "@/components/dashboard/TrafficDonut";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { OrderStatus } from "@/components/dashboard/OrderStatus";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.phone) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // First check if admin exists
      const { data: adminData, error: adminError } = await supabase
        .from('admin_data')
        .select('*')
        .eq('phone_number', session.user.phone)
        .single();
      
      if (adminError) {
        console.error('Error checking admin status:', adminError);
        toast({
          title: "Error",
          description: "Failed to verify admin status. Please try again.",
          variant: "destructive",
        });
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // If admin exists but is not verified
      if (!adminData?.is_verified) {
        toast({
          title: "Access Denied",
          description: "Your admin account is not verified yet.",
          variant: "destructive",
        });
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      
      // Update last login time
      const { error: updateError } = await supabase
        .from('admin_data')
        .update({ 
          last_login: new Date().toISOString(),
          login_attempts: (adminData.login_attempts || 0) + 1
        })
        .eq('phone_number', session.user.phone);

      if (updateError) {
        console.error('Error updating last login:', updateError);
      }

    } catch (error) {
      console.error('Error checking admin status:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsAdmin(false);
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